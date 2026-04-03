import {
  integer,
  pgTable,
  varchar,
  timestamp,
  check,
  smallint,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const promoCodes = pgTable(
  'promo_codes',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    code: varchar({ length: 100 }).notNull().unique(),
    discountPercent: smallint().notNull(),
    activationLimit: integer().notNull(),
    expiresAt: timestamp(),
  },
  (table) => [
    check(
      'discount_range',
      sql`${table.discountPercent} >= 1 AND ${table.discountPercent} <= 100`,
    ),
  ],
);
