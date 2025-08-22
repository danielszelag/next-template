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

// Function to get D1 binding from OpenNext/Cloudflare context
function getD1Binding(): D1Database | undefined {
  try {
    // Method 1: Check for Cloudflare context using the symbol approach
    const cloudflareContextSymbol = Symbol.for("__cloudflare-context__")
    const cloudflareContext = (globalThis as typeof globalThis & { 
      [cloudflareContextSymbol]?: {
        env?: { DB?: D1Database }
      }
    })[cloudflareContextSymbol]
    
    if (cloudflareContext?.env?.DB) {
      return cloudflareContext.env.DB
    }

    // Method 2: Try to access through OpenNext's async local storage
    const openNextAls = (globalThis as typeof globalThis & { 
      __openNextAls?: { 
        getStore?: () => { 
          cloudflare?: { 
            env?: { DB?: D1Database }
          }
          env?: { DB?: D1Database }
        } 
      } 
    }).__openNextAls

    if (openNextAls?.getStore) {
      const store = openNextAls.getStore()
      if (store?.cloudflare?.env?.DB) {
        return store.cloudflare.env.DB
      }
      if (store?.env?.DB) {
        return store.env.DB
      }
    }

    // Method 3: Check global env (fallback)
    const globalEnv = globalThis as typeof globalThis & { 
      env?: { DB?: D1Database }
      DB?: D1Database
    }
    
    if (globalEnv.env?.DB) {
      return globalEnv.env.DB
    }
    
    if (globalEnv.DB) {
      return globalEnv.DB
    }
    
    return undefined
  } catch (error) {
    console.error('Error getting D1 binding:', error)
    return undefined
  }
}

// This will be initialized with the actual D1 database in API routes
export function createDB(d1?: D1Database) {
  // Check database mode from environment
  const databaseMode = process.env.DATABASE_MODE || process.env.NODE_ENV
  
  // In development mode, use local SQLite database
  if (databaseMode === 'development' && !d1) {
    return getLocalDatabase()
  }
  
  // In production mode, try to get D1 from different sources
  if (!d1) {
    d1 = getD1Binding()
    
    if (!d1) {
      // List available globals for debugging
      const globals = Object.keys(globalThis).filter(key => 
        !key.startsWith('_') || key.startsWith('__') || key === 'env' || key === 'DB'
      ).sort()
      
      // Check cloudflare context
      const cloudflareContextSymbol = Symbol.for("__cloudflare-context__")
      const cloudflareContext = (globalThis as typeof globalThis & { 
        [cloudflareContextSymbol]?: {
          env?: Record<string, unknown>
        }
      })[cloudflareContextSymbol]
      
      const cloudflareInfo = cloudflareContext ? {
        hasCloudflareContext: true,
        envKeys: cloudflareContext.env ? Object.keys(cloudflareContext.env) : []
      } : { hasCloudflareContext: false }
      
      throw new Error(`D1 database binding not found. DATABASE_MODE=${databaseMode}. Globals: ${globals.join(', ')}. Cloudflare: ${JSON.stringify(cloudflareInfo)}`)
    }
  }
  
  return drizzle(d1, { schema })
}

export type DB = ReturnType<typeof createDB>
export * from './schema'
