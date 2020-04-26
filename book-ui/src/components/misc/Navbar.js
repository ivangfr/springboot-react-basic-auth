import React from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Menu } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth()

  const logout = () => {
    userLogout()
  }

  const enterMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "none" } : { "display": "block" }
  }

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "block" } : { "display": "none" }
  }

  const adminPageStyle = () => {
    const authUser = getUser()
    return authUser && JSON.parse(authUser).role === 'ADMIN' ? { "display": "block" } : { "display": "none" }
  }

  const userPageStyle = () => {
    const authUser = getUser()
    return authUser && JSON.parse(authUser).role === 'USER' ? { "display": "block" } : { "display": "none" }
  }

  const getUserName = () => {
    const authUser = getUser()
    return authUser ? JSON.parse(authUser).name : ''
  }

  return (
    <Menu inverted size='large' fixed='top' borderless>
      <Container>
        <Menu.Item header>Book-UI</Menu.Item>
        <Menu.Item as={NavLink} exact to="/">Home</Menu.Item>
        <Menu.Item as={NavLink} to="/adminpage" style={adminPageStyle()}>AdminPage</Menu.Item>
        <Menu.Item as={NavLink} to="/userpage" style={userPageStyle()}>UserPage</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item as={NavLink} to="/login" style={enterMenuStyle()}>Login</Menu.Item>
          <Menu.Item as={NavLink} to="/signup" style={enterMenuStyle()}>Sign Up</Menu.Item>
          <Menu.Item header style={logoutMenuStyle()}>{`Hi ${getUserName()}`}</Menu.Item>
          <Menu.Item as={NavLink} to="/logout" style={logoutMenuStyle()} onClick={logout}>Logout</Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Navbar
