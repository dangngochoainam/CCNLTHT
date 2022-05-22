import { useContext, useEffect, useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import Apis, { authAxios, endpoints } from "../../configs/Apis";
import ViewStats from "./ViewStats";

const Stats = () => {
  const [conutPosts, setCountPosts] = useState(0);
  const [statsPosts, setStatsPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [hagtag, setHagtag] = useState([]);
  const location = useLocation();
  const [userMain, dispatch] = useContext(UserContext);

  useEffect(() => {
    const loadStats = async () => {
      let res = await authAxios().get(`${endpoints["admin"]}views/`);
      console.log(res.data);
      setCountPosts(res.data.count_posts);
      setStatsPosts(res.data.stats);
    };
    const loadUser = async () => {
      let res = await Apis.get(`${endpoints["users"]}`);
      console.log(res.data);
      setUser(res.data);
    };

    const loadHagTag = async () => {
      let res = await Apis.get(`${endpoints["hagtags"]}`);
      console.log(res.data);
      setHagtag(res.data);
    };

    loadStats();
    loadUser();
    loadHagTag();

    console.log("useEffect");
  }, [location.search]);

  const search = async (
    e,
    userId = null,
    hagtagId = null,
    created_date = null
  ) => {
    e.preventDefault();

    let res = await authAxios().post(`${endpoints["admin"]}get-posts/`, {
      user_id: userId,
      hagtag: hagtagId,
      date: created_date,
    });

    console.log(res.data);
    setCountPosts(res.data.count_posts);
    setStatsPosts(res.data.stats);
  };

  return (
    <>
      {userMain && userMain.is_superuser ? (
        <>
          {" "}
          <h1 className="text-center text-info">Xem thống kê báo cáo</h1>
          <ViewStats conutPosts={conutPosts} statsPosts={statsPosts} />
          <hr />
          <h1 className="text-center">Tìm kiếm</h1>
          <div className="d-flex justify-content-center mt-3 mb-3">
            <div className="me-5">
              <h3>Tìm theo người dùng</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => search(e, e.target.value)}
                  >
                    <option>Chọn người dùng</option>
                    {user.map((u) => (
                      <option value={u.id}>
                        {u.first_name} {u.last_name}: {u.email}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>

            <div className="me-5">
              <h3>Tìm theo danh mục</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => {
                      search(e, null, e.target.value);
                    }}
                  >
                    <option>Chọn danh mục</option>

                    {hagtag.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>

            <div>
              <h3>Tìm theo thời gian</h3>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Control
                    type="date"
                    placeholder="name@example.com"
                    onChange={(e) => {
                      search(e, null, null, e.target.value);
                    }}
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Stats;
