import { NextRequest, NextResponse } from 'next/server'
import { doc, deleteDoc, writeBatch } from 'firebase/firestore'
import { getFirebaseFirestore, isFirestoreError } from '@/lib/firebase'

interface CleanupRequest {
  uid: string
}

export async function POST(request: NextRequest) {
  try {
    
    // Parse request body
    let body: CleanupRequest
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    const { uid } = body

    // Validate required fields
    if (!uid || typeof uid !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid uid' },
        { status: 400 }
      )
    }


    // Initialize Firestore
    const db = getFirebaseFirestore()
    const batch = writeBatch(db)

    // Queue user profile for deletion
    batch.delete(doc(db, 'users', uid))

    // Note: In a production app, you might also want to clean up:
    // - User's messages in chat rooms
    // - User's posts or comments
    // - User's uploaded files in Storage
    // - User's interactions/likes
    // For now, we're just cleaning up the main profile

    // Execute batch deletion
    await batch.commit()
    
    
    return NextResponse.json({ 
      success: true,
      message: 'Anonymous user data cleaned up successfully',
      uid 
    })

  } catch (error) {
    
    if (isFirestoreError(error)) {
      
      if (error.code === 'permission-denied') {
        return NextResponse.json(
          { error: 'Permission denied - check Firestore security rules' },
          { status: 403 }
        )
      }
      
      if (error.code === 'not-found') {
        // User already deleted or doesn't exist - still a success
        return NextResponse.json({ 
          success: true,
          message: 'User data already cleaned up or not found' 
        })
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error during cleanup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed - Use POST' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed - Use POST' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed - Use POST' },
    { status: 405 }
  )
}