import { NextRequest, NextResponse } from "next/server";
import { getOrderStats, initializeDatabase } from "@/app/utils/database";

// Initialize database on first request
let isDbInitialized = false;

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!isDbInitialized) {
      await initializeDatabase();
      isDbInitialized = true;
    }

    // Basic authentication check (optional)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get order statistics
    const stats = await getOrderStats();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting order stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order statistics' },
      { status: 500 }
    );
  }
} 