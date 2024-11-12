import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { Button, Label, TextInput, FileInput, Avatar } from "flowbite-react";

export default function UserSettings() {
  
  const { state } = useLocation();
  const currentUser = state?.currentUser;
  console.log("SETTINGS USER", currentUser)

  const [image, setImage] = useState({});
  
  const handleChange = e => {
    e.persist();
    setImage(e.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    const isFileSelected = image instanceof File;
    params.append('image', isFileSelected ? image : "no-image");
    axios.patch(`http://localhost:3000/users/${currentUser.id}.json`, params)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
        window.location.href = "/dashboard";
      })
  };

  return (
    <div>
      <h1 className='text-xl'>Profile Settings</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleSubmit(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Your Name" />
          </div>
          <TextInput id="name" name="name" type="text" defaultValue={currentUser.name} shadow />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your Email" />
          </div>
          <TextInput id="email" name="email" type="email" icon={HiMail} defaultValue={currentUser.email} shadow />
        </div>
        <div>
          <Label htmlFor="" value="Current Image" />
          <Avatar className="" alt="User settings" img={currentUser.image_url} rounded />
        </div>
        <div id="fileUpload" className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Upload new image file" />
          </div>
          <FileInput name="image" id="file" helperText="A profile picture is useful to confirm your are logged into your account" onChange={handleChange}/>
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-500 px-4 py-1 rounded text-white my-12" type="submit">Submit</Button>
        </div>
      </form>
    </div>    
  );
}