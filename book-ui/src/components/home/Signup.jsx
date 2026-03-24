import { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Paper, Stack, Alert, Anchor, Center, Box } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
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
      let errMsg = 'An unexpected error occurred. Please try again.'
      if (error.response && error.response.data) {
        const errorData = error.response.data
        errMsg = 'Invalid fields'
        if (errorData.status === 409) {
          errMsg = errorData.message
        } else if (errorData.status === 400) {
          errMsg = errorData.errors[0].defaultMessage
        }
      }
      setIsError(true)
      setErrorMessage(errMsg)
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <Center mt='xl'>
      <Box w={450}>
        <form onSubmit={handleSubmit}>
          <Paper withBorder p='xl' radius='md' shadow='sm'>
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
              <TextInput
                name='name'
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                name='email'
                label='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type='submit' fullWidth>Sign Up</Button>
            </Stack>
          </Paper>
        </form>
        <Paper withBorder p='sm' radius='md' mt='sm' ta='center' shadow='sm'>
          Already have an account?{' '}
          <Anchor component={NavLink} to='/login'>Login</Anchor>
        </Paper>
        {isError && (
          <Alert color='red' variant='light' mt='sm' icon={<IconInfoCircle />}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Center>
  )
}

export default Signup
