import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const insert = vi.fn()
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  initialAuthType: null,
  supabase: {
    from: () => ({
      insert,
      select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    }),
  },
}))

import { AuthContext } from '../context/AuthContext'
import { CatalogContext } from '../context/CatalogContext'
import { ProgressProvider } from '../context/ProgressProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { rowToProduct, type Product } from '../lib/catalog'
import Quiz from './Quiz'

const product: Product = rowToProduct({
  id: 'p1', slug: 'test-mfp', naam: 'Test MFP', categorie: 'Multifunctionals', korte_omschrijving: 'k', omschrijving: 'o',
  kenmerken: ['k'], doelgroep: 'd', verkoopargumenten: ['v'], afbeelding_url: '', video_url: '', volgorde: 0, gepubliceerd: true,
  en: null, created_at: '', updated_at: '',
  quiz_questions: Array.from({ length: 5 }, (_, i) => ({
    id: `q${i}`, product_id: 'p1', vraag: `Vraag nummer ${i}?`, opties: [`goed ${i}`, `fout ${i}a`, `fout ${i}b`, `fout ${i}c`],
    juiste_antwoord: 0, uitleg: `Uitleg ${i}`, volgorde: i,
  })),
})

const auth = {
  session: null, user: { id: 'gebruiker-1' }, profile: null, rol: 'gebruiker', isAdmin: false, loading: false, needsPassword: false,
  signIn: vi.fn(), signOut: vi.fn(), requestPasswordReset: vi.fn(), setPassword: vi.fn(), verifyToken: vi.fn(),
} as unknown as React.ContextType<typeof AuthContext>

function setup() {
  return render(
    <LanguageProvider>
      <AuthContext.Provider value={auth}>
        <CatalogContext.Provider value={{ products: [product], loading: false, error: false, reload: () => {} }}>
          <ProgressProvider>
            <MemoryRouter initialEntries={['/product/test-mfp/quiz']}>
              <Routes><Route path="product/:slug/quiz" element={<Quiz />} /></Routes>
            </MemoryRouter>
          </ProgressProvider>
        </CatalogContext.Provider>
      </AuthContext.Provider>
    </LanguageProvider>,
  )
}

const optionButton = (text: string) => screen.getByRole('button', { name: new RegExp(text) })

beforeEach(() => {
  insert.mockReset()
  insert.mockResolvedValue({ error: null })
})

describe('Quiz-pagina', () => {
  async function play(user: ReturnType<typeof userEvent.setup>, wrongAnswers: number) {
    for (let i = 0; i < 5; i++) {
      const n = Number(/nummer (\d)/.exec(screen.getByRole('group').textContent ?? '')?.[1])
      await user.click(optionButton(i < wrongAnswers ? `fout ${n}a` : `goed ${n}`))
      await user.click(screen.getByRole('button', { name: i === 4 ? 'Bekijk resultaat' : 'Volgende vraag' }))
    }
  }

  it('slaat een perfecte score op in quiz_results voor de ingelogde gebruiker', async () => {
    const user = userEvent.setup()
    setup()
    await play(user, 0)
    expect(await screen.findByRole('heading', { name: 'Perfect!' })).toBeInTheDocument()
    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith({ user_id: 'gebruiker-1', product_id: 'p1', score: 5, gehaald: true })
  })

  it('slaat een onvoldoende score op met gehaald = false', async () => {
    const user = userEvent.setup()
    setup()
    await play(user, 3)
    expect(await screen.findByRole('heading', { name: 'Nog niet gehaald' })).toBeInTheDocument()
    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
    expect(insert).toHaveBeenCalledWith({ user_id: 'gebruiker-1', product_id: 'p1', score: 2, gehaald: false })
  })

  it('meldt het als het opslaan mislukt', async () => {
    insert.mockResolvedValue({ error: { message: 'netwerk' } })
    const user = userEvent.setup()
    setup()
    await play(user, 0)
    expect(await screen.findByRole('alert')).toHaveTextContent('Je score kon niet worden opgeslagen')
  })

  it('toont het juiste antwoord bij een fout', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(optionButton('fout 0a'))
    expect(screen.getByText('Helaas, dat is niet juist.')).toBeInTheDocument()
    expect(screen.getByText('Uitleg 0')).toBeInTheDocument()
  })
})
