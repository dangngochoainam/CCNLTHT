import { useEffect, useId, useRef, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Apis, { authAxios, endpoints } from "../../configs/Apis";
import cookies from "react-cookies";

const PostsModal = () => {
  const image = useRef();
  const [hagtag, setHagtag] = useState([]);
  const nav = useNavigate();
  const { postsId } = useParams();
  const [posts, setPosts] = useState({
    title: "",
    image: "",
    hagtags: "",
    tag: "",
    content: "",
  });


  let btn = (
    <Button variant="primary" type="submit">
      Lưu
    </Button>
  );

  const updatePosts = async (e) => {

    e.preventDefault()
    let data = new FormData();
    data.append("id", postsId);
    data.append("title", posts.title);
    data.append("image", image.current.files[0]);
    data.append("user", cookies.load("user").id);
    data.append("content", posts.content);
    data.append("hagtags", posts.hagtags);
    data.append("tag", posts.tag);

    try{

      let res = await authAxios().put(`${endpoints["posts"]}${postsId}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);

      if(res.status === 200)
        nav(`/posts/${postsId}`);

    }catch(err){

      console.log(err)
    }


  };

  if (postsId)
    btn = (
      <Button
        variant="primary"
        type="button"
        onClick={(e) => {
          updatePosts(e);
        }}
      >
        Lưu
      </Button>
    );

  const change = (obj) => {
    setPosts({
      ...posts,
      ...obj,
    });
  };

  useEffect(() => {
    const getHagtags = async () => {
      let res = await Apis.get(endpoints["hagtags"]);
      setHagtag(res.data);
    };

    const setPost = async() => {
      let res = await Apis.get(`${endpoints['posts']}${postsId}/`)
      setPosts(res.data)
    }
    if(postsId){
      setPost()
    }
    getHagtags();
    console.log("useEffect")
  }, []);

  const pushPosts = async (e) => {
    e.preventDefault();

    let data = new FormData();
    data.append("title", posts.title);
    data.append("image", image.current.files[0]);
    data.append("user", cookies.load("user").id);
    data.append("content", posts.content);
    data.append("hagtags", posts.hagtags);
    data.append("tag", posts.tag);

    try {
      const res = await authAxios().post(
        `${endpoints["posts"]}add-posts/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      if (res.status === 201) {
        nav("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center mt-3 mb-3">
        <Form onSubmit={pushPosts} style={{ width: "40rem" }}>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu đề</Form.Label>
            <Form.Control
              type="text"
              value={posts.title}
              onChange={(e) => change({ title: e.target.value })}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={posts.content}
              onChange={(e) => change({ content: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="file"
              ref={image}
              multiple
              controlId="formBasicEmail"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thêm nhãn mới</Form.Label>
            <Form.Control
              type="text"
              value={posts.tag}
              onChange={(e) => change({ tag: e.target.value })}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nhãn</Form.Label>
            <Form.Select
              multiple
              aria-label="Default select example"
              onChange={(e) => {
                let value = [];
                var options = e.target.children;
                for (var i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    value.push(options[i].innerHTML);
                  }
                }

                setPosts({
                  ...posts,
                  hagtags: value.join(","),
                });
              }}
            >
              {hagtag.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {btn}
        </Form>
      </Container>
    </>
  );
};

export default PostsModal;
