import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeAdminUser, makeRegularUser, seedLocalStorage } from '../../test-utils'
import UserPage from './UserPage'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('UserPage', () => {
  it('redirects to / when user is not USER', async () => {
    seedLocalStorage(makeAdminUser())
    bookApi.getBooks.mockResolvedValue({ data: [] })

    render(<UserPage />, { initialRoute: '/userpage' })

    expect(screen.queryByText('Books')).not.toBeInTheDocument()
    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())
  })

  it('fetches and displays books on mount', async () => {
    const regularUser = makeRegularUser()
    seedLocalStorage(regularUser)
    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '111', title: 'Clean Code' }] })

    render(<UserPage />)

    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalledWith(regularUser)
      expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })
  })

  it('shows "No book" when API returns empty array', async () => {
    seedLocalStorage(makeRegularUser())
    bookApi.getBooks.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('No book')).toBeInTheDocument()
    })
  })

  it('calls bookApi.getBooks with search text when search is submitted', async () => {
    const regularUser = makeRegularUser()
    seedLocalStorage(regularUser)
    bookApi.getBooks.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalledTimes(1))

    await userEvent.type(screen.getByPlaceholderText('Search by ISBN or Title'), 'java')

    const searchButton = screen.getByRole('button')
    await userEvent.click(searchButton)

    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalledWith(regularUser, 'java')
    })
  })

  it('handles API error on mount silently', async () => {
    seedLocalStorage(makeRegularUser())
    bookApi.getBooks.mockRejectedValue({ message: 'Network Error' })

    render(<UserPage />)

    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalled()
      expect(screen.getByText('No book')).toBeInTheDocument()
    })
  })
})