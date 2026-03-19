import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Login from './Login'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('redirects to / when the user is already logged in', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'USER', authdata: 'abc' }))

    render(<Login />, { initialEntries: ['/login'] })

    // The form should not be present — the component navigated away.
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument()
  })

  it('renders the login form when not authenticated', () => {
    render(<Login />)

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows an error alert when submitting with empty fields', async () => {
    render(<Login />)

    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/username or password provided are incorrect/i)).toBeInTheDocument()
    expect(bookApi.authenticate).not.toHaveBeenCalled()
  })

  it('calls bookApi.authenticate and logs user in on success', async () => {
    bookApi.authenticate.mockResolvedValue({
      data: { id: 1, name: 'Alice', role: 'USER' }
    })

    render(<Login />)

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'alice')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(bookApi.authenticate).toHaveBeenCalledWith('alice', 'secret')
      expect(localStorage.getItem('user')).not.toBeNull()
      const stored = JSON.parse(localStorage.getItem('user'))
      expect(stored.name).toBe('Alice')
    })
  })

  it('shows error alert when the API call fails', async () => {
    bookApi.authenticate.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } })

    render(<Login />)

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'alice')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/username or password provided are incorrect/i)).toBeInTheDocument()
    })
  })
})
