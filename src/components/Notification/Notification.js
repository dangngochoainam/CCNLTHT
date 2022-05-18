import { useState } from "react";
import { Button, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import Moment from "react-moment";
import { Link, useNavigate } from "react-router-dom";

const Notification = (props) => {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);
  const nav = useNavigate()

  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);
  
  let jsx = null

  const navDetail = (id) => {

    nav(`/posts/${id}/`)
  }

  if(typeof(props.data) == 'object'){

    jsx = <>
    {props.data.map(n => <Toast show={showA} onClose={toggleShowA}>
              <Toast.Header>
                <strong className="me-auto">{n.content}</strong>
                <small className="text-muted"><Moment fromNow>{n.created_date}</Moment></small>
              </Toast.Header>
              <Toast.Body>{n.creator.first_name} {n.creator.last_name} đã {n.content} bài viết của bạn</Toast.Body>
              <Link className="nav-link" to={`/posts/${n.posts.id}`} style={{color: "lightblue"}}>Xem chi tiết</Link>
            </Toast>)}
    </>

  }

  return (
    <>
      <Row className="position-relative">
        <Col md={6} className="mb-2">
          <Button
            style={{width: "6.5rem"}}
            type="button"
            onClick={toggleShowA}
            class="btn btn-primary position-relative"
          >
            Thông báo{" "}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
              {props.length} <span class="visually-hidden">unread messages</span>
            </span>
          </Button>
          <ToastContainer className="position-fixed translate-middle-x" style={{zIndex: 199, backgroundColor:"white"}}>
              {jsx}
          </ToastContainer>
        </Col>
      </Row>
    </>
  );
};

export default Notification;
