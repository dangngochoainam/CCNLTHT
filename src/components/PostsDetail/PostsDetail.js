import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Apis, { authAxios, endpoints } from "../../configs/Apis";
import Item from "../Item/Item";
import cookies, { load } from "react-cookies";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Moment from "react-moment";
import { NotifContext, UserContext } from "../../App";

const PostsDetail = () => {
  const { postsId } = useParams();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState();
  const [changed, setChanged] = useState(0)
  const [user, dispatch] = useContext(UserContext);
  const [notif, dispatchNotif] = useContext(NotifContext);



  useEffect(() => {


    const getPosts = async () => {
      try {
        let res = await Apis.get(`${endpoints["posts"]}${postsId}/`);
        let resCmt = await Apis.get(
          `${endpoints["posts"]}${postsId}/comments/`
        );
        setPosts(res.data);
        setComments(resCmt.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPosts();

    console.log("useEffect");
  }, [postsId, changed]);

  const addComment = async(e) => {

    e.preventDefault()
    let res = await authAxios().post(`${endpoints['posts']}${postsId}/add-comment/`, {
      "content": commentContent
    })
    comments.push(res.data)
    setComments(comments)
    setChanged(comments.length)
    setCommentContent('')

    console.log(res.data)

    let resNotif = await authAxios().get(`${endpoints['notifications']}${res.data.notification}/`)

      console.log(resNotif.data)

      // cookies.save("notifications", [...notif, resNotif.data])
      localStorage.setItem("notifications", JSON.stringify([...notif, resNotif.data]))



      dispatchNotif({
        type: "comment",
        payload: [resNotif.data],
      });
    


  }

  let btn = (
    <em><Link to="/login" className="primary nav-link">
      Đăng nhập để bình luận
    </Link></em>
  );


let check = false
  if (user){

    if(posts){

      check = user.id === posts.user
    }
    btn = (
      <>
        <Form onSubmit={addComment} className="ps-5 pe-5">
          <Form.Group className="mb-3" controlId="commentContent">
            <Form.Control
              as="textarea"
              placeholder="Nhập nội dung bình luận..."
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          </Form.Group>
          <Button type='submit' className="primary">Thêm bình luận</Button>
        </Form>
      </>
    );} 

  return (
    <>
      <h1 className="text-center">Chi tiết bài viết</h1>

      {posts && (
        <Item
          id={posts.id}
          detail={true}
          hagtags={posts.hagtags}
          image={posts.image}
          user={posts.user}
          title={posts.title}
          created_date={posts.created_date}
          content={posts.content}
          check={check}
        />
      )}
      <hr />
      {btn}
      <hr />

      <div className="d-flex flex-column">
        <h5 className="text-center">Danh sách các bình luận</h5>
        {comments.map((c) => (
          <>
            <Row key={c.id} style={{ width: "80rem" }} className="d-flex mb-3">
              <Col
                md={2}
                xs={5}
                className="d-flex justify-content-center align-items-center"
              >
                <Image
                  src={c.user.avatar}
                  roundedCircle
                  style={{ width: "2rem", height: "2rem" }}
                />
              </Col>
              <Col
                md={10}
                xs={70}
                className="d-flex justify-content-center flex-column"
              >
                <p className="mb-0">{c.content}</p>
                <p className="mb-1 mt-1">
                  Bình luận bởi: {c.user.first_name} {c.user.last_name}
                </p>
                <p className="mb-0">
                  Vào lúc: <Moment fromNow>{c.created_date}</Moment>{" "}
                </p>
              </Col>
            </Row>
          </>
        ))}
      </div>
    </>
  );
};

export default PostsDetail;
