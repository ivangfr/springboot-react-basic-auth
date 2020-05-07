import React from 'react'
import { Button, Form, Icon } from 'semantic-ui-react'

function BookForm({ bookIsbn, bookTitle, handleInputChange, handleAddBook }) {
  const createBtnDisabled = bookIsbn.trim() === '' || bookTitle.trim() === ''
  return (
    <Form onSubmit={handleAddBook}>
      <Form.Group>
        <Form.Input
          id='bookIsbn'
          placeholder='ISBN *'
          value={bookIsbn}
          onChange={handleInputChange}
        />
        <Form.Input
          id='bookTitle'
          placeholder='Title *'
          value={bookTitle}
          onChange={handleInputChange}
        />
        <Button icon labelPosition='right' disabled={createBtnDisabled}>
          Create<Icon name='add' />
        </Button>
      </Form.Group>
    </Form>
  )
}

export default BookForm