import Breadcrumb from "react-bootstrap/Breadcrumb";

function RecipeBreadcrumb(props) {
    return (
        <Breadcrumb>
            <Breadcrumb.Item active href="/myRecipes/followed" className="recipeBreadcrumbItem">
                Followed
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/myRecipes/created" className="recipeBreadcrumbItem">
                Created
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/myRecipes/discoverNew" className="recipeBreadcrumbItem">
                Discover New
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/myRecipes/createNew" className="recipeBreadcrumbItem">
                Create New
            </Breadcrumb.Item>
        </Breadcrumb>
    );
}

export default RecipeBreadcrumb;
