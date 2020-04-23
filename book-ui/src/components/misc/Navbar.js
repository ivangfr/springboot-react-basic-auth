import React from 'react'
import { NavLink } from 'react-router-dom'
import { Container, Menu, Dropdown } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, userIsAuthenticated, userLogout } = useAuth()

  const logout = () => {
    userLogout()
  }

  const enterMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "none" } : { "display": "block" }
  }

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { "display": "block" } : { "display": "none" }
  }

  const getUserName = () => {
    return userIsAuthenticated() ? JSON.parse(user).name : ''
  }

  return (
    <Menu>
      <Container>
        <Menu.Item header>book-ui</Menu.Item>
        <Menu.Item as={NavLink} exact to="/">Home</Menu.Item>
        <Menu.Item as={NavLink} to="/adminpage" style={logoutMenuStyle()}>AdminPage</Menu.Item>
        <Menu.Item as={NavLink} to="/userpage" style={logoutMenuStyle()}>UserPage</Menu.Item>
        <Dropdown item text='Enter' style={enterMenuStyle()}>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/login">Login</Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/signup">Sign Up</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text={`Hi ${getUserName()}`} style={logoutMenuStyle()}>
          <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/logout" onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Menu>
  )
}

export default Navbar
