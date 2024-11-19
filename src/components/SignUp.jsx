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
        console.log("SIGN UP", response.data);
        axios.post("http://localhost:3000/sessions.json", params).then((resp) => {
          console.log("AFTER SIGN UP, SIGN IN", resp.data);
          axios.defaults.headers.common["Authorization"] = "Bearer " + resp.data.jwt;
          localStorage.setItem("jwt", resp.data.jwt);
          event.target.reset();
          window.location.href = "/trips/new";
        })
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
        <input type="text" name="name" placeholder="name" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="example@gmail.com" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="password" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input type="password" name="password_confirmation" placeholder="password" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <button type="submit" className="w-full bg-green-500 py-2 rounded-md text-white text-lg mb-10">
          Sign Up
        </button>
      </form>
      <p className="text-center mb-0">Already have an account?{ " "}
        <span className="text-blue-600 cursor-pointer" onClick={()=>setSwitchAuth(value => !value)}>
          Sign In
        </span>
      </p>
    </div>
  )
}