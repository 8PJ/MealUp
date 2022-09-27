import { NavLink } from "react-router-dom";

import Breadcrumb from "react-bootstrap/Breadcrumb";

function RecipeBreadcrumb(props) {
    return (
        <Breadcrumb>
            <Breadcrumb.Item>
                <NavLink replace className="breadCrumbLink" to="followed">
                    Followed
                </NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <NavLink replace className="breadCrumbLink" to="created">
                    Created
                </NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <NavLink replace className="breadCrumbLink disabled">
                    Discover New
                </NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <NavLink replace className="breadCrumbLink" to="createNew">
                    Create New
                </NavLink>
            </Breadcrumb.Item>
        </Breadcrumb>
    );
}

export default RecipeBreadcrumb;
