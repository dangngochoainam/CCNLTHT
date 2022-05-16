import { Alert, Container } from "react-bootstrap";

const Footer = () => {
  return (
    <>

        <Alert variant="success">
        <Alert.Heading>Social Media App</Alert.Heading>
        <p>
            Dang Ngoc Hoai Nam &copy; 2022
        </p>
        {/* <hr />
        <p className="mb-0">
            Whenever you need to, be sure to use margin utilities to keep things
            nice and tidy.
          </p> */}
        </Alert>

    </>
  );
};

export default Footer;
