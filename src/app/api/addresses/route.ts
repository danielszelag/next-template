import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDB, userAddresses } from '@/db'
import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// GET /api/addresses - Get all addresses for authenticated user
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = createDB()
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
    const db = createDB()
    
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

    const db = createDB()
    
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

    const db = createDB()
    
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
