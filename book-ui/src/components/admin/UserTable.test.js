import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import UserTable from './UserTable'

const defaultProps = {
  users: [],
  userUsernameSearch: '',
  handleInputChange: jest.fn(),
  handleDeleteUser: jest.fn(),
  handleSearchUser: jest.fn(),
}

const sampleUsers = [
  { id: 1, username: 'admin', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
  { id: 2, username: 'alice', name: 'Alice', email: 'alice@example.com', role: 'USER' },
]

describe('UserTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows "No user" row when users array is empty', () => {
    render(<UserTable {...defaultProps} />)
    expect(screen.getByText('No user')).toBeInTheDocument()
  })

  it('renders a row per user with all fields', () => {
    render(<UserTable {...defaultProps} users={sampleUsers} />)

    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()

    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })

  it('delete button is disabled for the admin user', () => {
    render(<UserTable {...defaultProps} users={sampleUsers} />)

    // Get delete buttons from table rows (not the search submit button).
    const rows = screen.getAllByRole('row')
    // rows[0] is the header; rows[1] = admin row; rows[2] = alice row.
    const adminDeleteBtn = within(rows[1]).getByRole('button')
    const aliceDeleteBtn = within(rows[2]).getByRole('button')

    // Mantine ActionIcon with disabled renders with data-disabled attribute.
    expect(adminDeleteBtn).toHaveAttribute('data-disabled')
    expect(aliceDeleteBtn).not.toHaveAttribute('data-disabled')
  })

  it('calls handleDeleteUser with the correct username', async () => {
    const handleDeleteUser = jest.fn()
    render(<UserTable {...defaultProps} users={sampleUsers} handleDeleteUser={handleDeleteUser} />)

    const rows = screen.getAllByRole('row')
    const aliceDeleteBtn = within(rows[2]).getByRole('button')
    await userEvent.click(aliceDeleteBtn)

    expect(handleDeleteUser).toHaveBeenCalledWith('alice')
  })

  it('does not call handleDeleteUser when admin delete is clicked (disabled)', async () => {
    const handleDeleteUser = jest.fn()
    render(<UserTable {...defaultProps} users={sampleUsers} handleDeleteUser={handleDeleteUser} />)

    const rows = screen.getAllByRole('row')
    const adminDeleteBtn = within(rows[1]).getByRole('button')
    await userEvent.click(adminDeleteBtn)

    expect(handleDeleteUser).not.toHaveBeenCalled()
  })

  it('calls handleSearchUser when search form is submitted', async () => {
    const handleSearchUser = jest.fn()
    render(<UserTable {...defaultProps} handleSearchUser={handleSearchUser} />)

    // Submit by clicking the search icon button (the only button when users is empty).
    const searchButton = screen.getByRole('button')
    await userEvent.click(searchButton)

    expect(handleSearchUser).toHaveBeenCalledTimes(1)
  })

  it('calls handleInputChange when the search input changes', async () => {
    const handleInputChange = jest.fn()
    render(<UserTable {...defaultProps} handleInputChange={handleInputChange} />)

    await userEvent.type(screen.getByPlaceholderText('Search by Username'), 'al')

    expect(handleInputChange).toHaveBeenCalled()
  })
})
