// Function to add an item to the cart and update localStorage
export const addItem = (item = [], count = 0, next = f => f) => {
    // Initialize an empty array for the cart
    let cart = [];
    
    // Check if the code is running in a browser environment (window object is defined)
    if (typeof window !== 'undefined') {
        // Check if there's an existing 'cart' in localStorage
        if (localStorage.getItem('cart')) {
            // Parse the cart from localStorage if it exists
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        
        // Add the new item to the cart, with a default count of 1
        cart.push({
            ...item, // Spread the properties of the item object
            count: 1 // Add a count property to the item
        });

        // Ensure each product in the cart is unique by _id
        cart = Array.from(new Set(cart.map(p => p._id))) // Get unique _id's from the cart
            .map(id => {
                // Find and return the product corresponding to each unique _id
                return cart.find(p => p._id === id);
            });

        // Update the cart in localStorage with the modified array
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Call the next function (callback), if provided
        next();
    }
};

// Function to get the total number of items in the cart
export const itemTotal = () => {
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Check if the 'cart' exists in localStorage
        if (localStorage.getItem('cart')) {
            // Return the length (number of items) of the cart array
            return JSON.parse(localStorage.getItem('cart')).length;
        }
    }
    // Return 0 if there's no cart in localStorage
    return 0;
};

// Function to get all items from the cart
export const getCart = () => {
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Check if the 'cart' exists in localStorage
        if (localStorage.getItem('cart')) {
            // Return the parsed cart array from localStorage
            return JSON.parse(localStorage.getItem('cart'));
        }
    }
    // Return an empty array if there's no cart
    return [];
};

// Function to update the quantity of an item in the cart
export const updateItem = (productId, count) => {
    // Initialize an empty cart array
    let cart = [];
    
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Check if the 'cart' exists in localStorage
        if (localStorage.getItem('cart')) {
            // Parse the cart from localStorage
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Iterate over the cart to find the product to update
        cart.map((product, i) => {
            // Check if the current product's _id matches the productId to update
            if (product._id === productId) {
                // Update the count of the product with the new count value
                cart[i].count = count;
            }
        });

        // Update the modified cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

// Function to remove an item from the cart
export const removeItem = productId => {
    // Initialize an empty cart array
    let cart = [];
    
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Check if the 'cart' exists in localStorage
        if (localStorage.getItem('cart')) {
            // Parse the cart from localStorage
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Iterate over the cart to find and remove the product with the matching productId
        cart.map((product, i) => {
            if (product._id === productId) {
                // Remove the product from the cart using splice
                cart.splice(i, 1);
            }
        });

        // Update the modified cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    // Return the updated cart array
    return cart;
};

// Function to empty the entire cart
export const emptyCart = next => {
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
        // Remove the 'cart' from localStorage
        localStorage.removeItem('cart');
        
        // Call the next function (callback), if provided
        next();
    }
};
