import FlightHotelSearch from "./components/FlightHotelSearch"
import { useLoaderData, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios';
import { MdFmdGood } from "react-icons/md";
export default function Home() {
  const navigate = useNavigate();

  const nextTrip = useLoaderData();  
  console.log("NEXT", nextTrip);
  const nextImage = nextTrip ? nextTrip.image_url : "";
  const nextTitle = nextTrip ? nextTrip.title : "";
  const nextDate = nextTrip ? nextTrip.start_time : "";
  
  const [ suggestedTrips, setSuggestedTrips ] = useState([]);
  const handleSuggestedTrips = () => {
    axios.get("http://localhost:3000/trips/suggested.json").then(response => {
      setSuggestedTrips(response.data);
    })
  }

  useEffect(handleSuggestedTrips, []);

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 rounded-lg p-4 border-gray-400 shadow-lg" >
        <FlightHotelSearch />
      </div>
      <div id="next-trip" className="h-44 my-12 border-2 border-gray-400 rounded-lg p-4 shadow-md" onClick={()=>{navigate(`/trips/${nextTrip.id}`);}}>
        <h1 className="text-3xl">Next Trip</h1>
        <div className="flex flex-row">
          <img src={nextImage} alt="" className="h-24"/>
          <div className="ml-10">
            <p>{nextTitle}</p>
            <p>{nextDate}</p>
          </div>
        </div>
      </div>
      <div className="h-72 w-full border-2 border-gray-400 rounded-lg p-4 shadow-md">
        <p className="text-3xl pb-2">Suggested Trips</p>
        <div>
          {suggestedTrips.map(trip => (
            <div key={trip.id} className="border-2 shadow-md w-fit p-2">
              {trip.title}
              <div className="flex flex-row space-x-2">
                <img src={trip.image_url} className="w-36"></img>
                <div>
                  Points of Interest:
                  {trip.places.map(place => (
                    <div key={place.id} className="flex flex-row py-1" >
                      <div className="pt-1 pr-1">
                        <MdFmdGood />
                      </div>
                      {place.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}