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
