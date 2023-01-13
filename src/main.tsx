import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {CartProvider} from './context/CartProvider'
import {ProductsProvider} from './context/ProductsProvider'

// Wrap application in the providers that have been created. 
//NOTE: Context providers dont need to wrap entire app, Can just wrap specific part/component in the provider as needed

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ProductsProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductsProvider>
  </React.StrictMode>,
)
