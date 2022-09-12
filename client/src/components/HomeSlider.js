import React from 'react';
import { Link } from 'react-router-dom';
function HomeSlider() {
  return (
    <div className="hero-image">
      <div className="hero-text">
        <h1>Welcome to Knives Out</h1>
        <p>
          Looking for Damascus Knives Collection? Look no further than Knives
          Out. Click Below to browse our huge selection
        </p>
        <Link to="/products">
          <button>ORDER NOW</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeSlider;
