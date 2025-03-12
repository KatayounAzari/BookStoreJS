// Import necessary React modules and components
import React, { useState } from 'react';
// Import Link from react-router-dom for navigation between pages
import { Link } from 'react-router-dom';
// Import Layout component for the page layout
import Layout from '../core/Layout';
// Import the signup function from the auth module
import { signup } from '../auth';

// Functional component for the Signup page
const Signup = () => {
    // useState hook to manage form values and state (name, email, password, error, and success status)
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    // Destructure the state values for easy access
    const { name, email, password, success, error } = values;

    // Event handler for input changes
    // Updates the corresponding value (name, email, or password) in the state
    const handleChange = name => event => {
        // Spread previous values and update the field being modified
        // Set error to false to clear any existing error messages
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // Event handler for form submission
    const clickSubmit = event => {
        event.preventDefault(); // Prevent the default form submission behavior
        setValues({ ...values, error: false }); // Clear previous error messages
        // Call the signup function with name, email, and password
        signup({ name, email, password }).then(data => {
            // If the API returns an error, update the error state
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                // On successful signup, clear the input fields and set success to true
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '', 
                    success: true 
                });
            }
        });
    };

    // JSX for rendering the sign-up form
    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange={handleChange('name')}
                    type="text" 
                    className="form-control"
                    value={name}
                />
            </div>

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
                    minlength="7" 
                    pattern="^(?=.*[a-zA-Z])(?=.*\d).+$" 
                />
            </div>

            {/* Submit button */}
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    // Function to display an error message if there's an error in the state
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error} {/* Display the error message */}
        </div>
    );

    // Function to display a success message if the signup was successful
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );

    // Return the component layout and render the different elements
    return (
        <Layout
            title="Signup"
            description="Signup to Node React E-commerce App"
            className="container col-md-8 offset-md-2"
        >
            {/* Display success message if signup was successful */}
            {showSuccess()}
            {/* Display error message if there's an error */}
            {showError()}
            {/* Display the sign-up form */}
            {signUpForm()}
        </Layout>
    );
};

export default Signup;
