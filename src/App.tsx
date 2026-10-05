import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ProgressProvider } from './context/ProgressProvider'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <LanguageProvider>
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="product/:id/quiz" element={<Quiz />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
    </LanguageProvider>
  )
}
