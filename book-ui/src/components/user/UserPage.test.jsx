import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import UserPage from './UserPage'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

const regularUser = { id: 2, name: 'Alice', role: 'USER', authdata: 'YWxpY2U6cGFzcw==' }
const adminUser = { id: 1, name: 'Admin', role: 'ADMIN', authdata: 'YWRtaW46YWRtaW4=' }

describe('UserPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('redirects to / when the logged-in user is not USER role', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))
    bookApi.getBooks.mockResolvedValue({ data: [] })

    render(<UserPage />, { initialEntries: ['/userpage'] })

    // BookList should not be rendered.
    expect(screen.queryByText('Books')).not.toBeInTheDocument()

    // Wait for the useEffect async calls to fully settle so no act() warnings are emitted.
    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())
  })

  it('fetches and displays books on mount', async () => {
    localStorage.setItem('user', JSON.stringify(regularUser))
    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '111', title: 'Clean Code' }] })

    render(<UserPage />)

    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalledWith(regularUser)
      expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })
  })

  it('shows "No book" when API returns empty array', async () => {
    localStorage.setItem('user', JSON.stringify(regularUser))
    bookApi.getBooks.mockResolvedValue({ data: [] })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('No book')).toBeInTheDocument()
    })
  })

  it('calls bookApi.getBooks with search text when search is submitted', async () => {
    localStorage.setItem('user', JSON.stringify(regularUser))
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
    localStorage.setItem('user', JSON.stringify(regularUser))
    bookApi.getBooks.mockRejectedValue({ message: 'Network Error' })

    render(<UserPage />)

    // Wait for the async effect (including the finally block) to fully settle.
    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalled()
      expect(screen.getByText('No book')).toBeInTheDocument()
    })
  })
})
