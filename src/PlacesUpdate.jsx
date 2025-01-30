import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label, Datepicker } from "flowbite-react";
import apiConfig from './apiConfig';

export function PlacesUpdate({onClose, place, trip}) {
  const [selectedDate, setSelectedDate] = useState(place.start_time ? new Date(place.start_time) : trip.start_time ? new Date(trip.start_time) : new Date() );
  
  const navigate = useNavigate();

  const handleUpdate = (date) => {
    const params = new FormData();
    setSelectedDate(date);
    params.append('start_time', date);
    axios.patch(`${apiConfig.backendBaseUrl}/places/${place.id}.json`, params).then(()=> {
      onClose();
      navigate(`/trips/${trip.id}`);
    });
  }

  return (
    <div>
      <h1 className='text-xl'>Update Date</h1>
      <hr className='my-4'/>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Date" />
        </div>
        <Datepicker id="date-picker" title="Date" name="start_time" value={selectedDate} onChange={(date) => handleUpdate(date)} datepicker-buttons="true"/>
      </div>
      <div className='width-100% flex flex-row-reverse mt-2'>
        <button className="bg-blue-700 px-4 h-8 mt-2 rounded text-white" onClick={()=>onClose()}>Cancel</button>
      </div>
    </div>
  );
}