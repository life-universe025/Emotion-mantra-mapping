import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
// Profile page is rendered via App route proxy; no direct import needed here

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/profile', element: <UserProfilePageWrapper /> },
  { path: '/practice/:emotionId', element: <PracticePageWrapper /> },
])

function UserProfilePageWrapper() {
  // Simple auth gate using local App logic via URL params would be ideal; reuse Supabase directly here
  // to avoid circular import from App.
  return <AppRouteProxy to="profile" />
}

function PracticePageWrapper() {
  return <AppRouteProxy to="practice" />
}

function AppRouteProxy({ to }: { to: 'profile' | 'practice' }) {
  // Render App; App will read initial state from URL
  return <App initialRoute={to} /> as any
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
