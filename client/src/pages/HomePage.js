import React from 'react';
import { Helmet } from 'react-helmet-async';
import Products from '../components/Products';

function HomePage() {
  return (
    <div>
      <main>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Products />
      </main>
    </div>
  );
}

export default HomePage;
