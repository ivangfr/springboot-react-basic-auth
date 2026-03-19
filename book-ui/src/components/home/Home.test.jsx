import { screen, waitFor } from '@testing-library/react'
import { render } from '../../test-utils'
import Home from './Home'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

describe('Home', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders the Users and Books stat cards after data loads', async () => {
    bookApi.numberOfUsers.mockResolvedValue({ data: 42 })
    bookApi.numberOfBooks.mockResolvedValue({ data: 7 })

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
    })

    // CSS text-transform:uppercase is applied visually but DOM text is title-case.
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Books')).toBeInTheDocument()
  })

  it('displays 0 counts initially before API resolves', () => {
    // Never-resolving promises keep the component in its initial state.
    bookApi.numberOfUsers.mockReturnValue(new Promise(() => {}))
    bookApi.numberOfBooks.mockReturnValue(new Promise(() => {}))

    render(<Home />)

    // Both stat values should be 0 before data arrives.
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('handles API errors silently and keeps counts at 0', async () => {
    bookApi.numberOfUsers.mockRejectedValue({ message: 'Network Error' })
    bookApi.numberOfBooks.mockRejectedValue({ message: 'Network Error' })

    render(<Home />)

    // Wait for the async effect to finish.
    await waitFor(() => {
      expect(bookApi.numberOfUsers).toHaveBeenCalled()
    })

    // Counts remain at 0 and no error UI is shown.
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(1)
  })
})
