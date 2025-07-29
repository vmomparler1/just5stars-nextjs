
import { NextRequest, NextResponse } from "next/server";

// In-memory storage for rate limiting (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 60 * 1000); // 1 hour

const RATE_LIMIT = 20; // 20 requests per IP
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default IP if none found
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const now = Date.now();
    
    console.log(`Geolocation rate limit check for IP: ${clientIP}`);
    
    // Get or create rate limit data for this IP
    let rateLimitData = rateLimitMap.get(clientIP);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Reset or create new rate limit data
      rateLimitData = {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW
      };
      rateLimitMap.set(clientIP, rateLimitData);
      
      return NextResponse.json({ 
        allowed: true, 
        remaining: RATE_LIMIT - 1,
        resetTime: rateLimitData.resetTime
      });
    }
    
    // Check if limit exceeded
    if (rateLimitData.count >= RATE_LIMIT) {
      console.log(`Rate limit exceeded for IP: ${clientIP} (${rateLimitData.count}/${RATE_LIMIT})`);
      return NextResponse.json({ 
        allowed: false, 
        remaining: 0,
        resetTime: rateLimitData.resetTime,
        error: 'Límite de búsquedas de ubicación excedido. Inténtalo más tarde.'
      }, { status: 429 });
    }
    
    // Increment count and allow request
    rateLimitData.count++;
    rateLimitMap.set(clientIP, rateLimitData);
    
    console.log(`Geolocation request allowed for IP: ${clientIP} (${rateLimitData.count}/${RATE_LIMIT})`);
    
    return NextResponse.json({ 
      allowed: true, 
      remaining: RATE_LIMIT - rateLimitData.count,
      resetTime: rateLimitData.resetTime
    });
    
  } catch (error) {
    console.error('Error in geolocation rate limiting:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitData = rateLimitMap.get(clientIP);
    const now = Date.now();
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      return NextResponse.json({ 
        remaining: RATE_LIMIT,
        resetTime: now + RATE_LIMIT_WINDOW
      });
    }
    
    return NextResponse.json({ 
      remaining: Math.max(0, RATE_LIMIT - rateLimitData.count),
      resetTime: rateLimitData.resetTime
    });
    
  } catch (error) {
    console.error('Error checking rate limit status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
