import { screen } from '@testing-library/react'
import { render, makeAdminUser, seedLocalStorage } from '../../test-utils'
import PrivateRoute from './PrivateRoute'

beforeEach(() => {
  localStorage.clear()
})

describe('PrivateRoute', () => {
  it('renders children when authenticated', () => {
    seedLocalStorage(makeAdminUser())
    render(
      <PrivateRoute>
        <div>Protected content</div>
      </PrivateRoute>
    )
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    render(
      <PrivateRoute>
        <div>Protected content</div>
      </PrivateRoute>,
      { initialRoute: '/adminpage' }
    )
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})