
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactLogo from './assets/logo.svg';
export function Header() {

  const [currentUser, setCurrentUser] = useState({});

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

  console.log("HEADER USER", currentUser)

  return (
    <Navbar fluid rounded className="bg-my-blue text-white fixed top-0 left-0 w-full z-50">
      <Navbar.Brand href="/home">
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
            <span className="block text-sm font-medium">{currentUser.name}</span>
            <span className="block truncate text-sm ">{currentUser.email}</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={()=> {window.location.href = "/dashboard"}}>?????</Dropdown.Item>
          <Dropdown.Item>
            <Link to="/userSettings" state={{ currentUser }}>Settings</Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>handleLogout()}>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse >
        <Navbar.Link href="/home"  className="custom-hover text-white">
          Home
        </Navbar.Link>
        <Navbar.Link href="/trips" className="custom-hover text-white">Upcoming Trips</Navbar.Link>
        <Navbar.Link href="/trips/new" className="custom-hover text-white">New Trip</Navbar.Link>
        <Navbar.Link href="#" className="custom-hover text-white">Suggested Trips
        </Navbar.Link>
        <Navbar.Link href="#" className="custom-hover text-white">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}