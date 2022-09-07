import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function Hero(props) {
    return (
        <>
            <Container className="heroHeadline">
                <h1 className="heroMessage">Focus on Cooking,</h1>
                <h1 className="heroMessage2">Let the computer do the planning.</h1>
            </Container>
            <Container className="heroText">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sollicitudin
                    rhoncus arcu at fermentum. Vivamus a congue eros. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Vestibulum aliquam hendrerit tellus ut vehicula.
                    Maecenas ornare auctor feugiat. Suspendisse a lacus odio. Donec tristique enim
                    vel ligula pharetra porttitor. Aenean libero nunc, convallis eu erat a, lacinia
                    maximus velit. Cras erat odio, mollis sit amet luctus posuere, porta eget
                    tortor.
                </p>
            </Container>
            <Container className="d-flex justify-content-center heroCallToAction">
                <a href="#Register">
                    <Button variant="outline-dark" type="button" className="heroButton" size="lg">
                        Get Started
                    </Button>
                </a>
            </Container>
        </>
    );
}

export default Hero;
