import { drizzle } from 'drizzle-orm/d1'
import { drizzle as drizzleLocal } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import path from 'path'
import fs from 'fs'

// For local development, use the local D1 database file
function getLocalDatabase() {
  const d1Dir = path.join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject')
  
  // Find the .sqlite file in the directory
  if (fs.existsSync(d1Dir)) {
    const files = fs.readdirSync(d1Dir)
    const dbFile = files.find(file => file.endsWith('.sqlite'))
    
    if (dbFile) {
      const dbPath = path.join(d1Dir, dbFile)
      const sqlite = new Database(dbPath)
      return drizzleLocal(sqlite, { schema })
    }
  }
  
  // Fallback: create a temporary in-memory database for development
  console.warn('Local D1 database not found, using in-memory database for development')
  const sqlite = new Database(':memory:')
  return drizzleLocal(sqlite, { schema })
}

// This will be initialized with the actual D1 database in API routes
export function createDB(d1?: D1Database) {
  // In development, use local SQLite database
  if (process.env.NODE_ENV === 'development' && !d1) {
    return getLocalDatabase()
  }
  
  // In production, use the D1 database binding
  if (!d1) {
    throw new Error('D1 database binding not found')
  }
  
  return drizzle(d1, { schema })
}

export type DB = ReturnType<typeof createDB>
export * from './schema'
