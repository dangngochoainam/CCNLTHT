import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Apis, { authAxios, endpoints } from "../../configs/Apis";
import emailjs from "@emailjs/browser";

const Ordered = () => {
  const { postsId } = useParams();
  const [price, setPrice] = useState();
  const [content, setContent] = useState();
  const [user, dispatch] = useContext(UserContext);
  const [buyer, setBuyer] = useState([]);
  const [posts, setPosts] = useState();
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      let res = await Apis.get(`${endpoints["posts"]}${postsId}/`);
      setPosts(res.data);
    };
    getPosts();

    const loadBuyer = async () => {
      let res = await authAxios().get(
        `${endpoints["posts"]}${postsId}/get-buyer/`
      );
      setBuyer(res.data.reverse());
    };

    loadBuyer();

    console.log("useEffect");
  }, [changed]);

  const order = async () => {
    let res = await authAxios().post(
      `${endpoints["posts"]}${postsId}/auctions/`,
      {
        content: content,
        price: price,
      }
    );
    console.log(res.data);
    setContent('')
    setPrice(0)
  };

  const sendEmail = (message, toEmail) => {
    emailjs.send(
      "service_ezcg598",
      "template_60h0lvq",
      {
        name: 'bạn',
        from_name: user.email,
        message: message,
        subject: "THÔNG TIN VỀ ĐẤU GIÁ",
        to_email: toEmail,
      },
      "IwjaAhtk24FOVrWy7"
    );
  }

 

  const buy = async (id) => {
    const emailLoser = buyer.reduce((acc, item) => {
      if (item.id !== id) {
        
        return [...acc, item.user.email];
      } else return [...acc];
    }, []);

    const emailWiner = buyer.filter((b) => b.id === id)[0].user.email;
    const price = buyer.filter((b) => b.id === id)[0].price;

    let res = await authAxios().post(`${endpoints["posts"]}${postsId}/buy/`, {
      auctions_id: id,
      email_winer: emailWiner,
      email_loser: emailLoser,
      price: price,
    });

    console.log(res.data);

    sendEmail(`Bạn đã thắng đấu giá với "${posts.title}" với giá ${res.data.price}.
    Vui lòng liên hệ email: ${user.email} để tiến hành các thủ tục còn lại.`,
    res.data.email_winer)

    sendEmail(`Bạn đã thua đấu giá với "${posts.title}".`, res.data.email_loser)

    setChanged(!changed);
  };

  let buyers = null;

  if (posts && user) {
    if (posts.user === user.id) {
      console.log(buyer);
      buyers = buyer.map((b) => (
        <>
          <Row key={b.id} style={{ width: "80rem" }} className="d-flex mb-3">
            <Col
              md={2}
              xs={4}
              className="d-flex justify-content-center align-items-center flex-column"
            >
              <Image
                src={b.user.avatar}
                roundedCircle
                style={{ width: "2rem", height: "2rem" }}
              />
              <Link to={`/users/${b.user.id}`} className="mb-1 mt-1 nav-link">
                {b.user.first_name} {b.user.last_name}
              </Link>
            </Col>
            <Col
              md={8}
              xs={6}
              className="d-flex justify-content-center flex-column"
            >
              <p className="mb-0">
                Giá tiền: {b.price} VNĐ
                <br /> Nội dung: {b.content}
              </p>
              <p className="mb-0">
                Vào lúc: <Moment fromNow>{b.created_date}</Moment>{" "}
              </p>
            </Col>
            <Col
              md={2}
              xs={2}
              className="d-flex justify-content-center flex-column"
            >
              <Button onClick={() => buy(b.id)} className="primary">
                {b.active ? "Đã mua" : "Bán"}
              </Button>
            </Col>
          </Row>
          <hr />
        </>
      ));
    }
  }

  let form = (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Tiền</Form.Label>
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Nhập số tiền muốn đấu giá"
            autoFocus
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            value={content}
            onChange={(e) => setContent(e.target.value)}
            as="textarea"
            rows={3}
            placeholder="Nhập nội dung..."
          />
        </Form.Group>
        <Button className="primary" onClick={order}>
          Lưu
        </Button>
      </Form>
    </>
  );

  if (posts) {
    if (posts.active === false) {
      form = <h1>Sản phẩm đã được đấu giá thành công</h1>;
    }
  }

  return (
    <>
      <Container className="mt-3 mb-3">
        {form}
        <hr />
        {buyers}
      </Container>
    </>
  );
};

export default Ordered;
