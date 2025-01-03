import axios from "axios";
import { useState } from "react";
import apiConfig from '../apiConfig';

export default function SignUp({ className , setSwitchAuth }) {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios.post(`${apiConfig.backendBaseUrl}/users.json`, params).then(() => {
      axios.post(`${apiConfig.backendBaseUrl}/sessions.json`, params).then((resp) => {
        // after sign up, continue with sign in
        axios.defaults.headers.common["Authorization"] = "Bearer " + resp.data.jwt;
        localStorage.setItem("jwt", resp.data.jwt);
        event.target.reset();
        window.location.href = "/trips/new";
      })
    }).catch((error) => {
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