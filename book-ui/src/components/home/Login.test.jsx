import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import Login from './Login'
import { bookApi } from '../misc/BookApi'

vi.mock('../misc/BookApi')

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('Login', () => {
  it('redirects to / when already logged in', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'USER', authdata: 'abc' }))
    render(<Login />, { initialEntries: ['/login'] })
    expect(screen.queryByLabelText('Username')).not.toBeInTheDocument()
  })

  it('shows error alert when submitting with empty fields', async () => {
    render(<Login />)
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(bookApi.authenticate).not.toHaveBeenCalled()
  })

  it('shows error alert when API returns an error', async () => {
    bookApi.authenticate.mockRejectedValue({ message: 'Unauthorized' })
    render(<Login />)

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calls bookApi.authenticate and logs user in on success', async () => {
    bookApi.authenticate.mockResolvedValue({
      data: { id: 1, name: 'Alice', role: 'USER' }
    })

    render(<Login />)

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })
})