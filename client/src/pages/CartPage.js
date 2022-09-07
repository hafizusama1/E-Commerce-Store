import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useContext } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { StoreContext } from '../contexts/StoreContext';
import axios from 'axios';

function CartPage() {
  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, the product is out of stock now.');
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={10}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty. <Link to="/">Go Shopping</Link>{' '}
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => {
                return (
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
                        <Button
                          variant="light"
                          disabled={item.quantity === 1}
                          onClick={() => {
                            updateCartHandler(item, item.quantity - 1);
                          }}
                        >
                          <i className="fas fa-minus-circle" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          onClick={() => {
                            updateCartHandler(item, item.quantity + 1);
                          }}
                        >
                          <i className="fas fa-plus-circle" />
                        </Button>
                      </Col>
                      <Col md={2}> ${item.price}</Col>
                      <Col md={1}>
                        <Button
                          variant="light"
                          onClick={() => removeItemHandler(item)}
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                : ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </h3>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div className="d-grid">
                <Button
                  type="button"
                  variant="primary"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;
