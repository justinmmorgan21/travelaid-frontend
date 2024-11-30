import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Textarea, Label, TextInput, Datepicker } from "flowbite-react";
import { AiFillEnvironment } from "react-icons/ai";

export function PlacesCreate({onClose, trip}) {
  const [selectedDate, setSelectedDate] = useState(new Date(trip.start_time));
  
  const navigate = useNavigate();

  const handleCreate = (event, trip_id) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.append('trip_id', trip_id);
    axios.post("http://localhost:3000/places.json", params).then(()=> {
      onClose();
      navigate(`/trips/${trip_id}`);
    });
  }

  return (
    <div className='w-full'>
      <h1 className='text-xl'>New Point of Interest</h1>
      <hr className='my-4'/> 
      <form className="flex flex-col gap-4 items-center w-full" onSubmit={(event) => handleCreate(event, trip.id)}>
        <div className='mx-auto'>
        <div>
          <div className="mb-2 block w-80">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput id="name" name="name" type="text" placeholder="name" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="Address" />
          </div>
          <TextInput icon={AiFillEnvironment} id="address" name="address" type="text" placeholder="address" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="start_time" value="Date" />
          </div>
          <div >
            <Datepicker id="date-picker" title="Date" name="start_time" value={selectedDate} onChange={(date) => setSelectedDate(date)} datepicker-buttons="true"/>
          </div>
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description of this place" />
          </div>
          <Textarea id="description" name="description" placeholder="description..." shadow required rows={2} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image_url" value="URL of place image" />
          </div>
          <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow required />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>onClose()}>Cancel</Button>
        </div>
        </div>
      </form>
    </div>
  );
}