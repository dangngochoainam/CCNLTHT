import { Container, Image } from "react-bootstrap"


const UserDetail = (props) => {

    return (
        <>
           <div>
               <Image src={props.avatar} roundedCircle='true' style={{ width: "10rem", height: "10rem", margin: "1rem"}}/>
               <span  style={{margin: "2rem"}} className="">{props.first_name} {props.last_name}</span>
               <p>Thông tin liên hệ: {props.email}</p>
           </div>
        </>
    )
}

export default UserDetail