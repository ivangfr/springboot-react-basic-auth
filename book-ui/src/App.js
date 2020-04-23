import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import { AuthProvider } from './components/context/AuthContext'
import PrivateRoute from './components/misc/PrivateRoute'
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Login from './components/home/Login'
import Signup from './components/home/Signup'
import AdminPage from './components/admin/AdminPage'
import UserPage from './components/user/UserPage'

function App() {
  const authTokens = JSON.parse(localStorage.getItem("tokens"))
  
  return (
    <AuthProvider value={{ authTokens }}>
      <Router>
        <Navbar />
        <Divider hidden />
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/logout' component={Home} />
        <PrivateRoute path='/adminpage' component={AdminPage} />
        <PrivateRoute path='/userpage' component={UserPage} />
      </Router>
    </AuthProvider>
  );
}

export default App
