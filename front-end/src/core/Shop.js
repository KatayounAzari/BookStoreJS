import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
// Functions to fetch categories and products from API
import { getCategories, getFilteredProducts } from "./apiCore";
// Component for price filtering using radio buttons
import RadioBox from "./RadioBox";
// Array of price ranges for filtering
import { prices } from "./fixedPrices";
// Component for filtering by categories using checkboxes
import Checkbox from "./Checkbox";

// The main functional component for the shop page
const Shop = () => {
    // Setting up state variables using useState hook
    const [myFilters, setMyFilters] = useState({
        // State to hold selected filters (categories and price range)
        filters: { category: [], price: [] }
    });
    // State to store fetched categories
    const [categories, setCategories] = useState([]);
    // State to handle any errors
    const [error, setError] = useState(false);
    // Number of products to load per request (pagination)
    const [limit, setLimit] = useState(6);
    // Number of products to skip (used for pagination)
    const [skip, setSkip] = useState(0);
    // Total number of products returned by the API
    const [size, setSize] = useState(0);
    // State to hold filtered products
    const [filteredResults, setFilteredResults] = useState([]);

    // Function to fetch categories from the API and set them in the state
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                // If there's an error, update error state
                setError(data.error);
            } else {
                // Set categories if fetched successfully
                setCategories(data);
            }
        });
    };

    // Function to fetch filtered products based on selected filters
    const loadFilteredResults = newFilters => {
         // Fetch products with skip and limit for pagination and filters for category/price
        getFilteredProducts(skip, limit, newFilters).then(data => {
            if (data.error) {
                // Handle error if API call fails
                setError(data.error);
            } else {
                // Set the filtered products in the state
                setFilteredResults(data.data);
                 // Update the total number of results
                setSize(data.size);
                // Reset the skip count after loading new filters
                setSkip(0);
            }
        });
    };

    // Function to load more products (for "Load more" button)
    const loadMore = () => {
        // Increment skip by limit to fetch the next set of products
        let toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
            if (data.error) {
                 // Handle error if API call fails
                setError(data.error);
            } else {
                // Append new products to existing results
                setFilteredResults([...filteredResults, ...data.data]);
                // Update total product count
                setSize(data.size);
                // Update skip to reflect the new pagination state
                setSkip(toSkip);
            }
        });
    };

        // Function to render "Load more" button if there are more products to display
    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

        // useEffect to initialize data and load initial products when the component mounts
    useEffect(() => {
        init(); // Fetch categories
        // Load initial products
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []); // Empty dependency array means this runs once on component mount

    // Function to handle filter changes (category or price)
    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

        // Helper function to convert selected price option into actual price range
    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    return (
        <Layout
            title="Shop Page"
            description="Search and find books of your choice"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        {/* Category Filter*/}
                        <Checkbox
                            categories={categories}
                            handleFilters={filters =>
                                handleFilters(filters, "category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={filters =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, i) => (
                            <div key={i} className="col-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;