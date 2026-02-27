# TNT EDGE - Modern Analytics Dashboard

A modern, responsive analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. This dashboard provides a clean, optimized interface for viewing marketing performance metrics across desktop and mobile devices.

## Features

- 🎨 **Modern UI/UX**: Clean, intuitive interface with improved user experience
- 📱 **Fully Responsive**: Optimized for both desktop and mobile devices
- 🎯 **Comprehensive Metrics**: View spend, impressions, clicks, purchases, ROAS, and more
- 🔍 **Advanced Filtering**: Filter by client, producer, writer, editor, account, campaign, adset, and ad
- 📊 **Data Visualization**: Ready for chart integration and data visualization
- ⚡ **Fast Performance**: Built with Next.js 14 for optimal performance

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx          # Top navigation header
│   ├── Sidebar.tsx         # Left navigation sidebar
│   ├── FilterControls.tsx  # Top filter controls
│   ├── FilterSection.tsx   # Filter tabs section
│   ├── DataTable.tsx       # Main data table component
│   └── Pagination.tsx      # Pagination controls
├── lib/
│   ├── utils.ts            # Utility functions
│   └── mockData.ts         # Mock data for development
├── types/
│   └── index.ts            # TypeScript type definitions
└── package.json
```

## API Integration

The dashboard is designed to integrate with multiple data sources:

### Marketing Platforms
- Meta (Facebook/Instagram)
- Google Ads
- Amazon Ads
- TikTok Ads

### Client CRMs
- Shopify
- Konnective
- Limelight
- Clickbank
- Buygoods
- And more...

To integrate with these APIs, you'll need to:

1. Create API route handlers in `app/api/`
2. Replace mock data in `lib/mockData.ts` with actual API calls
3. Add authentication and error handling
4. Implement data caching and refresh mechanisms

## Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 1024px (collapsible sidebar, card-based table view)
- **Desktop**: ≥ 1024px (full sidebar, table view)

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme. The primary color is currently set to red (`primary-600`).

### Data Structure
Modify `types/index.ts` to adjust the data structure to match your API responses.

## Building for Production

```bash
npm run build
npm start
```

## License

Copyright 2022 © All rights reserved.


