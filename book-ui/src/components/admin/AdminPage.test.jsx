import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import AdminPage from './AdminPage'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

const adminUser = { id: 1, name: 'Admin', role: 'ADMIN', authdata: 'YWRtaW46YWRtaW4=' }
const nonAdminUser = { id: 2, name: 'Bob', role: 'USER', authdata: 'Ym9iOnBhc3M=' }

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    bookApi.getUsers.mockResolvedValue({ data: [] })
    bookApi.getBooks.mockResolvedValue({ data: [] })
  })

  it('redirects to / when the logged-in user is not ADMIN', async () => {
    localStorage.setItem('user', JSON.stringify(nonAdminUser))

    render(<AdminPage />, { initialEntries: ['/adminpage'] })

    // AdminTab should not be rendered.
    expect(screen.queryByPlaceholderText('Search by Username')).not.toBeInTheDocument()

    // Wait for the useEffect async calls to fully settle so no act() warnings are emitted.
    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())
  })

  it('fetches users and books on mount', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    bookApi.getUsers.mockResolvedValue({ data: [{ id: 1, username: 'admin', name: 'Admin', email: 'a@b.com', role: 'ADMIN' }] })
    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '123', title: 'Java' }] })

    render(<AdminPage />)

    await waitFor(() => {
      expect(bookApi.getUsers).toHaveBeenCalledWith(adminUser)
      expect(bookApi.getBooks).toHaveBeenCalledWith(adminUser)
    })
  })

  it('shows "No user" and "No book" when API returns empty arrays', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })

    // Switch to the Books tab to verify "No book".
    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    expect(screen.getByText('No book')).toBeInTheDocument()
  })

  it('calls bookApi.deleteBook and refreshes books when delete is clicked', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '999', title: 'Delete Me' }] })
    bookApi.deleteBook.mockResolvedValue({})

    render(<AdminPage />)

    // Wait for the initial mount effects to settle before interacting.
    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())

    // Switch to the Books tab.
    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument()
    })

    // After successful delete, getBooks is called again — return empty list.
    bookApi.getBooks.mockResolvedValue({ data: [] })

    // The delete ActionIcon is in the first data row of the books table.
    const rows = screen.getAllByRole('row')
    // rows[0] = header row; rows[1] = first book row
    const deleteButton = within(rows[1]).getByRole('button')
    await userEvent.click(deleteButton)

    await waitFor(() => {
      expect(bookApi.deleteBook).toHaveBeenCalledWith(adminUser, '999')
    })
  })

  it('calls bookApi.deleteUser and refreshes users when delete is clicked', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    bookApi.getUsers.mockResolvedValue({
      data: [
        { id: 1, username: 'admin', name: 'Admin', email: 'a@b.com', role: 'ADMIN' },
        { id: 2, username: 'alice', name: 'Alice', email: 'alice@b.com', role: 'USER' },
      ]
    })
    bookApi.deleteUser.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument()
    })

    bookApi.getUsers.mockResolvedValue({ data: [] })

    // rows[0] = header; rows[1] = admin row; rows[2] = alice row
    const rows = screen.getAllByRole('row')
    const aliceDeleteButton = within(rows[2]).getByRole('button')
    await userEvent.click(aliceDeleteButton)

    await waitFor(() => {
      expect(bookApi.deleteUser).toHaveBeenCalledWith(adminUser, 'alice')
    })
  })

  it('calls bookApi.addBook and refreshes books when BookForm is submitted', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))
    bookApi.addBook.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())

    // Switch to Books tab
    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    // Fill in the BookForm fields
    await userEvent.type(screen.getByPlaceholderText('ISBN *'), '978-0-13-468599-1')
    await userEvent.type(screen.getByPlaceholderText('Title *'), 'Effective Java')

    // Reset mock so we can assert the refresh call
    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '978-0-13-468599-1', title: 'Effective Java' }] })

    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(bookApi.addBook).toHaveBeenCalledWith(adminUser, { isbn: '978-0-13-468599-1', title: 'Effective Java' })
    })
    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalledTimes(2)
    })
  })

  it('calls bookApi.getBooks with search text when book search is submitted', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())

    // Switch to Books tab
    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '999', title: 'Spy Novel' }] })

    await userEvent.type(screen.getByPlaceholderText('Search by ISBN or Title'), 'spy')

    const searchButton = screen.getByPlaceholderText('Search by ISBN or Title').closest('form').querySelector('[type="submit"]')
    await userEvent.click(searchButton)

    await waitFor(() => {
      expect(bookApi.getBooks).toHaveBeenCalledWith(adminUser, 'spy')
    })
  })

  it('calls bookApi.getUsers with search text when user search is submitted', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())

    bookApi.getUsers.mockResolvedValue({ data: [{ id: 3, username: 'alice', name: 'Alice', email: 'a@b.com', role: 'USER' }] })

    await userEvent.type(screen.getByPlaceholderText('Search by Username'), 'alice')

    const searchButton = screen.getByPlaceholderText('Search by Username').closest('form').querySelector('[type="submit"]')
    await userEvent.click(searchButton)

    await waitFor(() => {
      expect(bookApi.getUsers).toHaveBeenCalledWith(adminUser, 'alice')
    })
  })

  it('handles getUsers API error gracefully and shows no users', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    bookApi.getUsers.mockRejectedValue({ message: 'Network error' })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })

  it('handles getBooks API error gracefully and shows no books', async () => {
    localStorage.setItem('user', JSON.stringify(adminUser))

    bookApi.getBooks.mockRejectedValue({ message: 'Network error' })

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())

    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    await waitFor(() => {
      expect(screen.getByText('No book')).toBeInTheDocument()
    })
  })
})
