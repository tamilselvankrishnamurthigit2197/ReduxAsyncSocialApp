import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.jsx'
import { fetchUsers } from './features/users/usersSlice.jsx'
import { fetchPosts } from './features/posts/postsSlice.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'

store.dispatch(fetchUsers())
store.dispatch(fetchPosts())
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Router>
    <App />
    </Router>
    </Provider>
  </StrictMode>,
)
