import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>
        <div className="text-center">
          <h4>SIGN IN</h4>
        </div>
      </Col>
      <Col className={props.step2 ? 'active' : ''}>
        <div className="text-center">
          <h4>SHIPPING</h4>
        </div>
      </Col>
      <Col className={props.step3 ? 'active' : ''}>
        <div className="text-center">
          <h4>PAYMENT</h4>
        </div>
      </Col>
      <Col className={props.step4 ? 'active' : ''}>
        <div className="text-center">
          <h4>PLACE ORDER</h4>
        </div>
      </Col>
    </Row>
  );
}

export default CheckoutSteps;
