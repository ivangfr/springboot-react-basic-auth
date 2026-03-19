import { useEffect, useState } from 'react'
import { SimpleGrid, Paper, Text, Container, Box, LoadingOverlay } from '@mantine/core'
import { IconUsers, IconBook } from '@tabler/icons-react'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Home() {
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  const [numberOfBooks, setNumberOfBooks] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const responseUsers = await bookApi.numberOfUsers()
        const responseBooks = await bookApi.numberOfBooks()
        setNumberOfUsers(responseUsers.data)
        setNumberOfBooks(responseBooks.data)
      } catch (error) {
        handleLogError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container size='sm' mt='xl'>
      <Box pos='relative' mih={120}>
        <LoadingOverlay visible={isLoading} />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Paper withBorder p='xl' radius='md' ta='center'>
            <IconUsers size={32} color='gray' />
            <Text size='3rem' fw={700}>{numberOfUsers}</Text>
            <Text c='dimmed'>Users</Text>
          </Paper>
          <Paper withBorder p='xl' radius='md' ta='center'>
            <IconBook size={32} color='gray' />
            <Text size='3rem' fw={700}>{numberOfBooks}</Text>
            <Text c='dimmed'>Books</Text>
          </Paper>
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default Home
