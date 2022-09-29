import { NavLink } from "react-router-dom";

import Breadcrumb from "react-bootstrap/Breadcrumb";

function RecipeBreadcrumb(props) {
    return (
        <Breadcrumb>
            <Breadcrumb.Item
                linkAs={NavLink}
                linkProps={{ className: "breadCrumbLink", to: "followed" }}
            >
                Followed
            </Breadcrumb.Item>
            <Breadcrumb.Item
                linkAs={NavLink}
                linkProps={{ className: "breadCrumbLink", to: "created" }}
            >
                Created
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={NavLink} linkProps={{ className: "breadCrumbLink disabled" }}>
                Discover New
            </Breadcrumb.Item>
            <Breadcrumb.Item
                linkAs={NavLink}
                linkProps={{ className: "breadCrumbLink", to: "createNew" }}
            >
                Create New
            </Breadcrumb.Item>
        </Breadcrumb>
    );
}

export default RecipeBreadcrumb;
