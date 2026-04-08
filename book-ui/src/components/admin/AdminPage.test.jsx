import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, makeAdminUser, makeRegularUser, seedLocalStorage } from '../../test-utils'
import AdminPage from './AdminPage'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  bookApi.getUsers.mockResolvedValue({ data: [] })
  bookApi.getBooks.mockResolvedValue({ data: [] })
})

describe('AdminPage', () => {
  it('redirects to / when user is not ADMIN', async () => {
    seedLocalStorage(makeRegularUser())
    render(<AdminPage />, { initialRoute: '/adminpage' })
    expect(screen.queryByPlaceholderText('Search by Username')).not.toBeInTheDocument()
    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())
  })

  it('fetches users and books on mount', async () => {
    seedLocalStorage(makeAdminUser())
    bookApi.getUsers.mockResolvedValue({ data: [{ id: 1, username: 'admin', name: 'Admin', email: 'a@b.com', role: 'ADMIN' }] })
    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '123', title: 'Java' }] })
    const adminUser = makeAdminUser()

    render(<AdminPage />)

    await waitFor(() => {
      expect(bookApi.getUsers).toHaveBeenCalledWith(adminUser)
      expect(bookApi.getBooks).toHaveBeenCalledWith(adminUser)
    })
  })

  it('shows "No user" and "No book" when API returns empty arrays', async () => {
    seedLocalStorage(makeAdminUser())

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })

    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    expect(screen.getByText('No book')).toBeInTheDocument()
  })

  it('calls bookApi.deleteBook and refreshes books when delete is clicked', async () => {
    seedLocalStorage(makeAdminUser())
    const adminUser = makeAdminUser()

    bookApi.getBooks.mockResolvedValue({ data: [{ isbn: '999', title: 'Delete Me' }] })
    bookApi.deleteBook.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getUsers).toHaveBeenCalled())

    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument()
    })

    bookApi.getBooks.mockResolvedValue({ data: [] })

    const rows = screen.getAllByRole('row')
    const deleteButton = within(rows[1]).getByRole('button')
    await userEvent.click(deleteButton)

    await waitFor(() => {
      expect(bookApi.deleteBook).toHaveBeenCalledWith(adminUser, '999')
    })
  })

  it('calls bookApi.deleteUser and refreshes users when delete is clicked', async () => {
    seedLocalStorage(makeAdminUser())
    const adminUser = makeAdminUser()

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

    const rows = screen.getAllByRole('row')
    const aliceDeleteButton = within(rows[2]).getByRole('button')
    await userEvent.click(aliceDeleteButton)

    await waitFor(() => {
      expect(bookApi.deleteUser).toHaveBeenCalledWith(adminUser, 'alice')
    })
  })

  it('calls bookApi.addBook and refreshes books when BookForm is submitted', async () => {
    seedLocalStorage(makeAdminUser())
    const adminUser = makeAdminUser()
    bookApi.addBook.mockResolvedValue({})

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())

    const booksTab = screen.getByRole('tab', { name: /books/i })
    await userEvent.click(booksTab)

    await userEvent.type(screen.getByPlaceholderText('ISBN *'), '978-0-13-468599-1')
    await userEvent.type(screen.getByPlaceholderText('Title *'), 'Effective Java')

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
    seedLocalStorage(makeAdminUser())
    const adminUser = makeAdminUser()

    render(<AdminPage />)

    await waitFor(() => expect(bookApi.getBooks).toHaveBeenCalled())

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
    seedLocalStorage(makeAdminUser())
    const adminUser = makeAdminUser()

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
    seedLocalStorage(makeAdminUser())

    bookApi.getUsers.mockRejectedValue({ message: 'Network error' })

    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument()
    })
  })

  it('handles getBooks API error gracefully and shows no books', async () => {
    seedLocalStorage(makeAdminUser())

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