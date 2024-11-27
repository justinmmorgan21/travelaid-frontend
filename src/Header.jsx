import { Avatar, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './assets/small logo.png';
export function Header({setShowHero, modalShow}) {

  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const loadUserData = () => {
    axios.get("http://localhost:3000/users/current.json").then(response=> {
      setCurrentUser(response.data);
    })
  }

  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  const handleLogin = () => {
    modalShow();
    setShowHero(true);
  }

  const handleSuggestedClick = () => {
    navigate("/suggested");
    setShowHero(false);
  }

  useEffect(loadUserData, []);

  return (
    <Navbar  rounded className="bg-gray-600 text-white fixed h-16 top-0 left-0 w-full z-[10000]">
      <Navbar.Brand href="/home" >
        <img src={Logo} className="mr-3 sm:h-9 w-48" alt="Flowbite React Logo" />
      </Navbar.Brand>
      <div className="flex md:order-2">
        { localStorage.jwt === undefined ?
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar size="md" alt="User settings" img={currentUser.image_url} rounded />
          }
        >
          <Dropdown.Item onClick={()=> {window.location.href = "/home"}}>Home</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>handleLogin()}>Sign in</Dropdown.Item>
        </Dropdown>
        :
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar size="md" alt="User settings" img={currentUser.image_url} rounded />
          }
        >
          <Dropdown.Header >
            <span className="block text-sm font-medium">{currentUser.name}</span>
            <span className="block truncate text-sm ">{currentUser.email}</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={()=> {window.location.href = "/home"}}>Home</Dropdown.Item>
          <Dropdown.Item> <Link to="/userSettings" state={{ currentUser }}>Settings</Link></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={()=>handleLogout()}>Sign out</Dropdown.Item>
        </Dropdown>
        }
        <Navbar.Toggle />
      </div>
      {
        localStorage.jwt === undefined ?
      <Navbar.Collapse className="pr-44" >
        <Navbar.Link onClick={()=>{setShowHero(true);}}  className="cursor-pointer hover:underline text-white text-lg font-light">
          Home
        </Navbar.Link>
        <Navbar.Link onClick={()=>{handleLogin()}} className="cursor-pointer hover:underline text-white text-lg font-light">
          <Tooltip content={`must be logged in to create New Trips`} placement="top" style="dark" className="py-2 px-4">
            New Trip
          </Tooltip>
        </Navbar.Link>
        <Navbar.Link onClick={()=>{handleSuggestedClick()}} className="cursor-pointer hover:underline text-white text-lg font-light">Suggested Trips
        </Navbar.Link>
        <Navbar.Link onClick={()=>{navigate("/contact");setShowHero(false);}} className="cursor-pointer hover:underline text-white text-lg font-light">Contact</Navbar.Link>
      </Navbar.Collapse>
      :
      <Navbar.Collapse className="pr-44" >
        <Navbar.Link href="/home"  className="custom-hover text-white text-lg font-light">
          Home
        </Navbar.Link>
        <Navbar.Link href="/trips" className="custom-hover text-white text-lg font-light">Upcoming Trips</Navbar.Link>
        <Navbar.Link href="/trips/new" className="custom-hover text-white text-lg font-light">New Trip</Navbar.Link>
        <Navbar.Link href="/suggested" className="custom-hover text-white text-lg font-light">Suggested Trips
        </Navbar.Link>
        <Navbar.Link href="/contact" className="custom-hover text-white text-lg font-light">Contact</Navbar.Link>
      </Navbar.Collapse>
      }
    </Navbar>
  );
}