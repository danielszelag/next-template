import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createDB } from '@/db'
import { cleaningSessions } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

interface BookingUpdateRequest {
  date: string
  time: string
  addressId: string
  serviceType?: string
  notes?: string
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id
    const body = await request.json() as BookingUpdateRequest
    const { date, time, addressId, serviceType = 'standard', notes } = body

    // Combine date and time into a scheduled timestamp
    const scheduledDateTime = new Date(`${date}T${time}:00`)

    const db = createDB()

    // Update the booking (only if it belongs to the current user)
    await db
      .update(cleaningSessions)
      .set({
        addressId,
        serviceType,
        scheduledTime: scheduledDateTime,
        notes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(cleaningSessions.id, bookingId),
          eq(cleaningSessions.userId, userId)
        )
      )

    return NextResponse.json({ 
      success: true, 
      message: 'Booking updated successfully' 
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
