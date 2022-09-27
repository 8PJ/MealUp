import { NavLink } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";

function RecipeDropdown(props) {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-dark" id="dropdown-basic" className="dropdownButton">
                Recipe Selection
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropDownItems">
                <Dropdown.Item as={NavLink} to="followed" className="dropdownItem">
                    Followed
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="created" className="dropdownItem">
                    Created
                </Dropdown.Item>
                <Dropdown.Item disabled as={NavLink} className="dropdownItem">
                    Discover New
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="createNew" className="dropdownItem">
                    Create New
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default RecipeDropdown;
