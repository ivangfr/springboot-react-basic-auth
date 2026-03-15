import React from 'react'
import { screen } from '@testing-library/react'
import { render } from '../../test-utils'
import PrivateRoute from './PrivateRoute'

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders children when the user is authenticated', () => {
    const user = { id: 1, name: 'Alice', role: 'ADMIN', authdata: 'abc' }
    localStorage.setItem('user', JSON.stringify(user))

    render(
      <PrivateRoute>
        <div>Protected content</div>
      </PrivateRoute>
    )

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /login when the user is not authenticated', () => {
    // No user in localStorage — unauthenticated.
    render(
      <PrivateRoute>
        <div>Protected content</div>
      </PrivateRoute>,
      { initialEntries: ['/adminpage'] }
    )

    // The protected content should not be rendered.
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
