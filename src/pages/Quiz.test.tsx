import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProgressProvider } from '../context/ProgressProvider'
import { products } from '../data/products'
import { loadProgress } from '../lib/progress'
import Quiz from './Quiz'

const product = products[0]

function setup() {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[`/product/${product.id}/quiz`]}>
        <Routes><Route path="product/:id/quiz" element={<Quiz />} /></Routes>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

beforeEach(() => localStorage.clear())

describe('Quiz-pagina', () => {
  it('speelt een perfecte quiz en slaat de score op', async () => {
    const user = userEvent.setup()
    setup()
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Vraag ${i + 1} van 5`)).toBeInTheDocument()
      const q = product.quiz.find((x) => screen.queryByText(x.vraag))!
      await user.click(screen.getByRole('button', { name: new RegExp(q.opties[q.juisteAntwoord].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }))
      expect(screen.getByText('Goed!')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: i === 4 ? 'Bekijk resultaat' : 'Volgende vraag' }))
    }
    expect(screen.getByRole('heading', { name: 'Perfect!' })).toBeInTheDocument()
    expect(loadProgress()[product.id].score).toBe(5)
  })

  it('toont het juiste antwoord bij een fout', async () => {
    const user = userEvent.setup()
    setup()
    const q = product.quiz.find((x) => screen.queryByText(x.vraag))!
    const wrong = q.opties.find((_, i) => i !== q.juisteAntwoord)!
    await user.click(screen.getByRole('button', { name: new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }))
    expect(screen.getByText('Helaas, dat is niet juist.')).toBeInTheDocument()
    expect(screen.getByText(q.uitleg)).toBeInTheDocument()
  })
})
