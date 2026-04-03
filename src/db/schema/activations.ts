import {
  pgTable,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { promoCodes } from './promo_codes';

export const activations = pgTable(
  'activations',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    promoCodeId: integer()
      .notNull()
      .references(() => promoCodes.id, { onDelete: 'cascade' }),
    email: varchar({ length: 255 }).notNull(),
    activatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('activations_promo_code_email_idx').on(
      table.promoCodeId,
      table.email,
    ),
  ],
);
