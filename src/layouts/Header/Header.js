import { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  Image,
  Nav,
  Navbar,
} from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import cookies from "react-cookies";
import PostsModal from "../../components/PostsModal/PostsModal";
import Notification from "../../components/Notification/Notification";

const Header = () => {
  const [hagtags, setHagtags] = useState([]);
  const [kw, setKw] = useState("");
  const nav = useNavigate();
  const [user, dispatch] = useContext(UserContext);

  useEffect(() => {
    const loadHagtags = async () => {
      let res = await Apis.get(endpoints["hagtags"]);
      setHagtags(res.data);
    };
    loadHagtags();
  }, []);

  const search = (e) => {
    e.preventDefault();
    nav(`?kw=${kw}`);
  };

  const logout = (evt) => {
    evt.preventDefault();

    cookies.remove("access_token");
    cookies.remove("user");

    dispatch({
      type: "logout",
    });

    nav("/login");
  };

  let path = (
    <>
    <Link to="/login" className="text-info nav-link">
      Đăng nhập
    </Link>
    <Link className="nav-link" to="/register">
                Đăng ký
              </Link>
    </>
  );

  if (user !== null && user !== undefined) {
    path = (
      <>
        <Image
          src={user.avatar}
          roundedCircle="True"
          style={{ width: "2rem", height: "2rem" }}
        />{" "}
        <Link to={`/users/${user.id}/`} className="text-info nav-link">
          {user.first_name} {user.last_name}
        </Link>
        <Notification/>
        <a href="#" onClick={logout} className="nav-link text-danger">
          Đăng xuất
        </a>
      </>
    );
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Link to="/" className="navbar-brand">
            Social Media App
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>

              {user && (
                <Link className="nav-link" to="posts/add-posts">
                  Tạo bài viết mới
                </Link>
              )}

              {/* {hagtags.map((h, idx) => {
                
                let path = `?hagtag=${h.id}`

                return <Link className="nav-link" to={path} key={h.id}>{h.name}</Link>

                })} */}
            </Nav>
            <Form className="d-flex me-3" onSubmit={search}>
              <FormControl
                type="search"
                value={kw}
                placeholder="Search"
                onChange={(e) => setKw(e.target.value)}
                className="mr-2"
                aria-label="Search"
              />

              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>
            <Nav className="d-flex justify-content-center align-items-center">
              {path}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;