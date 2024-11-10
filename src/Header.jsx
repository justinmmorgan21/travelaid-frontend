
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { LogoutLink } from "./LogoutLink";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import ReactLogo from './assets/logo.svg';
export function Header() {

  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const loadUserData = () => {
    axios.get("http://localhost:3000/users/current.json").then(response=> {
      console.log("LOADED", response.data);
      setCurrentUser(response.data);
    })
  }

  const handleLogout = () => {
    console.log("LOGOUT")
    // event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  useEffect(loadUserData, []);

  // let authLinks;
  // let welcomeMessage;
  // if (localStorage.jwt === undefined) {
  //   console.log("logged out")
  //   authLinks = (
  //     <>
  //       <Link to="signup">Sign up</Link> | <Link to="login">Log in</Link>
  //     </>
  //   )
  //   welcomeMessage = <></>
  // } else {
  //   console.log("logged in")
  //   authLinks = ( <LogoutLink /> )
  //   welcomeMessage = (
  //     <>
  //     Welcome, {currentUser.name}
  //     </>
  //   )
  // }

  console.log("HEADER USER", currentUser)

  return (
    <Navbar fluid rounded className="bg-slate-600 text-white">
      <Navbar.Brand href="https://flowbite-react.com">
        <img src={ReactLogo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Travel Aid</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={currentUser.image_url} rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.name}</span>
            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={()=> {window.location.href = "/dashboard"}}>Dashboard</Dropdown.Item>
          <Dropdown.Item>
            <Link to="/userSettings" state={{ currentUser }}>Settings</Link>
          </Dropdown.Item>
          <Dropdown.Item>Leave Feedback</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>handleLogout()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse >
        <Navbar.Link href="/home"  className="custom-hover text-white">
          Home
        </Navbar.Link>
        <Navbar.Link href="/about" className="custom-hover text-white">About</Navbar.Link>
        <Navbar.Link href="/trips" className="custom-hover text-white">Upcoming Trips</Navbar.Link>
        <Navbar.Link href="/trips/new" className="custom-hover text-white">New Trip</Navbar.Link>
        <Navbar.Link href="#" className="custom-hover text-white">Past Trips/Trip History</Navbar.Link>
        <Navbar.Link href="#" className="custom-hover text-white">Suggested Trips
        </Navbar.Link>
        <Navbar.Link href="#" className="custom-hover text-white">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
      // {/* <nav>
      //   <Link to="/">Home</Link> | <Link to="/trips">My Trips</Link> |  */}
      //   {/* <Link to="/signup">Signup</Link> | <Link to="Login">Login</Link> | <LogoutLink /> */}
      //   {/* {authLinks}
      //   {welcomeMessage}
      //   <img id="user-image" src={currentUser.image_url} alt="" />
      // </nav> */}
  );
}