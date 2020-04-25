import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'
import BookApi from '../misc/BookApi';

class Signup extends Component {
  static contextType = AuthContext

  state = {
    username: '',
    password: '',
    name: '',
    email: '',
    isLoggedIn: false,
    isError: false
  }

  componentDidMount() {
    const { userIsAuthenticated } = this.context
    const isLoggedIn = userIsAuthenticated()
    this.setState({ isLoggedIn })
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { username, password, name, email } = this.state
    if (!(username && password && name && email)) {
      this.setState({ isError: true })
      return
    }

    const userInfo = { username, password, name, email }
    BookApi.post('/auth/signup', userInfo, {
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 201) {
          const { id, name } = response.data
          const authdata = window.btoa(username + ':' + password)
          const user = { id, name, authdata }

          const { userLogin } = this.context
          userLogin(JSON.stringify(user))

          this.setState({
            username: '',
            password: '',
            isLoggedIn: true,
            isError: false
          })
        } else {
          this.setState({ isError: true })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ isError: true })
      })
  }

  render() {
    const { isLoggedIn, isError } = this.state
    if (isLoggedIn) {
      return <Redirect to='/' />
    } else {
      return (
        <div>
          <Grid textAlign='center'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Form size='large' onSubmit={this.handleSubmit}>
                <Segment>
                  <Form.Input
                    fluid
                    autoFocus
                    id='username'
                    icon='user'
                    iconPosition='left'
                    placeholder='Username'
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    id='password'
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    id='name'
                    icon='address card'
                    iconPosition='left'
                    placeholder='Name'
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    id='email'
                    icon='mail'
                    iconPosition='left'
                    placeholder='Email'
                    onChange={this.handleChange}
                  />
                  <Button color='blue' fluid size='large'>Signup</Button>
                </Segment>
              </Form>
              <Message>Already have an account?
              <a href='/login' color='teal' as={NavLink} exact to="/login">Login</a>
              </Message>
              {isError && <Message negative>Fields informed are invalid or missing!</Message>}
            </Grid.Column>
          </Grid>
        </div>
      )
    }
  }
}

export default Signup