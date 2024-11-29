# Partner Pipeline Tracker

A React application for tracking partner pipeline opportunities, initiatives, and notes.

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Accessing on Bolt

### With StackBlitz Account (Recommended)
1. Visit [StackBlitz](https://stackblitz.com)
2. Sign up using:
   - GitHub account, or
   - Email address
3. Go to your dashboard
4. Open the project "partner-pipeline-tracker"

### Without Account (Quick Access)
1. Visit the project's Bolt URL directly
2. Click "Fork" to create your own copy
3. Your work will be saved in your browser's local storage
4. Bookmark the URL to return to your work

Note: Creating a StackBlitz account is recommended to:
- Persist your work across devices
- Access your projects from anywhere
- Collaborate with others
- Keep your work backed up

The project will automatically:
- Set up the development environment
- Install dependencies
- Start the development server

## Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd partner-pipeline-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will start and be available at `http://localhost:5173`

## Features

- Track partner pipeline opportunities
- Manage partner initiatives
- Add and track notes for opportunities
- Upload pipeline data via Excel files
- View quarterly performance metrics
- Manage partner list and categories

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router for navigation
- XLSX for Excel file processing

## Development on Bolt

To continue development on Bolt:

1. All changes are automatically saved
2. The development server automatically restarts when needed
3. Your work is persisted based on your access method:
   - StackBlitz account: Saved to your account
   - No account: Saved in browser storage
4. You can fork the project to create your own version
5. Collaborate by sharing your Bolt URL with others