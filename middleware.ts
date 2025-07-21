
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Redirect /herramientas/enlace-resenas-google to /herramientas/enlace-reseñas-google
  if (url.pathname === '/herramientas/enlace-resenas-google') {
    url.pathname = '/herramientas/enlace-reseñas-google'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/herramientas/enlace-resenas-google',
  ]
}
