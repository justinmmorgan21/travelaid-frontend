import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Label, TextInput } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";

export function UpdateTrip({onClose, trip}) {
  const [title, setTitle] = useState(trip.title);
  const [dates, setDates] = useState({ 
    startDate: new Date(trip.start_time), 
    endDate: new Date(trip.end_time)
  });
  const [imageUrl, setImageUrl] = useState(trip.image_url);

  const navigate = useNavigate();
  
  const handleUpdateTrip = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.append('start_time', dates.startDate);
    params.append('end_time', dates.endDate);
    axios.patch(`http://localhost:3000/trips/${trip.id}.json`, params).then(response=> {
      onClose();
      navigate(`/trips/${response.data.id}`);
    });
  }

  return (
    <div>
      <h1 className='text-xl'>Update Trip</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleUpdateTrip(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Trip Title" />
          </div>
          <TextInput id="title" name="title" type="text" placeholder={trip.title} shadow required value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div >
          <div className="mb-2 block">
            <Label htmlFor="title" value="Dates" />
          </div>
          <Datepicker 
            displayFormat="MM/DD/YYYY"
            value={dates} 
            onChange={newValue => setDates(newValue)}
            placeholderText="Select possible dates"
          />
        </div>
        <div>
            <div className="mb-2 block">
              <Label htmlFor="image_url" value="URL of trip image" className='text-black'/>
            </div>
            <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}/>
          </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white" type="submit">Submit</Button>
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white" onClick={()=>onClose()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}