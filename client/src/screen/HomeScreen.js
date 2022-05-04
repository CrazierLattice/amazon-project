import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

const HomeScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { products, loading, error } = state;
  const baseURL = 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      ctxDispatch({
        type: 'FETCH_REQUEST',
      });
      try {
        const result = await axios.get(`${baseURL}/api/products`);
        ctxDispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        ctxDispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Mishka-Zone</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} l={2} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
