# Overview

This is a Next.js-based e-commerce platform for Just5Stars, a Spanish company specializing in digital marketing solutions for small businesses. The platform offers three main services: NFC display stands for collecting customer reviews, local SEO services for Google Maps positioning, and comprehensive digital presence management. The application handles product catalog management, order processing, email communications, payment integration with Stripe, and customer relationship management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework:** Next.js 15 with App Router architecture using TypeScript and React 19. The application follows a component-based structure with reusable UI components organized by feature areas.

**Styling:** Tailwind CSS 4 with custom CSS variables for theme management and responsive design across all device types.

**State Management:** React hooks (useState, useEffect) for local component state management. No global state management library is implemented.

**Client-Side Features:**
- UTM parameter tracking for marketing attribution
- Cookie consent management system
- Google Analytics integration with consent-based loading
- WhatsApp integration for mobile customer support
- Dynamic pricing based on URL parameters
- Real-time form validation and user feedback

## Backend Architecture

**API Routes:** Next.js API routes handling:
- Order processing and storage (`/api/store-order`)
- Email sending for confirmations and notifications
- Stripe webhook processing for payment confirmations
- Business search and validation
- Rate limiting for geolocation services

**Database:** LibSQL (Turso) for order management with the following schema:
- Orders table with comprehensive business and customer data
- Order status tracking (pending, confirmed, cancelled)
- UTM parameter storage for marketing attribution
- Stripe integration data storage

**Email System:** Nodemailer with SMTP configuration for:
- Order confirmations to customers
- New order notifications to admin
- Contact form submissions
- Customer support communications

## Data Management

**Product Catalog:** JSON-based configuration system:
- `products.json` - Product definitions and features
- `prices.json` - Dynamic pricing structure with discounts
- `vouchers.json` - Promotional code management
- `stock.json` - Inventory tracking

**Order Processing Flow:**
1. Product selection and configuration
2. Customer data collection with business validation
3. Order storage in database
4. Stripe payment processing
5. Email confirmations
6. Webhook confirmation for payment status

## External Dependencies

**Payment Processing:** Stripe integration for:
- Checkout session management
- Payment intent processing
- Webhook handling for order confirmation
- Invoice generation and PDF attachment

**Email Service:** SMTP-based email system using Nodemailer with:
- HTML and text email templates
- File attachment support
- Delivery confirmation tracking

**Google Services:**
- Google Analytics for user behavior tracking
- Google Maps API for business location validation
- Google Places API for business information retrieval

**Facebook Integration:** Facebook Business SDK for marketing pixel tracking and conversion optimization.

**Database Service:** Turso (LibSQL) cloud database for:
- Order data persistence
- Customer information storage
- Transaction tracking and reporting

**Additional Services:**
- Crypto-js for data hashing and security
- Rate limiting system for API protection
- QR code generation for review links
- Geolocation services with rate limiting