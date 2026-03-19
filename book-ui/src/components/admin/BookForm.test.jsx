import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import BookForm from './BookForm'

function makeProps(overrides = {}) {
  return {
    bookIsbn: '',
    bookTitle: '',
    handleInputChange: vi.fn(),
    handleAddBook: vi.fn(),
    ...overrides,
  }
}

describe('BookForm', () => {
  it('renders ISBN and Title inputs and Create button', () => {
    render(<BookForm {...makeProps()} />)

    expect(screen.getByPlaceholderText('ISBN *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('Create button is disabled when both fields are empty', () => {
    render(<BookForm {...makeProps()} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when only isbn is filled', () => {
    render(<BookForm {...makeProps({ bookIsbn: '978-3-16-148410-0' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when only title is filled', () => {
    render(<BookForm {...makeProps({ bookTitle: 'Clean Code' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is disabled when fields contain only whitespace', () => {
    render(<BookForm {...makeProps({ bookIsbn: '   ', bookTitle: '   ' })} />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })

  it('Create button is enabled when both isbn and title are filled', () => {
    render(<BookForm {...makeProps({ bookIsbn: '978-3-16-148410-0', bookTitle: 'Clean Code' })} />)
    expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled()
  })

  it('calls handleInputChange when isbn input changes', async () => {
    const handleInputChange = vi.fn()
    render(<BookForm {...makeProps({ handleInputChange })} />)

    await userEvent.type(screen.getByPlaceholderText('ISBN *'), '9')

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('calls handleInputChange when title input changes', async () => {
    const handleInputChange = vi.fn()
    render(<BookForm {...makeProps({ handleInputChange })} />)

    await userEvent.type(screen.getByPlaceholderText('Title *'), 'C')

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('calls handleAddBook when form is submitted', async () => {
    const handleAddBook = vi.fn()
    render(<BookForm {...makeProps({ bookIsbn: '978-3-16-148410-0', bookTitle: 'Clean Code', handleAddBook })} />)

    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(handleAddBook).toHaveBeenCalledTimes(1)
  })
})
