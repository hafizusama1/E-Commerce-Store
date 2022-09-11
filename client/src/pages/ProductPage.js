import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils/errorResponse';
import { StoreContext } from '../contexts/StoreContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(StoreContext);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(data.countInStock);
    if (data.countInStock < quantity) {
      setTimeout(() => {
        window.alert('Sorry, the product is out of stock.');
      }, 500);
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    navigate('/cart');
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Row>
      <Col md={6} className="col-centered">
        <img
          className="img-large text-center"
          src={selectedImage || product.image}
          alt={product.name}
        />
        <ListGroup.Item>
          <Row xs={1} md={2} className="g-2">
            {[product.image, ...product.images].map((x) => (
              <Col key={x} style={{ width: '20%' }}>
                <Button
                  className="thumbnail"
                  type="button"
                  variant="light"
                  onClick={() => setSelectedImage(x)}
                >
                  <Card.Img variant="top" src={x} alt="product" />
                </Button>
              </Col>
            ))}
          </Row>
        </ListGroup.Item>
      </Col>

      <Col md={6}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Helmet>
              <title>{product.title}</title>
            </Helmet>
            <h1>{product.title}</h1>
          </ListGroup.Item>
          <ListGroup.Item>
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </ListGroup.Item>
          <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Status:</Col>
              <Col>
                {product.countInStock > 0 ? (
                  <Badge bg="success">
                    Only {product.countInStock} left in stock.
                  </Badge>
                ) : (
                  <Badge bg="danger">Out Of Stock</Badge>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
          {product.countInStock === 0 ? (
            <ListGroup.Item>
              <div className="">
                <Button variant="primary" disabled>
                  Add to Cart
                </Button>
              </div>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>
              <div className="">
                <Button variant="primary" onClick={addToCartHandler}>
                  Add to Cart
                </Button>
              </div>
            </ListGroup.Item>
          )}

          <ListGroup.Item>
            <h4>Description:</h4>
            <p>{product.description} </p>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}

export default ProductPage;
