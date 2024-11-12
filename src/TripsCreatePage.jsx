import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Label, TextInput } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";

export function TripsCreatePage() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();
  
  const handleCreate = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    console.log(params);
    axios.post("http://localhost:3000/trips.json", params).then(response=> {
      console.log(response.data);
      navigate(`/trips/${response.data.id}`);
    });
  }

  const handleReset = () => {
    setTitle('');
    setDates({ 
      startDate: null, 
      endDate: null
    });
    setImageUrl('');
  };

  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  return (
    <div>
      <h1 className='text-xl'>New Trip</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleCreate(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Trip Title" />
          </div>
          <TextInput id="title" name="title" type="text" placeholder="title" shadow required value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className=' flex flex-row space-x-2'>
          <Datepicker 
              value={dates} 
              onChange={newValue => setDates(newValue)}
              />
          {/* <div>
            <Datepicker title="Arrive" name="start_time" />
          </div>
          <div>
            <Datepicker title="Depart" name="end_time" />
          </div> */}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image_url" value="URL of trip image" />
          </div>
          <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}/>
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>handleReset()}>Clear</Button>
        </div>
      </form>
    </div>
  );
}