import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Signup from './Signup'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

async function fillForm({ username = 'alice', password = 'secret', name = 'Alice', email = 'alice@example.com' } = {}) {
  if (username) await userEvent.type(screen.getByLabelText('Username'), username)
  if (password) await userEvent.type(screen.getByLabelText('Password'), password)
  if (name)     await userEvent.type(screen.getByLabelText('Name'), name)
  if (email)    await userEvent.type(screen.getByLabelText('Email'), email)
}

describe('Signup', () => {
  it('redirects to / when already logged in', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'USER', authdata: 'abc' }))
    render(<Signup />, { initialEntries: ['/signup'] })
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })

  it('shows error alert when any required field is missing', async () => {
    render(<Signup />)
    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(bookApi.signup).not.toHaveBeenCalled()
  })

  it('shows a generic error message on network failure', async () => {
    bookApi.signup.mockRejectedValue({ message: 'Network Error' })
    render(<Signup />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument()
    })
  })

  it('shows conflict message on 409 response', async () => {
    bookApi.signup.mockRejectedValue({
      response: { data: { status: 409, message: 'Username already taken' } }
    })
    render(<Signup />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument()
    })
  })

  it('shows validation message on 400 response', async () => {
    bookApi.signup.mockRejectedValue({
      response: {
        data: {
          status: 400,
          errors: [{ defaultMessage: 'Email must be valid' }]
        }
      }
    })
    render(<Signup />)
    await fillForm({ email: 'not-an-email' })
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(screen.getByText('Email must be valid')).toBeInTheDocument()
    })
  })

  it('stores user in localStorage on successful signup', async () => {
    bookApi.signup.mockResolvedValue({
      data: { id: 10, name: 'Alice', role: 'USER' }
    })
    render(<Signup />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => {
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })
})