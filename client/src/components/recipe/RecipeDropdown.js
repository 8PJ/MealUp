import Dropdown from "react-bootstrap/Dropdown";

function RecipeDropdown(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic" className="dropdownButton">
                Recipe Selection
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropDownItems">
                <Dropdown.Item active disabled className="dropdownItem" href="/myRecipes/followed">Followed</Dropdown.Item>
                <Dropdown.Item className="dropdownItem" href="/myRecipes/created">Created</Dropdown.Item>
                <Dropdown.Item className="dropdownItem" href="/myRecipes/discoverNew">Discover New</Dropdown.Item>
                <Dropdown.Item className="dropdownItem" href="/myRecipes/createNew">Create New</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default RecipeDropdown;
