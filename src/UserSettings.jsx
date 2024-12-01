import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { Button, Label, TextInput, FileInput, Avatar } from "flowbite-react";

export default function UserSettings() {
  const { state } = useLocation();
  const currentUser = state?.currentUser;
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
      .then(() => {
        event.target.reset();
        window.location.href = "/";
      })
  };

  return (
    <div>
      <h1 className='text-4xl text-white'>Profile Settings</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleSubmit(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Your Name" className="text-white"/>
          </div>
          <TextInput id="name" name="name" type="text" defaultValue={currentUser.name} shadow />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your Email" className="text-white"/>
          </div>
          <TextInput id="email" name="email" type="email" icon={HiMail} defaultValue={currentUser.email} shadow />
        </div>
        <div>
          <Label htmlFor="" value="Current Image" className="text-white"/>
          <Avatar size="xl" alt="User settings" img={currentUser.image_url} rounded />
        </div>
        <div id="fileUpload" className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Upload new image file" className="text-white"/>
          </div>
          <div className="text-white">

          <FileInput name="image" id="file"  onChange={handleChange}/>
          </div>
        </div>
        <div className=' flex flex-row space-x-3'>
          <Button className="bg-blue-700 px-3  rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
          <Button className="bg-blue-700 px-3  rounded-md text-white my-12 w-1/2" onClick={()=>window.location.href = "/home"}>Cancel</Button>
        </div>
      </form>
    </div>    
  );
}