import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Paper, Title, Text, Center, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Login() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password)) {
      setIsError(true)
      return
    }

    try {
      const response = await bookApi.authenticate(username, password)
      const { id, name, role } = response.data
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { id, name, role, authdata }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setIsError(false)
    } catch (error) {
      handleLogError(error)
      setIsError(true)
    }
  }

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Center mt={60}>
      <Stack w={450} gap="md">
        <Title ta="center" order={2}>Welcome back</Title>

        <Paper withBorder shadow="sm" p="xl" radius="md">
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                autoFocus
                label="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth mt="sm">
                Login
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text ta="center" c="dimmed" fz="sm">
          {`Don't have an account? `}
          <NavLink to="/signup" style={{ color: 'var(--mantine-color-blue-6)' }}>Sign Up</NavLink>
        </Text>

        {isError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            The username or password provided are incorrect!
          </Alert>
        )}
      </Stack>
    </Center>
  )
}

export default Login
