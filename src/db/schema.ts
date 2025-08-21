import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// User profiles table
export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // Clerk user ID
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  balance: integer('balance').default(0), // Balance in grosze (cents)
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
})

// User addresses table
export const userAddresses = sqliteTable('user_addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  name: text('name').notNull(), // Dom, Biuro, etc.
  street: text('street').notNull(),
  postalCode: text('postal_code').notNull(),
  city: text('city').notNull(),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`
  ),
})

export const cleaningSessions = sqliteTable('cleaning_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  addressId: text('address_id'), // Reference to userAddresses
  streamId: text('stream_id'), // Cloudflare Stream video ID
  liveInputId: text('live_input_id'), // Cloudflare Stream live input ID

  // Session details
  cleanerName: text('cleaner_name').notNull(),
  cleanerAvatar: text('cleaner_avatar'),
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

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert

export type UserAddress = typeof userAddresses.$inferSelect
export type NewUserAddress = typeof userAddresses.$inferInsert

export type CleaningSession = typeof cleaningSessions.$inferSelect
export type NewCleaningSession = typeof cleaningSessions.$inferInsert
