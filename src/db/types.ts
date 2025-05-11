import { InferSelectModel } from 'drizzle-orm';
import { leads, persons, companies } from './schema';

export type Lead = InferSelectModel<typeof leads>;
export type Company = InferSelectModel<typeof companies>;
export type Person = InferSelectModel<typeof persons>;
