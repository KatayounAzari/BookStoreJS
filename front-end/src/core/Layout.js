import React from "react";

const Layout = ({
    title = "Title",
    description = "Description",
    className,
    children
}) => (
    <div>
        <div className="main-body reusable-banner">
            <h2 className="page-title">{title}</h2>
            <p className="page-description">{description}</p>
        </div>
        <div className={className}>{children}</div>
    </div>
);

export default Layout;