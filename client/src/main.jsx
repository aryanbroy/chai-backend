import React from 'react'
import ReactDOM from 'react-dom/client'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryCLient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <QueryClientProvider client={queryCLient}>
      <App />
    </QueryClientProvider>
  </>,
)
