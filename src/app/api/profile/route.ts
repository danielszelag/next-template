import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDB, userProfiles } from '@/db'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Access D1 database from Cloudflare environment
function getDatabase(): ReturnType<typeof createDB> {
  // In development mode, use local database
  if (process.env.NODE_ENV === 'development') {
    return createDB()
  }
  
  // In production, use Cloudflare D1 binding
  const env = (globalThis as { env?: { DB?: D1Database } }).env || (process.env as { DB?: D1Database })
  if (!env.DB) {
    throw new Error('D1 database binding not found. Make sure DB is configured in wrangler.toml')
  }
  return createDB(env.DB)
}

// GET /api/profile - Get user profile
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId))
    
    // Return first profile or null if none exists
    const profile = profiles[0] || null
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/profile - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      language?: string
    }

    const { firstName, lastName, email, phone, language } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields: firstName, lastName, email' }, { status: 400 })
    }

    const db = getDatabase()
    
    // Check if profile already exists
    const existingProfiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId))
    
    if (existingProfiles.length > 0) {
      // Update existing profile
      const updatedProfile = {
        firstName,
        lastName,
        email,
        phone: phone || null,
        language: language || 'pl',
        updatedAt: new Date(),
      }
      
      await db.update(userProfiles)
        .set(updatedProfile)
        .where(eq(userProfiles.userId, userId))
      
      return NextResponse.json({ ...updatedProfile, id: existingProfiles[0].id, userId })
    } else {
      // Create new profile
      const newProfile = {
        id: nanoid(),
        userId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        language: language || 'pl',
        accountBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.insert(userProfiles).values(newProfile)
      return NextResponse.json(newProfile, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
