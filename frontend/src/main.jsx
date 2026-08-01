import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
let persistor=persistStore(store)
import axios from 'axios'
import { server } from './constant/config.js'
import { getAuthToken } from './lib/authStorage.js'
axios.defaults.baseURL = server
axios.defaults.withCredentials = true
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
    <Toaster/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
