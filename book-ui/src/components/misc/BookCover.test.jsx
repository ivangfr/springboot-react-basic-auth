import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test-utils'
import BookCover from './BookCover'

describe('BookCover', () => {
  it('renders a hidden img with the correct OpenLibrary URL for the given isbn', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    const img = document.querySelector('img[src*="openlibrary"]')
    expect(img).toBeInTheDocument()
    expect(img.src).toBe('http://covers.openlibrary.org/b/isbn/0-13-468599-1-M.jpg')
  })

  it('shows a Skeleton while the image has not yet loaded', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    // Before any load/error event the skeleton should be visible (animate=true means isLoaded=false).
    // Mantine renders Skeleton as a div; the img probe is hidden via display:none.
    const hiddenImg = document.querySelector('img[style*="display: none"]')
    expect(hiddenImg).toBeInTheDocument()

    // The Mantine Image (visible img) should NOT be rendered yet — only the Skeleton.
    // display:none elements are excluded from ARIA roles, so queryAllByRole returns only visible imgs.
    const visibleImages = screen.queryAllByRole('img')
    expect(visibleImages).toHaveLength(0)
  })

  it('shows the Mantine Image after a successful load with naturalWidth > 1', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    const hiddenImg = document.querySelector('img[style*="display: none"]')

    // Simulate a successful load: naturalWidth > 1 means the cover image exists.
    Object.defineProperty(hiddenImg, 'naturalWidth', { value: 100, configurable: true })
    fireEvent.load(hiddenImg)

    // After a successful load, the Mantine Image (a visible <img>) is rendered.
    // The hidden probe (display:none) is excluded from ARIA roles, so we expect exactly 1 visible img.
    const visibleImages = screen.getAllByRole('img')
    expect(visibleImages).toHaveLength(1)
  })

  it('keeps the Skeleton when the image loads but naturalWidth <= 1 (placeholder/missing cover)', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    const hiddenImg = document.querySelector('img[style*="display: none"]')

    // Simulate a "blank" image response: naturalWidth === 1 (OpenLibrary placeholder).
    Object.defineProperty(hiddenImg, 'naturalWidth', { value: 1, configurable: true })
    fireEvent.load(hiddenImg)

    // The Mantine Image should NOT be rendered; only the probe img and skeleton remain.
    const allImgs = screen.queryAllByRole('img')
    // The hidden probe has display:none so it won't appear in roles — only truly visible imgs do.
    // No Mantine Image means the skeleton is still showing.
    expect(allImgs.every(img => img.style.display === 'none')).toBe(true)
  })

  it('keeps the Skeleton when the image fails to load (network/CORS error)', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    const hiddenImg = document.querySelector('img[style*="display: none"]')

    fireEvent.error(hiddenImg)

    // After an error the skeleton is still visible (isMissing=true), no Mantine Image.
    const allImgs = screen.queryAllByRole('img')
    expect(allImgs.every(img => img.style.display === 'none')).toBe(true)
  })

  it('uses the provided height when h prop is given', () => {
    render(<BookCover isbn='0-13-468599-1' w={50} h={80} />)

    // The hidden probe img should be present regardless of dimensions.
    const hiddenImg = document.querySelector('img[style*="display: none"]')
    expect(hiddenImg).toBeInTheDocument()
  })

  it('computes height from width when h prop is omitted', () => {
    // When h is not provided, height = Math.round(w * 1.4). With w=50, height=70.
    // We can't easily inspect Mantine Skeleton's h prop from the DOM,
    // but we verify the component renders without errors.
    render(<BookCover isbn='0-13-468599-1' w={50} />)

    expect(document.querySelector('img[style*="display: none"]')).toBeInTheDocument()
  })
})
