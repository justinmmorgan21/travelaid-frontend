import { Link } from "react-router-dom";
import { LogoutLink } from "./LogoutLink";
import { useState, useEffect } from 'react';
import axios from 'axios';
export function Header() {

  // FROM blog-frontend
  const [currentUser, setCurrentUser] = useState({});

  const loadUserData = () => {
    axios.get("http://localhost:3000/users/current.json").then(response=> {
      console.log(response.data);
      setCurrentUser(response.data);
    })
  }

  useEffect(loadUserData, []);

  let authLinks;
  let welcomeMessage;
  if (localStorage.jwt === undefined) {
    console.log("logged out")
    authLinks = (
      <>
      <li>
        <Link to="signup">Sign up</Link>
      </li>
      <li>
        <Link to="login">Log in</Link>
      </li>
      </>
    )
    welcomeMessage = <></>
  } else {
    console.log("logged in")
    authLinks = (
                <li>
                  <LogoutLink />
                </li>
    )
    welcomeMessage = (
      <>
      Welcome, {currentUser.name}
      </>
    )
  }

  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | <Link to="/trips">My Trips</Link> | <Link to="/signup">Signup</Link> | <Link to="Login">Login</Link> | <LogoutLink />
        {/* {authLinks} */}
        {welcomeMessage}
        <img id="user-image" src={currentUser.image_url} alt="" />
      </nav>
    </header>
  )
}