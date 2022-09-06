import Container from "react-bootstrap/Container";

function FooterComp(props) {
    const copyrightText = "© MealUp " + new Date().getFullYear().toString();
    return (
        <footer className="bottomFooter">
            <Container className="d-flex justify-content-center">{copyrightText}</Container>
        </footer>
    );
}

export default FooterComp;
