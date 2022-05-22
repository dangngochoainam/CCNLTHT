import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { authAxios, endpoints } from "../../configs/Apis";

const Report = (props) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const report = async () => {
    let res = await authAxios().post(
      `${endpoints["users"]}${props.id}/report/`,
      {
        content: content,
      }
    );
    console.log(res.data);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Report
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Báo cáo người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Nội dung báo cáo</Form.Label>
              <Form.Control
                value={content}
                onChange={(e) => setContent(e.target.value)}
                as="textarea"
                rows={3}
                placeholder="Nhập nội dung..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              report();
              handleClose();
            }}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Report;
