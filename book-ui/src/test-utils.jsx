import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'

export function makeAdminUser() {
  return { id: 1, name: 'Admin', role: 'ADMIN', authdata: 'YWRtaW46YWRtaW4=' }
}

export function makeRegularUser() {
  return { id: 2, name: 'Bob', role: 'USER', authdata: 'Ym9iOnBhc3M=' }
}

export function seedLocalStorage(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

function renderWithProviders(ui, { initialRoute = '/', ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <MantineProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { renderWithProviders as render }