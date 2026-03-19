import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './App'

const theme = createTheme({
  primaryColor: 'blue',
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
)
