import React from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'

/**
 * Wraps the given UI with MantineProvider, AuthProvider, and MemoryRouter.
 *
 * @param {React.ReactElement} ui - The component to render.
 * @param {object} options
 * @param {string[]} [options.initialEntries=['/'] ] - Initial router entries for MemoryRouter.
 * @param {object} [options.renderOptions={}] - Extra options forwarded to RTL render().
 */
function renderWithProviders(ui, { initialEntries = ['/'], ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <MantineProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from RTL so tests only need to import from test-utils.
export * from '@testing-library/react'
export { renderWithProviders as render }
