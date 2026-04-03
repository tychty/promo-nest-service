import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeSchema } from './dto/create-promo-code.dto';
import type { CreatePromoCodeDto } from './dto/create-promo-code.dto';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePromoCodeSchema)) dto: CreatePromoCodeDto,
  ) {
    return this.promoCodesService.create(dto);
  }

  @Get()
  findAll() {
    return this.promoCodesService.findAll();
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.promoCodesService.findByCode(code);
  }
}
