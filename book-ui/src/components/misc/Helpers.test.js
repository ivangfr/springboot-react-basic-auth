import { handleLogError } from './Helpers'

describe('handleLogError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  it('logs error.response.data when response is present', () => {
    const error = { response: { data: { message: 'Not Found' } } }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith(error.response.data)
  })

  it('logs error.request when request is present but no response', () => {
    const error = { request: { url: '/api/books' } }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith(error.request)
  })

  it('logs error.message when neither response nor request is present', () => {
    const error = { message: 'Network Error' }
    handleLogError(error)
    expect(console.log).toHaveBeenCalledWith(error.message)
  })
})
