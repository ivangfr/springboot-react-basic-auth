import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Paper, Title, Text, Center, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password && name && email)) {
      setIsError(true)
      setErrorMessage('Please, inform all fields!')
      return
    }

    const user = { username, password, name, email }

    try {
      const response = await bookApi.signup(user)
      const { id, name: userName, role } = response.data
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { id, name: userName, role, authdata }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setName('')
      setEmail('')
      setIsError(false)
      setErrorMessage('')
    } catch (error) {
      handleLogError(error)
      if (error.response && error.response.data) {
        const errorData = error.response.data
        let errMsg = 'Invalid fields'
        if (errorData.status === 409) {
          errMsg = errorData.message
        } else if (errorData.status === 400) {
          errMsg = errorData.errors[0].defaultMessage
        }
        setIsError(true)
        setErrorMessage(errMsg)
      }
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Center mt={60}>
      <Stack w={450} gap="md">
        <Title ta="center" order={2}>Create an account</Title>

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
              <TextInput
                label="Name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                label="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" fullWidth mt="sm">
                Sign Up
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text ta="center" c="dimmed" fz="sm">
          {`Already have an account? `}
          <NavLink to="/login" style={{ color: 'var(--mantine-color-blue-6)' }}>Login</NavLink>
        </Text>

        {isError && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {errorMessage}
          </Alert>
        )}
      </Stack>
    </Center>
  )
}

export default Signup
