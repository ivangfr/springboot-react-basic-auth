import React, { useState, useEffect } from 'react'
import { Container, SimpleGrid, Paper, Text, Title, Center, LoadingOverlay, Skeleton, Stack, ThemeIcon, Group } from '@mantine/core'
import { IconUser, IconBook } from '@tabler/icons-react'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Home() {
  const [numberOfUsers, setNumberOfUsers] = useState(0)
  const [numberOfBooks, setNumberOfBooks] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const responseUsers = await bookApi.numberOfUsers()
        setNumberOfUsers(responseUsers.data)

        const responseBooks = await bookApi.numberOfBooks()
        setNumberOfBooks(responseBooks.data)
      } catch (error) {
        handleLogError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Container size="sm" mt="xl">
      <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

      <SimpleGrid cols={2} spacing="lg">
        <Paper withBorder p="xl" radius="md" style={{ borderColor: 'var(--mantine-color-blue-6)', borderTopWidth: 4 }}>
          <Center>
            <Stack align="center" gap="xs">
              <Group gap="xs">
                <ThemeIcon color="gray" variant="light" size="lg">
                  <IconUser size={20} />
                </ThemeIcon>
                <Title order={2}>{numberOfUsers}</Title>
              </Group>
              <Text c="dimmed" tt="uppercase" fw={700} fz="sm">Users</Text>
            </Stack>
          </Center>
        </Paper>

        <Paper withBorder p="xl" radius="md" style={{ borderColor: 'var(--mantine-color-blue-6)', borderTopWidth: 4 }}>
          <Center>
            <Stack align="center" gap="xs">
              <Group gap="xs">
                <ThemeIcon color="gray" variant="light" size="lg">
                  <IconBook size={20} />
                </ThemeIcon>
                <Title order={2}>{numberOfBooks}</Title>
              </Group>
              <Text c="dimmed" tt="uppercase" fw={700} fz="sm">Books</Text>
            </Stack>
          </Center>
        </Paper>
      </SimpleGrid>

      <Stack mt="xl" gap="md">
        <Skeleton height={12} radius="xl" animate={false} />
        <Skeleton height={12} radius="xl" animate={false} />
        <Skeleton height={12} radius="xl" width="70%" animate={false} />
        <Skeleton height={12} mt="md" radius="xl" animate={false} />
        <Skeleton height={12} radius="xl" animate={false} />
        <Skeleton height={12} radius="xl" width="80%" animate={false} />
      </Stack>
    </Container>
  )
}

export default Home
