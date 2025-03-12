// Import React and useState hook to manage component state
import React, { useState } from 'react';
// Import Redirect component from react-router-dom to handle redirects
import { Redirect } from 'react-router-dom';
// Import Layout component for the page layout
import Layout from '../core/Layout';
// Import signin, authenticate, and isAuthenticated functions from the auth module
import { signin, authenticate, isAuthenticated } from "../auth";

// Functional component for the Signin page
const Signin = () => {
    // useState hook to manage form values and state variables (email, password, error, loading, redirectToReferrer)
    const [values, setValues] = useState({
        email: '',              
        password: '',           
        error: '',              
        loading: false,         
        redirectToReferrer: false
    });

    // Destructure the values for easy access in the component
    const { email, password, loading, error, redirectToReferrer } = values;
    // Get the authenticated user data (if available) from local storage
    const { user } = isAuthenticated();

    // Event handler for input changes
    // Takes the field name and updates the corresponding value in the state
    const handleChange = name => event => {
        // Spread the previous values and update the specified field
        // Also set error to false to clear any existing errors
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // Event handler for form submission
    const clickSubmit = event => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Set loading state to true and clear any previous errors
        setValues({ ...values, error: false, loading: true });
        // Call the signin function with email and password
        signin({ email, password }).then(data => {
            // If the API returns an error, update the error state and stop loading
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                // If signin is successful, authenticate the user and redirect
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true // Trigger redirect after successful signin
                    });
                });
            }
        });
    };

    // JSX for rendering the sign-in form
    const signInForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    // Function to display an error message if there is an error in the state
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // Function to display a loading message while submitting the form
    const showLoading = () => (
        loading && <div className='alert alert-info'>
            <h2>Loading...</h2>
        </div>
    );

    // Function to handle redirecting the user after a successful login
    const redirectUser = () => {
        // If redirectToReferrer is true, redirect based on user role
        if (redirectToReferrer) {
            if (user && user.role === 1) { // If the user is an admin
                return <Redirect to="/admin/dashboard" />; // Redirect to the admin dashboard
            } else {
                return <Redirect to="/user/dashboard" />; // Redirect to the user dashboard
            }
        }
        // If the user is already authenticated, redirect to the homepage
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    };

    return (
        <Layout
            title="Signin"
            description="Signin to Node React E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {/* Display loading message */}
            {showLoading()}
            {/* Display error message */}
            {showError()}
            {/* Display the sign-in form */}
            {signInForm()}
            {/* Handle redirect after signin */}
            {redirectUser()}
        </Layout>
    );
};

export default Signin;
