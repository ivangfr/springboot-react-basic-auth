import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppShell, MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { render as rtlRender } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import Navbar from './Navbar'

// Navbar renders AppShell.Header which requires AppShell as a parent context.
// Use a custom wrapper that provides AppShell alongside MantineProvider + AuthProvider + Router.
function renderNavbar(options = {}) {
  const { initialEntries = ['/'] } = options
  return rtlRender(
    <MantineProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <AppShell>
            <Navbar />
          </AppShell>
        </AuthProvider>
      </MemoryRouter>
    </MantineProvider>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('unauthenticated', () => {
    it('shows Home link and Book-UI brand', () => {
      renderNavbar()
      expect(screen.getAllByText('Book-UI').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    })

    it('shows Login and Sign Up links', () => {
      renderNavbar()
      expect(screen.getAllByText('Login').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Sign Up').length).toBeGreaterThan(0)
    })

    it('does not show AdminPage or UserPage links', () => {
      renderNavbar()
      expect(screen.queryByText('AdminPage')).not.toBeInTheDocument()
      expect(screen.queryByText('UserPage')).not.toBeInTheDocument()
    })
  })

  describe('authenticated as ADMIN', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'ADMIN', authdata: 'abc' }))
    })

    it('shows greeting with user name', () => {
      renderNavbar()
      expect(screen.getAllByText('Hi Alice').length).toBeGreaterThan(0)
    })

    it('shows AdminPage link', () => {
      renderNavbar()
      expect(screen.getAllByText('AdminPage').length).toBeGreaterThan(0)
    })

    it('does not show UserPage link', () => {
      renderNavbar()
      expect(screen.queryByText('UserPage')).not.toBeInTheDocument()
    })

    it('shows Logout button', () => {
      renderNavbar()
      expect(screen.getAllByText('Logout').length).toBeGreaterThan(0)
    })
  })

  describe('authenticated as USER', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify({ id: 2, name: 'Bob', role: 'USER', authdata: 'def' }))
    })

    it('shows UserPage link', () => {
      renderNavbar()
      expect(screen.getAllByText('UserPage').length).toBeGreaterThan(0)
    })

    it('does not show AdminPage link', () => {
      renderNavbar()
      expect(screen.queryByText('AdminPage')).not.toBeInTheDocument()
    })
  })

  describe('logout', () => {
    it('clears localStorage and removes the greeting after clicking Logout', async () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice', role: 'ADMIN', authdata: 'abc' }))
      renderNavbar()

      const logoutButtons = screen.getAllByText('Logout')
      await userEvent.click(logoutButtons[0])

      expect(localStorage.getItem('user')).toBeNull()
      expect(screen.queryByText('Hi Alice')).not.toBeInTheDocument()
    })
  })
})
