import React from 'react';
import { Helmet } from 'react-helmet-async';
import HomeSlider from '../components/HomeSlider';
import Products from '../components/Products';

function HomePage() {
  return (
    <div>
      <main>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <HomeSlider />
        <Products />
      </main>
    </div>
  );
}

export default HomePage;
