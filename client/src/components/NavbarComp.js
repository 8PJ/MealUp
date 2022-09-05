import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import Container from "react-bootstrap/Container";

function NavbarComp(props) {
  return (
    <Navbar collapseOnSelect expand="md" variant="dark" className="mainNav" >
      <Container fluid className="p-1 ps-5">
        <Navbar.Brand className="logo" href="/">MealUp</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse className="navLinks justify-content-end" id="responsive-navbar-nav">
          <Nav>
            <Nav.Link className="navLink" href="#Register">Register</Nav.Link>
            <Nav.Link className="navLink" href="#Login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
