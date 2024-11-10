import axios from "axios";
import { useState } from "react";

export default function SignUp({ className , setSwitchAuth }) {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    // params.append('image', image);
    axios.post("http://localhost:3000/users.json", params)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/trips"; // Change this to hide a modal, redirect to a specific page, etc.
      })
      .catch((error) => {
        console.log("ERRORS", error.response.data.errors);
        setErrors(error.response.data.errors);
      });
  };

  return (
    <div className={className}>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-5">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" placeholder="name" className="border-2 py-3 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="example@gmail.com" className="border-2 py-3 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="password" className="border-2 py-3 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input type="password" name="password_confirmation" placeholder="password" className="border-2 py-3 px-2 rounded-md focus-outline-none"/>
        <button type="submit" className="w-full bg-green-500 py-3 rounded-md text-white text-lg mb-10">
          Sign Up
        </button>
      </form>
      <p className="text-center mb-0">Already have an account?{ " "}
        <span className="text-blue-500 cursor-pointer" onClick={()=>setSwitchAuth(value => !value)}>
          Sign In
        </span>
      </p>
    </div>
  )
}