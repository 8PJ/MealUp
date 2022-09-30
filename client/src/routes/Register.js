import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import apiCalls from "../api/apiCalls";

function Register(props) {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    // validities are only set after submit and can be set to true on change (not to false)
    const [username, setUsername] = useState("");
    const [isInvalidUsername, setIsInvalidUsername] = useState();

    const [email, setEmail] = useState("");
    const [isInvalidEmail, setIsInvalidEmail] = useState();

    const [password, setPassword] = useState("");
    const [isInvalidPassword, setIsInvalidPassword] = useState();

    const createNewUserRedirect = async () => {
        const {success, newUser} = await apiCalls.createUser(username, email, password);

        if (success) {
            console.log(newUser.data);
            navigate("../recipes")
        }
        else {
            setErrorMessage("Error: " + newUser.response.data.message)
        }
    };

    const handleSubmit = event => {
        event.preventDefault();

        let valid = true;

        // check if username is valid
        if (!/^[A-Za-z0-9]*$/.test(username) || username.length < 4 || username.length > 35) {
            setIsInvalidUsername(true);
            valid = false;
        }

        // check if the email is of mostly valid form
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setIsInvalidEmail(true);
            valid = false;
        }

        // check if the email is of mostly valid form
        if (!/^[ -~]*$/.test(password) || password.length < 8 || password.length > 60) {
            setIsInvalidPassword(true);
            valid = false;
        }

        // if all inputs are valid create a new user
        if (valid) {
            createNewUserRedirect();
        }
    };

    // set isInvalidUsername to false when it becomes valid
    useEffect(() => {
        if (/^[A-Za-z0-9]*$/.test(username) && username.length >= 4 && username.length <= 35) {
            setIsInvalidUsername(false);
        }
    }, [username]);

    // set isInvalidEmail to false when it becomes valid
    useEffect(() => {
        if (/^\S+@\S+\.\S+$/.test(email)) {
            setIsInvalidEmail(false);
        }
    }, [email]);

    // set isInvalidPassword to false when it becomes valid
    useEffect(() => {
        if (/^[ -~]*$/.test(password) && password.length >= 8 && password.length <= 60) {
            setIsInvalidPassword(false);
        }
    }, [password]);

    return (
        <Container id="inputFormContainer">
            <h1>Register</h1>
            <p className="formErrorMessage">{errorMessage}</p>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        isInvalid={isInvalidUsername}
                        required
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Username must only contain letters, numbers and must be at least 4 and at
                        most 35 characters long.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        isInvalid={isInvalidEmail}
                        required
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        isInvalid={isInvalidPassword}
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must only contain letters, numbers and the following symbols:{" "}
                        {"! \"#$%&'()*+,-./:;<=>?@[\\]^_{|}~"} and must be at least 8 and at most 60
                        characters long.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="outline-dark" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Register;
