import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

// Helper component that exposes context values via data-testid attributes.
function AuthConsumer() {
  const { user, getUser, userIsAuthenticated, userLogin, userLogout } = useAuth()
  return (
    <div>
      <span data-testid='user'>{user ? JSON.stringify(user) : 'null'}</span>
      <span data-testid='getUser'>{getUser() ? JSON.stringify(getUser()) : 'null'}</span>
      <span data-testid='isAuthenticated'>{String(userIsAuthenticated())}</span>
      <button onClick={() => userLogin({ id: 1, name: 'Alice', role: 'USER', authdata: 'abc' })}>
        Login
      </button>
      <button onClick={userLogout}>Logout</button>
    </div>
  )
}

function renderConsumer() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with null user when localStorage is empty', () => {
    renderConsumer()
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
  })

  it('hydrates user state from localStorage on mount', () => {
    const storedUser = { id: 2, name: 'Bob', role: 'ADMIN', authdata: 'xyz' }
    localStorage.setItem('user', JSON.stringify(storedUser))

    renderConsumer()

    expect(screen.getByTestId('user')).toHaveTextContent(storedUser.name)
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
  })

  it('userLogin persists user to localStorage and updates state', () => {
    renderConsumer()

    act(() => {
      screen.getByText('Login').click()
    })

    expect(screen.getByTestId('user')).toHaveTextContent('Alice')
    expect(localStorage.getItem('user')).not.toBeNull()
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Alice')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
  })

  it('userLogout removes user from localStorage and clears state', () => {
    const storedUser = { id: 1, name: 'Alice', role: 'USER', authdata: 'abc' }
    localStorage.setItem('user', JSON.stringify(storedUser))

    renderConsumer()

    act(() => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(localStorage.getItem('user')).toBeNull()
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
  })

  it('getUser reads directly from localStorage', () => {
    const storedUser = { id: 3, name: 'Carol', role: 'USER', authdata: 'def' }
    localStorage.setItem('user', JSON.stringify(storedUser))

    renderConsumer()

    expect(screen.getByTestId('getUser')).toHaveTextContent('Carol')
  })
})
