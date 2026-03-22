import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Paper, Stack, Alert, Anchor, Center, Box } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
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
    return <Navigate to='/' />
  }

  return (
    <Center mt='xl'>
      <Box w={450}>
        <form onSubmit={handleSubmit}>
          <Paper withBorder p='xl' shadow='sm' radius='md'>
            <Stack gap='sm'>
              <TextInput
                autoFocus
                name='username'
                label='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordInput
                name='password'
                label='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type='submit' fullWidth>Login</Button>
            </Stack>
          </Paper>
        </form>
        <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
          Don't have an account?{' '}
          <Anchor component={NavLink} to='/signup'>Sign Up</Anchor>
        </Paper>
        {isError && (
          <Alert color='red' variant='light' mt='sm' icon={<IconInfoCircle />}>
            The username or password provided are incorrect!
          </Alert>
        )}
      </Box>
    </Center>
  )
}

export default Login
