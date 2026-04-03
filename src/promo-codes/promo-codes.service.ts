import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { promoCodes } from '../db/schema/promo_codes';
import type { CreatePromoCodeDto } from './dto/create-promo-code.dto';
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
}
