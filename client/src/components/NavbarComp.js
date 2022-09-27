import { Link } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function NavbarComp(props) {
    return (
        <Navbar collapseOnSelect expand="md" variant="dark" className="mainNav">
            <Container fluid className="p-1 ps-5">
                <Navbar.Brand className="logo">
                    <Link to="/">MealUp</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse className="navLinks justify-content-end" id="responsive-navbar-nav">
                    <Nav>
                        <Link className="navLink" to="Register">
                            Register
                        </Link>
                        <Link className="navLink" to="Login">
                            Login
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComp;
