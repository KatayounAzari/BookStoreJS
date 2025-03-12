// Import the API endpoint from the configuration file
import { API } from '../config';

// Function to handle user signup
export const signup = user => {
    // Sends a POST request to the API's signup endpoint with the user data
    return fetch(`${API}/signup`, {
        method: 'POST', // Specify the HTTP method as POST
        headers: {
            Accept: 'application/json', // Expect JSON as a response
            'Content-Type': 'application/json' // Sending JSON in the request body
        },
        body: JSON.stringify(user) // Convert the user object into a JSON string
    })
        // Handle the response, converting it to JSON
        .then(response => {
            return response.json();
        })
        // Catch any errors that occur during the fetch
        .catch(err => {
            console.log(err); // Log the error to the console
        });
};

// Function to handle user signin
export const signin = user => {
    // Sends a POST request to the API's signin endpoint with the user credentials
    return fetch(`${API}/signin`, {
        method: 'POST', // Specify the HTTP method as POST
        headers: {
            Accept: 'application/json', // Expect JSON as a response
            'Content-Type': 'application/json' // Sending JSON in the request body
        },
        body: JSON.stringify(user) // Convert the user object into a JSON string
    })
        // Handle the response, converting it to JSON
        .then(response => {
            return response.json();
        })
        // Catch any errors that occur during the fetch
        .catch(err => {
            console.log(err); // Log the error to the console
        });
};

// Function to store JWT token in local storage after authentication
export const authenticate = (data, next) => {
    // Check if the browser's window object is available (ensures this code is running in the browser)
    if (typeof window !== 'undefined') {
        // Store the JWT token in localStorage as a string
        localStorage.setItem('jwt', JSON.stringify(data));
        // Proceed to the next step or callback
        next();
    }
};

// Function to sign out the user
export const signout = next => {
    // Check if the browser's window object is available
    if (typeof window !== 'undefined') {
        // Remove the JWT token from localStorage
        localStorage.removeItem('jwt');
        // Proceed to the next step or callback
        next();
        // Send a GET request to the API's signout endpoint
        return fetch(`${API}/signout`, {
            method: 'GET' // Specify the HTTP method as GET
        })
            // Log the signout response to the console
            .then(response => {
                console.log('signout', response);
            })
            // Catch any errors during the fetch request
            .catch(err => console.log(err));
    }
};

// Function to check if a user is authenticated
export const isAuthenticated = () => {
    // If the code is running on the server (not in the browser), return false
    if (typeof window == 'undefined') {
        return false;
    }
    // Check if there is a JWT token stored in localStorage
    if (localStorage.getItem('jwt')) {
        // If JWT is found, parse and return it as an object
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        // If no JWT is found, return false (user is not authenticated)
        return false;
    }
};