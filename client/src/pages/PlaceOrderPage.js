import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { getError } from '../utils/errorResponse';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};

function PlaceOrderPage() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const { userInfo, cart } = state;

  const roundTo = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = roundTo(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? roundTo(0) : roundTo(10);
  cart.taxPrice = roundTo(0.02 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 style={{ margin: '50px 0px' }} className="text-center">
        Preview Order
      </h1>
      <div style={{ paddingBottom: '50px' }}>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  <strong>Shipping Details</strong>
                </Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {cart.shippingAddress.fullName}
                  <br />
                  <strong>Address:</strong> {cart.shippingAddress.address}
                  <br />
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  <br />
                  {cart.shippingAddress.country}
                  <br />
                </Card.Text>
                <Link to="/shipping">
                  {' '}
                  <p
                    style={{
                      color: '#12adc1',
                      textDecoration: 'underline',
                      display: 'inline-block',
                    }}
                  >
                    Edit
                  </p>
                </Link>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  <strong>Payment Details</strong>
                </Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Link to="/payment">
                  {' '}
                  <p
                    style={{
                      color: '#12adc1',
                      textDecoration: 'underline',
                      display: 'inline-block',
                    }}
                  >
                    Edit
                  </p>
                </Link>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>
                  <strong>Order Details</strong>
                </Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className="img-fluid rounded img-thumbnail"
                          />
                          <Link to={`/product/${item.slug}`}>{item.title}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>
                          <span>${item.price}</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart">
                  <p
                    style={{
                      color: '#12adc1',
                      textDecoration: 'underline',
                      display: 'inline-block',
                    }}
                  >
                    Edit
                  </p>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${cart.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${cart.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${cart.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order Total</strong>
                      </Col>
                      <Col>${cart.totalPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        className="checkout-btn"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
                      </Button>
                      {loading && <Loader></Loader>}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PlaceOrderPage;
