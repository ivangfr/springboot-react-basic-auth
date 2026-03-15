import React from 'react'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import BookTable from './BookTable'

const defaultProps = {
  books: [],
  bookIsbn: '',
  bookTitle: '',
  bookTextSearch: '',
  handleInputChange: jest.fn(),
  handleAddBook: jest.fn(),
  handleDeleteBook: jest.fn(),
  handleSearchBook: jest.fn(),
}

describe('BookTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows "No book" row when books array is empty', () => {
    render(<BookTable {...defaultProps} />)
    expect(screen.getByText('No book')).toBeInTheDocument()
  })

  it('renders a row per book with isbn and title', () => {
    const books = [
      { isbn: '111', title: 'Book One' },
      { isbn: '222', title: 'Book Two' },
    ]
    render(<BookTable {...defaultProps} books={books} />)

    expect(screen.getByText('111')).toBeInTheDocument()
    expect(screen.getByText('Book One')).toBeInTheDocument()
    expect(screen.getByText('222')).toBeInTheDocument()
    expect(screen.getByText('Book Two')).toBeInTheDocument()
  })

  it('does not show "No book" when books are present', () => {
    const books = [{ isbn: '111', title: 'Book One' }]
    render(<BookTable {...defaultProps} books={books} />)
    expect(screen.queryByText('No book')).not.toBeInTheDocument()
  })

  it('calls handleDeleteBook with the correct isbn when delete button is clicked', async () => {
    const handleDeleteBook = jest.fn()
    const books = [{ isbn: '111', title: 'Book One' }]
    render(<BookTable {...defaultProps} books={books} handleDeleteBook={handleDeleteBook} />)

    // The delete ActionIcon is inside the table body row, not in the search/form area.
    const rows = screen.getAllByRole('row')
    // rows[0] is the header row; rows[1] is the first data row.
    const deleteButton = within(rows[1]).getByRole('button')
    await userEvent.click(deleteButton)

    expect(handleDeleteBook).toHaveBeenCalledWith('111')
  })

  it('calls handleSearchBook when the search form is submitted', async () => {
    const handleSearchBook = jest.fn()
    render(<BookTable {...defaultProps} handleSearchBook={handleSearchBook} />)

    // The search ActionIcon is of type='submit' and is in the search form.
    // Submit the form directly by clicking the search submit button.
    const searchButton = screen.getAllByRole('button').find(b => b.type === 'submit' && !b.closest('table'))
    await userEvent.click(searchButton)

    expect(handleSearchBook).toHaveBeenCalledTimes(1)
  })

  it('calls handleInputChange when search input changes', async () => {
    const handleInputChange = jest.fn()
    render(<BookTable {...defaultProps} handleInputChange={handleInputChange} />)

    await userEvent.type(screen.getByPlaceholderText('Search by ISBN or Title'), 'java')

    expect(handleInputChange).toHaveBeenCalled()
  })
})
