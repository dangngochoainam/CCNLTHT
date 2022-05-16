import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { authAxios, endpoints } from "../../configs/Apis";


const Item = (props) => {
  const [user, setUser] = useState();
  const nav = useNavigate()

  useEffect(() => {

    const getUser = async () => {
      let res = await Apis.get(`${endpoints["users"]}${props.user}/`);
      setUser(res.data);
    };
    // const getHagtags = async () => {
      
    // }

    getUser();

  }, [props.user]);


  const userDetail = (id) => {
    nav(`/users/${id}`)
  }

  const getPostsDetail = (id) => {
    const getViews = async() => {
      let res = await Apis.get(`${endpoints['posts']}${props.id}/views/`)
    }
    getViews()
    nav(`/posts/${id}`)
  }

  const deletePosts = (id) => {
    const del = async() => {
      let res = await authAxios().delete(`${endpoints['posts']}${id}/`)
      console.log(res)
      alert("Xóa thành công")
      if(res.status === 204)
        nav('/')
    }
    del()
    
  } 
  
  let btnDetail = <Button onClick={() => getPostsDetail(props.id)} variant="primary" >Xem chi tiết</Button>

  let task = <>
  <Col className="d-flex justify-content-center" xs={6} md={6}>
    <Button variant="primary"  onClick={() => like()}>Thích</Button>
  </Col>
  <Col className="d-flex justify-content-center" xs={6} md={6}>
    <Button onClick={() => getPostsDetail(props.id)} variant="primary" >Bình luận</Button>
  </Col>
  </>

  if(props.detail){
    btnDetail = null
    task = <>
    <Col className="d-flex justify-content-center" xs={6} md={6}>
    <Button variant="primary"  onClick={() => like()}>Thích</Button>
  </Col>
    </>
  }
  
  let link = null
  if(props.hagtags && props.hagtags.length != 0){
    link = <>
              {props.hagtags.map((t, idx) =>  <Link className="nav-link" to={`/?hagtag=${t.id}`} key={idx}>#{t.name}</Link>)}
    </> 
  }

  if(props.check){
    

    task = <>
            <Col className="d-flex justify-content-center" xs={3} md={3}>
              <Button variant="primary" onClick={() => like()}>Thích</Button>
            </Col>
            <Col className="d-flex justify-content-center" xs={3} md={3}>
              <Button variant="primary" onClick={() => {
                nav(`/posts/${props.id}/update-posts/`)
              }}>Sửa</Button>
            </Col>
            <Col className="d-flex justify-content-center" xs={3} md={3}>
              <Button variant="danger" onClick={() => deletePosts(props.id)}>Xóa</Button>
            </Col>
    </>
  

  }

  const like = async() => {

    let res = await authAxios().post(`${endpoints['posts']}${props.id}/like/`)
    console.log(res.data)

  }

  return (
    <>
      <Col xs={12} md={12} className='text-center d-flex justify-content-center'>
        <Card border="secondary" style={{ width: "40rem", padding: "5px" }}>
          <Button onClick={() => userDetail(user.id)} variant="info" style={{ margin: "0.5rem" }}>
            {user && (
              <>
                <Image
                  src={user.avatar}
                  roundedCircle="True"
                  style={{ width: "3rem", height:"3rem" }}
                />{" "}
                <span>
                  {user.first_name} {user.last_name}
                </span>
              </>
            )}
          </Button>
          <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <p>Ngày tạo: {props.created_date}</p>
            <Card.Text>
              {props.content}
            </Card.Text>
            <Card.Text className="d-flex justify-content-center">{link}</Card.Text>
          </Card.Body>
          <Card.Img variant="top" src={props.image} />
          <Row style={{ margin: "1rem" }} className="d-flex justify-content-center">
            {task}
          </Row>
          {btnDetail}
        </Card>
      </Col>
    </>
  );
};

export default Item;
