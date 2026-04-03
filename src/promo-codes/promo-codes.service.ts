import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, count, sql } from 'drizzle-orm';
import { promoCodes } from '../db/schema/promo_codes';
import { activations } from '../db/schema/activations';
import type { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import type { ActivatePromoCodeDto } from './dto/activate-promo-code.dto';
import { isDuplicateKeyError } from '../common/db-errors';

@Injectable()
export class PromoCodesService {
  constructor(
    @Inject('DB_CONNECTION')
    private readonly db: NodePgDatabase,
  ) {}

  async create(dto: CreatePromoCodeDto) {
    try {
      const [promoCode] = await this.db
        .insert(promoCodes)
        .values({
          code: dto.code,
          discountPercent: dto.discountPercent,
          activationLimit: dto.activationLimit,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        })
        .returning();
      return promoCode;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException('Promo code already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.db.select().from(promoCodes);
  }

  async findByCode(code: string) {
    const [promoCode] = await this.db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.code, code))
      .limit(1);

    if (!promoCode) {
      throw new NotFoundException(`Promo code '${code}' not found`);
    }
    return promoCode;
  }

  async activate(code: string, dto: ActivatePromoCodeDto) {
    const promoCode = await this.findByCode(code);

    if (promoCode.expiresAt !== null && promoCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException('Promo code has expired');
    }

    const [{ total, byEmail }] = await this.db
      .select({
        total: count(),
        byEmail: sql<number>`count(*) filter (where ${activations.email} = ${dto.email})`,
      })
      .from(activations)
      .where(eq(activations.promoCodeId, promoCode.id));

    if (byEmail > 0) {
      throw new ConflictException(
        'Email has already activated this promo code',
      );
    }

    if (total >= promoCode.activationLimit) {
      throw new ConflictException('Promo code activation limit reached');
    }

    try {
      const [activation] = await this.db
        .insert(activations)
        .values({ promoCodeId: promoCode.id, email: dto.email })
        .returning();
      return activation;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(
          'Email has already activated this promo code',
        );
      }
      throw error;
    }
  }
}
