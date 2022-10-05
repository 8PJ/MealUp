import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import { UserContext } from "../contexts/userContext";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

import apiCalls from "../api/apiCalls";

function NavbarComp(props) {
    const userContext = useContext(UserContext);

    const logout = () => {
        apiCalls.logoutUser();
        window.location.replace("/");
    };

    return (
        <Navbar collapseOnSelect expand="md" variant="dark" className="mainNav">
            <Container fluid className="p-1 ps-5">
                <Navbar.Brand className="logo">
                    <Link to="/">MealUp</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                    className="navLinks justify-content-end"
                    id="responsive-navbar-nav"
                >
                    <Nav>
                        <Nav.Link
                            as={NavLink}
                            className="navLink"
                            to={userContext.isLoggedIn ? "recipes" : "register"}
                        >
                            {userContext.isLoggedIn ? "Recipes" : "Register"}
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            className="navLink lastBeforeLogOut"
                            to={userContext.isLoggedIn ? "mealPlan" : "login"}
                        >
                            {userContext.isLoggedIn ? "Meal Plan" : "Login"}
                        </Nav.Link>
                        {userContext.isLoggedIn && (
                            <Nav.Link className="navLink" onClick={logout}>
                                Log out
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComp;
