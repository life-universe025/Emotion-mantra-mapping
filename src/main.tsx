import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import './i18n'
import './index.css'
// Profile page is rendered via App route proxy; no direct import needed here

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/profile', element: <UserProfilePageWrapper /> },
  { path: '/practice/:emotionId', element: <PracticePageWrapper /> },
  { path: '/mantra/:mantraSlug', element: <MantraPageWrapper /> },
], {
  future: {
    v7_startTransition: true,
  } as any,
})

function UserProfilePageWrapper() {
  // Simple auth gate using local App logic via URL params would be ideal; reuse Supabase directly here
  // to avoid circular import from App.
  return <AppRouteProxy to="profile" />
}

function PracticePageWrapper() {
  return <AppRouteProxy to="practice" />
}

function MantraPageWrapper() {
  return <AppRouteProxy to="mantra" />
}

function AppRouteProxy({ to }: { to: 'profile' | 'practice' | 'mantra' }) {
  // Render App; App will read initial state from URL
  return <App initialRoute={to} /> as any
}

// Create the root element reference
const rootElement = document.getElementById('root')!

// Get or create the React root
function getOrCreateRoot() {
  let root = (rootElement as any)._reactRootContainer
  if (!root) {
    root = ReactDOM.createRoot(rootElement)
    ;(rootElement as any)._reactRootContainer = root
  }
  return root
}

// Render the app
getOrCreateRoot().render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
