import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { NotifContext, UserContext } from "../../App";
import Apis, { authAxios, endpoints } from "../../configs/Apis";
import cookies from "react-cookies";

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [user, dispatch] = useContext(UserContext);
  const [notif, dispatchNotif] = useContext(NotifContext);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      let info = await Apis.get(endpoints["oauth2-info"]);
      let res = await Apis.post(endpoints["login"], {
        client_id: info.data.client_id,
        client_secret: info.data.client_secret,
        username: username,
        password: password,
        grant_type: "password",
      });

      console.info(res.data);
      cookies.save("access_token", res.data.access_token);

      let user = await Apis.get(endpoints["current-user"], {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      console.log(user.data);

      let resNotif = await authAxios().get(
        `${endpoints["users"]}${user.data.id}/get-notifications/`
      );
        localStorage.setItem("notifications", JSON.stringify(resNotif.data))
        console.log(resNotif.data)
      // cookies.save("notifications", resNotif.data);
      cookies.save("user", user.data);

      dispatch({
        type: "login",
        payload: user.data,
      });

      dispatchNotif({
        type: "load",
        payload: resNotif.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (user != null) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1 className="text-center text-info">Đăng nhập</h1>
      <Container>
        <Form onSubmit={login}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập ..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Login;
