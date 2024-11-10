import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function UserSettings() {
  
  const { state } = useLocation();
  const currentUser = state?.currentUser;
  console.log("SETTINGS USER", currentUser)

  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState({});
  
  const handleChange = e => {
    e.persist();
    setImage(e.target.files[0]);
    console.log("IMAGE", image);
  };

  const handleSubmit = (event) => {
    console.log("UPDATE");
    console.log(event.target);
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    params.append('image', image);
    axios.patch(`http://localhost:3000/users/${currentUser.id}.json`, params)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/dashboard"; // Change this to hide a modal, redirect to a specific page, etc.
      })
      .catch((error) => {
        console.log("ERRORS", error.response.data.errors);
        setErrors(error.response.data.errors);
      });
  };

  return (
    <div id="signup">
      <h1>Signup</h1>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" defaultValue={currentUser.name}/>
        </div>
        <div>
          Email: <input name="email" type="email" defaultValue={currentUser.email} />
        </div>
        {/* <div>
          Password: <input name="password" type="password" />
        </div>
        <div>
          Password confirmation: <input name="password_confirmation" type="password" />
        </div> */}
        <div>
          Image upload: <input type="file" name="image" onChange={handleChange} />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}