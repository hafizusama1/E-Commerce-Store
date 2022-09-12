import React, { useContext, useEffect, useReducer, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import { getError } from '../../utils/errorResponse';
import Loader from '../../components/Loader';
import MessageBox from '../../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'ADD_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'ADD_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

function AddProduct() {
  const { state } = useContext(StoreContext);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');

  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'ADD_REQUEST' });
      await axios.post(
        '/api/products',
        {
          title: title,
          slug: slug,
          price: price,
          image: image,
          category: category,
          countInStock: countInStock,
          description: description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'ADD_SUCCESS' });
      toast.success('Product Added successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'ADD_FAIL' });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Add New Product</title>
      </Helmet>
      <h1>Add New Product</h1>

      <Form onSubmit={submitHandler}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Sample Product"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="30"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slug</Form.Label>
          <Form.Control
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="sample-product"
          />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={uploadFileHandler} />
              {loadingUpload && <Loader />}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="additionalImage">
              <Form.Label>Additional Images</Form.Label>
              {images.length === 0 && <MessageBox>No image</MessageBox>}
              <ListGroup variant="flush">
                {images.map((x) => (
                  <ListGroup.Item key={x}>
                    {x}
                    <Button
                      variant="light"
                      onClick={() => deleteFileHandler(x)}
                    >
                      <i className="fa fa-times-circle"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="additionalImageFile">
              <Form.Label>Upload Additional Images</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => uploadFileHandler(e, true)}
              />
              {loadingUpload && <Loader></Loader>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Chef Knives"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
                placeholder="50"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows="7"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Explain about product..."
          />
        </Form.Group>
        <div className="mb-3">
          <Button className="checkout-btn" type="submit">
            Update
          </Button>
          {/* {loadingUpdate && <Loader></Loader>} */}
        </div>
      </Form>
    </Container>
  );
}

export default AddProduct;
