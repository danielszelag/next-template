import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDB } from '@/db'
import { cleaningSessions, userAddresses } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'

interface BookingRequest {
  date: string
  time: string
  addressId: string
  serviceType?: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as BookingRequest
    const { date, time, addressId, serviceType = 'standard', notes } = body

    // Combine date and time into a scheduled timestamp
    const scheduledDateTime = new Date(`${date}T${time}:00`)

    const db = createDB()

    // Create new booking
    const newBooking = {
      id: nanoid(),
      userId,
      addressId,
      cleanerName: 'Zespół CleanRecord', // Default cleaner name
      serviceType,
      scheduledTime: scheduledDateTime,
      status: 'scheduled' as const,
      notes,
    }

    await db.insert(cleaningSessions).values(newBooking)

    return NextResponse.json({ 
      success: true, 
      bookingId: newBooking.id,
      message: 'Booking created successfully' 
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = createDB()

    // Get all bookings for the user
    const bookings = await db
      .select()
      .from(cleaningSessions)
      .where(eq(cleaningSessions.userId, userId))
      .orderBy(desc(cleaningSessions.scheduledTime))

    // Get all user addresses
    const addresses = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, userId))

    // Create a map of addressId to addressName
    const addressMap = new Map(addresses.map(addr => [addr.id, addr.name]))

    // Add address names to bookings
    const bookingsWithAddresses = bookings.map(booking => ({
      ...booking,
      addressName: booking.addressId ? addressMap.get(booking.addressId) : null
    }))

    return NextResponse.json(bookingsWithAddresses)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const db = createDB()

    // First verify the booking belongs to the user
    const booking = await db
      .select()
      .from(cleaningSessions)
      .where(eq(cleaningSessions.id, bookingId))
      .limit(1)

    if (booking.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking[0].userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the booking
    await db
      .delete(cleaningSessions)
      .where(eq(cleaningSessions.id, bookingId))

    return NextResponse.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
