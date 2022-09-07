import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import '../styles/spinner.css';
export default function Loader() {
  return (
    // <Spinner
    //   animation="grow"
    //   role="status"
    //   size="lg"
    //   style={{
    //     textAlign: 'center',
    //   }}
    // >
    // </Spinner>
    <div className="App">
      <div className="spinner-container">
        <div className="loading-spinner"></div>
      </div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
