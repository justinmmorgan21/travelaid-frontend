import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Label, Datepicker } from "flowbite-react";
export function PlacesUpdate({onClose, place, trip}) {
  const [selectedDate, setSelectedDate] = useState(place.start_time ? new Date(place.start_time) : trip.start_time ? new Date(trip.start_time) : new Date() );
  
  const navigate = useNavigate();

  const handleUpdate = (date) => {
    const params = new FormData();
    setSelectedDate(date);
    params.append('start_time', date);
    axios.patch(`http://localhost:3000/places/${place.id}.json`, params).then(()=> {
      onClose();
      navigate(`/trips/${trip.id}`);
    });
  }

  return (
    <div >
      <h1 className='text-xl'>Update Trip</h1>
      <hr className='my-4'/>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Date" />
        </div>
        <Datepicker id="date-picker" title="Date" name="start_time" value={selectedDate} onChange={(date) => handleUpdate(date)} datepicker-buttons="true"/>
      </div>
    </div>
  );
}