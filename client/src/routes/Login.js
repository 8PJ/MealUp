import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/userContext";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import apiCalls from "../api/apiCalls";

function Login(props) {
    const userContext = useContext(UserContext);

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const handleSubmit = async event => {
        event.preventDefault();
        setErrorMessage("");

        const { success, response } = await apiCalls.loginUser(username, password);

        if (success) {
            const { setIsLoggedIn, setAuthUsername, setAuthEmail, setAuthUserID } = userContext;

            const { email, user_id, username } = response.data.user;

            setIsLoggedIn(true);
            setAuthUsername(username);
            setAuthEmail(email);
            setAuthUserID(user_id);

            navigate("../mealPlan");
        } else {
            setErrorMessage("Error: " + response.response.data.message);
        }
    };

    return (
        <Container id="inputFormContainer">
            <h1>Login</h1>
            <p className="formErrorMessage">{errorMessage}</p>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="outline-dark" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
