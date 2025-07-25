import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const cleaningSessions = sqliteTable('cleaning_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  streamId: text('stream_id'), // Cloudflare Stream video ID
  liveInputId: text('live_input_id'), // Cloudflare Stream live input ID

  // Session details
  cleanerName: text('cleaner_name').notNull(),
  cleanerAvatar: text('cleaner_avatar'),
  location: text('location').notNull(),
  serviceType: text('service_type').notNull().default('standard'), // standard, deep, window, etc.

  // Timing
  scheduledTime: integer('scheduled_time', { mode: 'timestamp' }),
  startTime: integer('start_time', { mode: 'timestamp' }),
  endTime: integer('end_time', { mode: 'timestamp' }),
  duration: integer('duration'), // in minutes

  // Status
  status: text('status').notNull().default('scheduled'), // scheduled, live, completed, cancelled

  // Video/Stream data
  recordingUrl: text('recording_url'),
  thumbnailUrl: text('thumbnail_url'),
  playbackId: text('playback_id'), // Cloudflare Stream playback ID

  // Metadata
  notes: text('notes'),
  rating: integer('rating'), // 1-5 stars
  customerFeedback: text('customer_feedback'),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
})

export type CleaningSession = typeof cleaningSessions.$inferSelect
export type NewCleaningSession = typeof cleaningSessions.$inferInsert
