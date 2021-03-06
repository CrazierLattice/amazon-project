import React, { useContext, useEffect } from 'react';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Store } from '../Store';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';

const OrderScreen = () => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, order, loadingPay, successPay } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        ctxDispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        console.log('data', data);
        ctxDispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is Paid');
      } catch (error) {
        console.log(error);
        ctxDispatch({ type: 'PAY_FAIL', payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };

  const onError = (error) => {
    toast.error(getError(error));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        ctxDispatch({ type: 'FETCH_ORDER_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        ctxDispatch({ type: 'FETCH_ORDER_SUCCESS', payload: data });
      } catch (error) {
        console.log(error);
        console.log(getError(error));
        ctxDispatch({
          type: 'FETCH_ORDER_FAILED',
          payload: getError(error),
        });
      }
      console.log(order);
    };
    if (!userInfo) return navigate('/login');
    if (!order?._id || successPay || (order?._id && order?._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        ctxDispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return state.loading ? (
    <LoadingBox></LoadingBox>
  ) : state.error ? (
    <MessageBox variant="danger">{state.error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order?.shippingAddress?.fullName} <br />
                <strong>Address:</strong> {order?.shippingAddress?.address},
                {order?.shippingAddress?.city},{' '}
                {order?.shippingAddress?.postalCode},{' '}
                {order?.shippingAddress?.country}
              </Card.Text>
              {order?.isDelivered ? (
                <MessageBox variant="success">
                  Delivered At {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </Card.Text>
              {order?.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order?.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items in Cart</Card.Title>
              <ListGroup variant="flush">
                {order?.orderItems?.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order?.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order?.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total Price</Col>
                    <Col>${order?.totalPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order?.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox></LoadingBox>
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default OrderScreen;
