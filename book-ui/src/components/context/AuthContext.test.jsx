import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { makeAdminUser, makeRegularUser, seedLocalStorage } from '../../test-utils'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'

function AuthProbe() {
  const { user, getUser, userIsAuthenticated, userLogin, userLogout } = useAuth()
  return (
    <div>
      <span data-testid='user'>{user ? user.name : 'null'}</span>
      <span data-testid='getUser'>{getUser() ? getUser().name : 'null'}</span>
      <span data-testid='isAuthenticated'>{String(userIsAuthenticated())}</span>
      <button onClick={() => userLogin(makeRegularUser())}>Login</button>
      <button onClick={userLogout}>Logout</button>
    </div>
  )
}

function renderProbe() {
  return render(
    <MantineProvider>
      <MemoryRouter>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </MemoryRouter>
    </MantineProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('AuthContext', () => {
  it('starts with null user when localStorage is empty', async () => {
    renderProbe()
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
    })
  })

  it('hydrates user state from localStorage on mount', async () => {
    seedLocalStorage(makeAdminUser())
    renderProbe()
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
    })
  })

  it('userLogin persists user to localStorage and updates state', async () => {
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Bob')
      expect(localStorage.getItem('user')).not.toBeNull()
    })
  })

  it('userLogout removes user from localStorage and clears state', async () => {
    seedLocalStorage(makeRegularUser())
    renderProbe()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Bob'))

    await act(async () => {
      screen.getByText('Logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  it('getUser reads directly from localStorage', async () => {
    seedLocalStorage(makeRegularUser())
    renderProbe()
    await waitFor(() => {
      expect(screen.getByTestId('getUser')).toHaveTextContent('Bob')
    })
  })
})