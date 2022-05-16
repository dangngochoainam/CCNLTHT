import { useState } from "react";
import { Button, Col, Row, Toast, ToastContainer } from "react-bootstrap";

const Notification = () => {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);

  return (
    <>
      <Row className="position-relative">
        <Col md={6} className="mb-2">
          <Button
            type="button"
            onClick={toggleShowA}
            class="btn btn-primary position-relative"
          >
            Mails{" "}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
              +99 <span class="visually-hidden">unread messages</span>
            </span>
          </Button>
          <ToastContainer className="position-fixed translate-middle-x">
            <Toast show={showA} onClose={toggleShowA}>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Bootstrap</strong>
                <small className="text-muted">just now</small>
              </Toast.Header>
              <Toast.Body>See? Just like this.</Toast.Body>
            </Toast>
            <Toast  show={showA} onClose={toggleShowA} >
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Bootstrap</strong>
                <small className="text-muted">2 seconds ago</small>
              </Toast.Header>
              <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
            </Toast>
            <Toast show={showA} onClose={toggleShowA}>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Bootstrap</strong>
                <small className="text-muted">just now</small>
              </Toast.Header>
              <Toast.Body>See? Just like this.</Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </>
  );
};

export default Notification;
