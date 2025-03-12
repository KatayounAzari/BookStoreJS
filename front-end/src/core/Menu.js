// Import necessary React modules and components
import React, { Fragment } from "react";
// Import Link from react-router-dom for navigation between pages
import { Link, withRouter } from 'react-router-dom';
// Import the signout function from the auth module
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";
import Search from "./Search";

const isActive = (history, path) => {
    if (history.location.pathname === path){
        return {color: '#ff9900'};
    } else {
        return {color: '#ffffff'};
    }
};

const Menu = ({history}) => (
    <div className="flex">
        <ul className='nav nav-tabs bg-primary'>
            <li className="nav-item text-left">
                <Link
                    className="nav-link"
                    style={isActive(history, "/")}
                    to="/"
                >
                    Home
                </Link>
            </li>
            
            <li className="nav-item text-left">
                <Link
                    className="nav-link"
                    style={isActive(history, "/shop")}
                    to="/shop"
                >
                    Shop
                </Link>
            </li>
        </ul>

        <Search />

        <ul className='nav nav-tabs bg-primary'>
            <li className="nav-item text-right">
                <Link
                    className="nav-link"
                    style={isActive(history, "/cart")}
                    to="/cart"
                >
                    Cart{" "}
                    <sup>
                        <small className="cart-badge">{itemTotal()}</small>
                    </sup>
                </Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-ite text-right">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/user/dashboard")}
                        to="/user/dashboard"
                    >
                        Dashboard
                    </Link>
                </li>
            )}

            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                <li className="nav-item text-right">
                    <Link
                        className="nav-link"
                        style={isActive(history, "/admin/dashboard")}
                        to="/admin/dashboard"
                    >
                        Dashboard
                    </Link>
                </li>
            )}

            {!isAuthenticated() && (
                <Fragment>
                    <li className="nav-item text-right">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signin")}
                            to="/signin"
                        >
                            Signin
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signup")}
                            to="/signup"
                        >
                            Signup
                        </Link>
                    </li>
                </Fragment>
            )}
            
            {isAuthenticated() && (
                <li className="nav-item text-right">
                    <span
                        className="nav-link"
                        style={{ cursor: "pointer", color: "#ffffff" }}
                        onClick={() =>
                            signout(() => {
                                history.push("/");
                            })
                        }
                    >
                        Signout
                    </span>
                </li>
            )}
        </ul>
    </div>
);

export default withRouter(Menu);