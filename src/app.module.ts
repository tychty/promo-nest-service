import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';

@Module({
  imports: [DatabaseModule, PromoCodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
