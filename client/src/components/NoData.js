import { NavLink } from "react-router-dom";

import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

function NoData(props) {
    return (
        <>
            <Container className="noContentMessage">{props.message}</Container>
            {props.link && props.linkText && (
                <Container className="d-flex justify-content-center noContentActionButtonContainer">
                    <NavLink to={props.link}>
                        <Button
                            variant="outline-dark"
                            type="button"
                            className="noDataActionButton"
                            size="lg"
                        >
                            {props.linkText || "Get Startyed"}
                        </Button>
                    </NavLink>
                </Container>
            )}
        </>
    );
}

export default NoData;
