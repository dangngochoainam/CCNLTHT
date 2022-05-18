import { useContext } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { UserContext } from "../../App";
import Report from "../Report/Report";

const UserDetail = (props) => {
    const [user, dispatch] = useContext(UserContext);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center mb-3">
        <Image
          src={props.avatar}
          roundedCircle="true"
          style={{ width: "10rem", height: "10rem", margin: "1rem" }}
        />
        <span style={{ margin: "1rem" }} className="">
          {props.first_name} {props.last_name}
        </span>
        <p>Thông tin liên hệ: {props.email}</p>
        {props.id !== user.id && <Report id={props.id}/> }
        
      </div>
    </>
  );
};

export default UserDetail;
