import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell, Burger, Container, Group, Text, Button, Anchor } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth()
  const navigate = useNavigate()
  const [opened, { toggle, close }] = useDisclosure(false)

  const isAuthenticated = userIsAuthenticated()
  const user = getUser()
  const isAdmin = user && user.role === 'ADMIN'
  const isUser = user && user.role === 'USER'

  const handleLogout = () => {
    userLogout()
    close()
    navigate('/')
  }

  const navLinks = (
    <>
      <Anchor component={Link} to="/" onClick={close} c="white" fw={500}>
        Home
      </Anchor>
      {isAdmin && (
        <Anchor component={Link} to="/adminpage" onClick={close} c="white" fw={500}>
          AdminPage
        </Anchor>
      )}
      {isUser && (
        <Anchor component={Link} to="/userpage" onClick={close} c="white" fw={500}>
          UserPage
        </Anchor>
      )}
    </>
  )

  const authLinks = isAuthenticated ? (
    <>
      <Text c="white" fw={500}>{`Hi ${user.name}`}</Text>
      <Button variant="white" color="blue" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <Anchor component={Link} to="/login" onClick={close} c="white" fw={500}>
        Login
      </Anchor>
      <Button component={Link} to="/signup" variant="white" color="blue" size="sm" onClick={close}>
        Sign Up
      </Button>
    </>
  )

  return (
    <AppShell.Header bg="blue" style={{ borderBottom: 'none' }}>
      <Container h="100%">
        <Group h="100%" justify="space-between" wrap="nowrap">
          <Group gap="xl" wrap="nowrap">
            <Text c="white" fw={700} fz="lg" style={{ whiteSpace: 'nowrap' }}>
              Book-UI
            </Text>
            <Group gap="lg" visibleFrom="sm">
              {navLinks}
            </Group>
          </Group>
          <Group gap="md" visibleFrom="sm">
            {authLinks}
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" color="white" />
        </Group>
      </Container>
    </AppShell.Header>
  )
}

export default Navbar
