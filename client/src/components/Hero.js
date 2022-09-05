import Container from "react-bootstrap/Container";

function Hero(props) {
  return (
    <Container className="HeroArea d-flex flex-column">
      <h1 className="heroMessage">Focus on Cooking,</h1>
      <h1 className="heroMessage2">Let the computer do the planning.</h1>
    </Container>
  );
}

export default Hero;
