import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import MessageBox from '../../components/MessageBox';
import { StoreContext } from '../../contexts/StoreContext';
import { toast } from 'react-toastify';
import { getError } from '../../utils/errorResponse';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };

    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };

    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };

    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };

    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function ProductList() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createProductHandler = async () => {
    navigate('/admin/addproduct');
    // try {
    //   dispatch({ type: 'CREATE_REQUEST' });
    //   const { data } = await axios.post(
    //     '/api/products',
    //     {},
    //     {
    //       headers: { Authorization: `Bearer ${userInfo.token}` },
    //     }
    //   );
    //   toast.success('Product Created Successfully');
    //   dispatch({ type: 'CREATE_SUCCESS' });
    //   navigate(`/admin/product/${data.product._id}`);
    //   return;
    // } catch (error) {
    //   toast.error(getError(error));
    //   dispatch({
    //     type: 'CREATE_FAIL',
    //   });
    // }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure you want to delete the product?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>All Products</h1>
        </Col>

        <Col className="col text-end">
          <div>
            <Button
              className="checkout-btn"
              type="button"
              onClick={createProductHandler}
            >
              Add New Product
            </Button>
          </div>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {loading ? (
        <Loader />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id.slice(-6)}</td>
                  <td>{product.title}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <Button
                      style={{ color: '#fff !important' }}
                      target="_blank"
                      type="button"
                      variant="primary"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i> View
                    </Button>
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      style={{ marginLeft: '10px' }}
                    >
                      <i className="fa fa-pencil-square-o" aria-hidden="true" />{' '}
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => deleteHandler(product)}
                      style={{ marginLeft: '10px' }}
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
