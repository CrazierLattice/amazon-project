import Alert from 'react-bootstrap/Alert';

const MessageBox = ({ error, variant }) => {
  return <Alert variant={variant || 'info'}>{error}</Alert>;
};

export default MessageBox;
