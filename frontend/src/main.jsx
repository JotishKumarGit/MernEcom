import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/Auth.jsx';
import { SearchProvider } from './Context/Search.jsx';
import { CartProvider } from './Context/Cart.jsx';
<script src="https://js.braintreegateway.com/web/dropin/1.33.4/js/dropin.min.js"></script>


createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>,
)

