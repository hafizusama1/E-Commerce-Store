import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { StoreContext } from '../contexts/StoreContext';
import { useNavigate } from 'react-router-dom';

function PaymentPage() {
  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const navigate = useNavigate();
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'Paypal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment</title>
        </Helmet>
        <h1 className="my-3">Payment</h1>

        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Paypal"
              label="Paypal"
              value="Paypal"
              checked={paymentMethodName === 'Paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <Form.Check
              type="radio"
              id="CashOnDelivery"
              label="Cash On Delivery"
              value="Cash On Delivery"
              checked={paymentMethodName === 'Cash On Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PaymentPage;
