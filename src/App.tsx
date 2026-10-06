import { createHashRouter, RouterProvider } from 'react-router-dom'
import { AdminRoute } from './components/AdminRoute'
import { AuthShell } from './components/AuthShell'
import { ConfigMissing } from './components/ConfigMissing'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import { CatalogProvider } from './context/CatalogProvider'
import { ProgressProvider } from './context/ProgressProvider'
import { LanguageProvider } from './i18n/LanguageProvider'
import { isSupabaseConfigured } from './lib/supabase'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import ProductEdit from './pages/admin/ProductEdit'
import ConfirmToken from './pages/auth/ConfirmToken'
import LinkExpired from './pages/auth/LinkExpired'
import Login from './pages/auth/Login'
import SetPassword from './pages/auth/SetPassword'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Quiz from './pages/Quiz'

// HashRouter-variant als data router: nodig voor useBlocker (waarschuwing bij niet-opgeslagen wijzigingen).
const router = createHashRouter([
  {
    element: <AuthShell />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'wachtwoord-instellen', element: <SetPassword /> },
      { path: 'auth/bevestigen', element: <ConfirmToken /> },
      { path: 'link-verlopen', element: <LinkExpired /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'product/:slug', element: <Product /> },
          { path: 'product/:slug/quiz', element: <Quiz /> },
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { index: true, element: <AdminProducts /> },
                  { path: 'producten/nieuw', element: <ProductEdit /> },
                  { path: 'producten/:id', element: <ProductEdit /> },
                  { path: 'gebruikers', element: <AdminUsers /> },
                ],
              },
            ],
          },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])

export default function App() {
  if (!isSupabaseConfigured) return <ConfigMissing />
  return (
    <LanguageProvider>
      <AuthProvider>
        <CatalogProvider>
          <ProgressProvider>
            <RouterProvider router={router} />
          </ProgressProvider>
        </CatalogProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
