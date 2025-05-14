import {
  pgSchema,
  serial,
  varchar,
  jsonb,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const schema = pgSchema("polyglotflow");

export const users = schema.table("users", {
  id: serial("id").primaryKey().notNull(),

  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password_hash: varchar("password_hash", { length: 255 }),

  payload: jsonb("payload"),
  metadata: jsonb("metadata"),

  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const languages = schema.table("languages", {
  id: serial("id").primaryKey().notNull(),

  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  background_image_url: text("background_image_url"),

  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const notes = schema.table("notes", {
  id: serial("id").primaryKey().notNull(),

  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  language_id: integer("language_id")
    .references(() => languages.id)
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", {
    enum: ["reading", "writing", "speaking", "listening", "grammar"],
  }).notNull(),
  difficulty: varchar("difficulty", {
    enum: ["easy", "medium", "hard"],
  }).notNull(),
  status: varchar("status", {
    enum: ["pending", "reviewed", "archived"],
  }).default("pending"),

  reviewed_at: timestamp("reviewed_at"),
  archived_at: timestamp("archived_at"),

  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const noteTags = schema.table("note_tags", {
  id: serial("id").primaryKey().notNull(),

  note_id: integer("note_id")
    .references(() => notes.id)
    .notNull(),

  tag: varchar("tag", { length: 250 }).notNull(),

  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const noteAttachments = schema.table("note_attachments", {
  id: serial("id").primaryKey().notNull(),
  note_id: integer("note_id")
    .references(() => notes.id)
    .notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  original_filename: varchar("original_filename", { length: 255 }).notNull(),
  mime_type: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

// Define relations
export const notesRelations = relations(notes, ({ many }) => ({
  tags: many(noteTags),
  attachments: many(noteAttachments),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.note_id],
    references: [notes.id],
  }),
}));

export const noteAttachmentsRelations = relations(
  noteAttachments,
  ({ one }) => ({
    note: one(notes, {
      fields: [noteAttachments.note_id],
      references: [notes.id],
    }),
  })
);
