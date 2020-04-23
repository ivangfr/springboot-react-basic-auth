import React, { Component, useContext } from 'react'

const AuthContext = React.createContext()

class AuthProvider extends Component {
  state = {
    user: null
  }

  componentDidMount() {
    const user = localStorage.getItem('user')
    user && this.setState({ user })
  }

  userIsAuthenticated = () => {
    return this.state.user !== null
  }

  userLogin = user => {
    localStorage.setItem('user', user)
    this.setState({ user })
  }

  userLogout = () => {
    localStorage.removeItem('user')
    this.setState({ user: null })
  }

  render() {
    const { children } = this.props
    const { user } = this.state
    const { userIsAuthenticated, userLogin, userLogout } = this

    return (
      <AuthContext.Provider value={{ user, userIsAuthenticated, userLogin, userLogout, }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

export default AuthContext

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider }