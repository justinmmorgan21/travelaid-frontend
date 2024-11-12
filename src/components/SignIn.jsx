import axios from "axios";
import { useState } from "react";

const jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export default function SignIn({ className , setSwitchAuth}) {

  const [errors, setErrors] = useState([]);
  // const navigate = useNavigate;
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post("http://localhost:3000/sessions.json", params)
      .then((response) => {
        console.log(response.data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        event.target.reset();
        window.location.href = "/trips"; // Change this to hide a modal, redirect to a specific page, etc.
        // axios.get("http://localhost:3000/trips.json").then(resp => {
        //   if (resp.data.)
        // })
      })
      .catch((error) => {
        console.log(error.response);
        setErrors(["Invalid email or password"]);
      });
  };



  return (
    <div className={ className }>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="example@gmail.com" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="password" required className="border-2 py-2 px-2 rounded-md focus-outline-none"/>
        <button type="submit" className="w-full bg-green-500 py-2 text-md rounded-md text-white mb-10">
          Sign In
        </button>
      </form>
      <p className="text-center mb-0">Don&apos;t have an account yet?{ " "}
        <span className="text-blue-500 cursor-pointer" onClick={()=>setSwitchAuth(value => !value)}>
          Sign Up
        </span>
      </p>
    </div>
  )
}