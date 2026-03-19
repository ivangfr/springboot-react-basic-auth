import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../test-utils'
import BookList from './BookList'

const defaultProps = {
  isBooksLoading: false,
  bookTextSearch: '',
  books: [],
  handleInputChange: vi.fn(),
  handleSearchBook: vi.fn(),
}

const sampleBooks = [
  { isbn: '111', title: 'Clean Code' },
  { isbn: '222', title: 'The Pragmatic Programmer' },
]

describe('BookList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "No book" when books array is empty', () => {
    render(<BookList {...defaultProps} />)
    expect(screen.getByText('No book')).toBeInTheDocument()
  })

  it('renders a card per book with title and isbn', () => {
    render(<BookList {...defaultProps} books={sampleBooks} />)

    expect(screen.getByText('Clean Code')).toBeInTheDocument()
    expect(screen.getByText('111')).toBeInTheDocument()
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument()
    expect(screen.getByText('222')).toBeInTheDocument()
  })

  it('does not show "No book" when books are present', () => {
    render(<BookList {...defaultProps} books={sampleBooks} />)
    expect(screen.queryByText('No book')).not.toBeInTheDocument()
  })

  it('calls handleSearchBook when the search form is submitted', async () => {
    const handleSearchBook = vi.fn()
    render(<BookList {...defaultProps} handleSearchBook={handleSearchBook} />)

    const searchButton = screen.getByRole('button')
    await userEvent.click(searchButton)

    expect(handleSearchBook).toHaveBeenCalledTimes(1)
  })

  it('calls handleInputChange when the search input changes', async () => {
    const handleInputChange = vi.fn()
    render(<BookList {...defaultProps} handleInputChange={handleInputChange} />)

    await userEvent.type(screen.getByPlaceholderText('Search by ISBN or Title'), 'java')

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('renders the Books section title', () => {
    render(<BookList {...defaultProps} />)
    expect(screen.getByText('Books')).toBeInTheDocument()
  })
})
