import { Group, TextInput, Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

function BookForm({ bookIsbn, bookTitle, handleInputChange, handleAddBook }) {
  const createBtnDisabled = bookIsbn.trim() === '' || bookTitle.trim() === ''

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleAddBook() }}>
      <Group>
        <TextInput
          name='bookIsbn'
          placeholder='ISBN *'
          value={bookIsbn}
          onChange={handleInputChange}
        />
        <TextInput
          name='bookTitle'
          placeholder='Title *'
          value={bookTitle}
          onChange={handleInputChange}
        />
        <Button
          type='submit'
          leftSection={<IconPlus size={16} />}
          disabled={createBtnDisabled}
        >
          Create
        </Button>
      </Group>
    </form>
  )
}

export default BookForm
