import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDB, userAddresses } from '@/db'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Access D1 database from Cloudflare environment
function getDatabase(): ReturnType<typeof createDB> {
  // Check database mode from environment
  const databaseMode = process.env.DATABASE_MODE || process.env.NODE_ENV
  
  if (databaseMode === 'development') {
    return createDB()
  }
  
  // In production mode, try to get D1 binding from different sources
  // Method 1: From globalThis (Cloudflare Workers)
  const globalEnv = (globalThis as typeof globalThis & { env?: { DB?: D1Database } })?.env
  if (globalEnv?.DB) {
    return createDB(globalEnv.DB)
  }
  
  // Method 2: From process.env (alternative binding method)
  const processEnv = process.env as typeof process.env & { DB?: D1Database }
  if (processEnv?.DB) {
    return createDB(processEnv.DB)
  }
  
  // Method 3: Try to get from Cloudflare runtime
  if (typeof globalThis !== 'undefined' && 'DB' in globalThis) {
    return createDB((globalThis as typeof globalThis & { DB: D1Database }).DB)
  }
  
  throw new Error('D1 database binding not found. Make sure DB is configured in wrangler.toml and DATABASE_MODE is set correctly.')
}

// GET /api/addresses - Get all addresses for authenticated user
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const addresses = await db.select().from(userAddresses).where(eq(userAddresses.userId, userId))
    
    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      name?: string
      street?: string
      postalCode?: string
      city?: string
    }

    const { name, street, postalCode, city } = body

    if (!name || !street || !postalCode || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert into database
    const db = getDatabase()
    
    const newAddress = {
      id: nanoid(),
      userId,
      name,
      street,
      postalCode,
      city,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(userAddresses).values(newAddress)

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/addresses - Update existing address
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      id?: string
      name?: string
      street?: string
      postalCode?: string
      city?: string
    }

    const { id, name, street, postalCode, city } = body

    if (!id || !name || !street || !postalCode || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDatabase()
    
    // Update the address - ensure it belongs to the authenticated user
    const updatedAddress = await db
      .update(userAddresses)
      .set({
        name,
        street,
        postalCode,
        city,
        updatedAt: new Date(),
      })
      .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
      .returning()

    if (updatedAddress.length === 0) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json(updatedAddress[0])
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/addresses - Delete existing address
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      id?: string
    }

    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing address ID' }, { status: 400 })
    }

    const db = getDatabase()
    
    // Delete the address - ensure it belongs to the authenticated user
    const deletedAddress = await db
      .delete(userAddresses)
      .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
      .returning()

    if (deletedAddress.length === 0) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
