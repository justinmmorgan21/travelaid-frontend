import Datepicker from "react-tailwindcss-datepicker";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function FlightHotelSearch() {
  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  const navigate = useNavigate();
  
  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    const engine = "google_flights";
    const departure_id = formObject.departure;
    const arrival_id = formObject.destination;
    const outbound_date = new Date(dates.startDate).toISOString().split('T')[0];
    const return_date = new Date(dates.endDate).toISOString().split('T')[0];
    console.log("DEP: ", departure_id);
    console.log("ARR: ", arrival_id);
    console.log("OUT: ", outbound_date);
    console.log("RET: ", return_date);
    fetch(`http://localhost:3001/?engine=${engine}&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&return_date=${return_date}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      navigate("/flights", { state: data });
    });
  }


  return (
    <div className="border-2 border-white pt-1 px-2 bg-white rounded-lg">
      Check Flights
      <form className="flex max-w-4xl flex-row gap-4 mt-1" onSubmit={event => handleSearch(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="departure" value="Departure" />
          </div>
          <TextInput id="departure" name="departure" type="text" placeholder="Where from?" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="destination" value="Destination" />
          </div>
          <TextInput id="destination" name="destination" type="text" placeholder="Where to?" required />
        </div>
        <div className="w-72">
          <div className="mb-2 block">
            <Label htmlFor="dates" value="Dates" />
          </div>
          <Datepicker 
              value={dates} 
              onChange={newValue => setDates(newValue)}
              /> 
        </div>
        <Button className="bg-blue-500 text-white mt-8 h-11 border-2 rounded-md'" type="submit">Search</Button>
      </form>
    </div>
  )
}