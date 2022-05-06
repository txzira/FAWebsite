import React from 'react';
import { Toaster } from 'react-hot-toast';

import  Layout  from '../components/Layout';
import { StateContext } from '../context/StateContext';
import { CartProvider } from '../context/cart';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return(
    <StateContext>
      <CartProvider>
        <Layout>
          <Toaster />
          <Component {...pageProps} />  
        </Layout>
      </CartProvider>
    </StateContext>
  ) 
}


export default MyApp
