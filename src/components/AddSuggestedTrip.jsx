import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Label, TextInput } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";

export function AddSuggestedTrip({onClose, trip}) {
  console.log("TRIP: ", trip);
  const [title, setTitle] = useState(trip.title);
  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  const navigate = useNavigate();
  
  const handleCreateTripWithPlaces = async (event) => {
    event.preventDefault();
    let params = null;
    if (event.type == "submit") {
      params = new FormData(event.target);
    } else {
      params = new FormData();
      params.append('title', title);
    } 
    params.append('image_url', trip.image_url);
    params.append('start_time', dates.startDate);
    params.append('end_time', dates.endDate);

    try {
      const tripResponse = await axios.post("http://localhost:3000/trips.json", params);
      console.log("TRIP:", tripResponse.data);
      // Trip has been created with
      // id - generated through creation
      // user_id - added by create action in backend
      // title - through event
      // image_url - appended
      // dates - appended
      // does not have the places yet
      // map through trip.places and create a new Place
      // for each one with a trip id to match the one
      // just created
      const tripId = tripResponse.data.id;
      // Use Promise.all to wait for all places to be created
      const placeCreationPromises = trip.places.map(place => {
        const placeParams = new FormData();
        placeParams.append("trip_id", tripId);
        placeParams.append("address", place.address);
        placeParams.append("lat", place.lat);
        placeParams.append("lng", place.lng);
        placeParams.append("name", place.name);
        placeParams.append("description", place.description);
        placeParams.append("image_url", place.image_url);
  
        return axios.post("http://localhost:3000/places.json", placeParams).then(placeResponse => {
          console.log("PLACE:", placeResponse.data);
        });
      });
  
      await Promise.all(placeCreationPromises);
  
      onClose();
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error("Error creating trip or places:", error);
    }
  }

  const handleSkip = (event) => {
    setTitle(trip.title);
    setDates({ 
      startDate: null, 
      endDate: null
    });
    handleCreateTripWithPlaces(event);
  }

  return (
    <div>
      <h1 className='text-xl'>Customize Your New Trip</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleCreateTripWithPlaces(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Trip Title" />
          </div>
          <TextInput id="title" name="title" type="text" placeholder={trip.title} shadow required value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div >
          <div className="mb-2 block">
            <Label htmlFor="title" value="Possible Dates" />
          </div>
          <Datepicker 
            value={dates} 
            onChange={newValue => setDates(newValue)}
            placeholderText="Select possible dates"
          />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white" type="submit">Submit</Button>
          <p onClick={(event) => handleSkip(event)} className='p-2 pl-4 underline cursor-pointer'>skip customization</p>
        </div>
      </form>
    </div>
  );
}