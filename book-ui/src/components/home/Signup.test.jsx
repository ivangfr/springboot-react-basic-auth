import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Signup from './Signup'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

describe('Signup', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('redirects to / when the user is already logged in', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'USER', authdata: 'abc' }))

    render(<Signup />, { initialEntries: ['/signup'] })

    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument()
  })

  it('renders the signup form when not authenticated', () => {
    render(<Signup />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation error when any field is missing', async () => {
    render(<Signup />)

    // Submit with only username filled.
    await userEvent.type(screen.getByLabelText(/username/i), 'alice')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/please, inform all fields/i)).toBeInTheDocument()
    })
    expect(bookApi.signup).not.toHaveBeenCalled()
  })

  it('calls bookApi.signup and logs user in on success', async () => {
    bookApi.signup.mockResolvedValue({
      data: { id: 10, name: 'Alice', role: 'USER' }
    })

    render(<Signup />)

    await userEvent.type(screen.getByLabelText(/username/i), 'alice')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(bookApi.signup).toHaveBeenCalledWith({
        username: 'alice',
        password: 'secret',
        name: 'Alice',
        email: 'alice@example.com',
      })
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })

  it('shows conflict message on 409 error', async () => {
    bookApi.signup.mockRejectedValue({
      response: { data: { status: 409, message: 'Username already taken' } }
    })

    render(<Signup />)

    await userEvent.type(screen.getByLabelText(/username/i), 'alice')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument()
    })
  })

  it('shows validation message on 400 error', async () => {
    bookApi.signup.mockRejectedValue({
      response: {
        data: {
          status: 400,
          errors: [{ defaultMessage: 'Email must be valid' }]
        }
      }
    })

    render(<Signup />)

    await userEvent.type(screen.getByLabelText(/username/i), 'alice')
    await userEvent.type(screen.getByLabelText(/password/i), 'secret')
    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText('Email must be valid')).toBeInTheDocument()
    })
  })
})
