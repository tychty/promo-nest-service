import { Module } from '@nestjs/common';
import { db } from '.';

const dbProvider = {
  provide: 'DB_CONNECTION',
  useValue: db,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
