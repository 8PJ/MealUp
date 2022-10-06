import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/userContext";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Hero(props) {
    const usercontext = useContext(UserContext);

    return (
        <>
            <Container className="heroHeadline">
                <h1 className="heroMessage">Focus on Cooking,</h1>
                <h1 className="heroMessage2">Let the computer do the planning.</h1>
            </Container>
            <Container className="heroText">
                <p>
                    MealUp is here to help you make a meal schedule that promotes variety of
                    ingredients and recipes. Each day, recipes are selected based on what you've
                    cooked previously, to have as few repeating ingredients as possible. Simply
                    submit the recipes that you already use and MealUp will do all the rest.
                </p>
            </Container>
            <Container className="d-flex justify-content-center heroCallToAction">
                <Link to={!usercontext.isLoggedIn ? "/register" : "/recipes/followed"}>
                    <Button variant="outline-dark" type="button" className="heroButton" size="lg">
                        Get Started
                    </Button>
                </Link>
            </Container>
        </>
    );
}

export default Hero;
