// Import React and useState hook to manage component state
import React, { useState } from 'react';
// Import Redirect component from react-router-dom to handle redirects
import { Link } from 'react-router-dom';
// Import Layout component for the page layout
import Layout from '../core/Layout';
// Import signin, authenticate, and isAuthenticated functions from the auth module
import { isAuthenticated } from "../auth";
import { createCategory } from "./apiAdmin";

const Category = () => {
    const [name, setName] = useState('');
    const [error, setError] =  useState(false);
    const [success, setSuccess] = useState(false);

    // Get the authenticated user data (if available) from local storage
    const { user, token } = isAuthenticated();

    //Handle form input change function
    const handleChange = (e) => {
        setError('')
        setName(e.target.value)
    }

    // click submit function
    const clickSubmit = e => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        // make request to api to create category
        createCategory(user._id, token, { name }).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError("");
                setSuccess(true);
            }
        });
    };

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
    );

    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">{name} is created</h3>;
        }
    };

    // error handling
    const showError = () => {
        if (error) {
            return <h3 className="text-danger">Category should be unique</h3>;
        }
    };

    // go back button function
    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout
            title="Category"
            description={`G'day ${user.name}, ready to add a new category?`}
        >
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryFom()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
}

export default Category;