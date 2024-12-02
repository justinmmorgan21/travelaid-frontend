import FlightHotelSearch from "./components/FlightHotelSearch";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdFmdGood } from "react-icons/md";
import { HiChevronDoubleRight } from "react-icons/hi";
import { Button } from "flowbite-react";
import { Modal } from "./Modal";
import { AddSuggestedTrip } from "./components/AddSuggestedTrip";
import apiConfig from './apiConfig';

export default function Home() {
  const navigate = useNavigate();
  const nextTrip = useLoaderData();  
  const nextImage = nextTrip ? nextTrip.image_url : "";
  const nextTitle = nextTrip ? nextTrip.title : "";
  const nextDate = nextTrip ? nextTrip.start_time : "";
  const [ suggestedTrips, setSuggestedTrips ] = useState([]);
  const handleSuggestedTrips = () => {
    axios.get(`${apiConfig.backendBaseUrl}/trips/suggested.json`).then(response => {
      setSuggestedTrips(response.data);
    })
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
  }

  useEffect(handleSuggestedTrips, []);

  return (
    <div className="flex flex-col items-center ">
      <div className="rounded-lg p-4 shadow-lg bg-white" >
        <FlightHotelSearch />
      </div>
      <div id="next-trip" className={`h-44 my-12 rounded-lg p-4 shadow-md bg-white ${nextTrip ? "cursor-pointer" : "cursor-not-allowed pointer-events-none"}`} onClick={()=>{if(nextTitle) {navigate(`/trips/${nextTrip.id}`);}}}>
        <h1 className="text-3xl">Next Trip</h1>
        <div className="flex flex-row">
          <img src={nextImage} alt="" className="h-24"/>
          <div className="ml-10">
            <p>{nextTitle}</p>
            <p>{nextDate}</p>
            <div className="w-full flex flex-row justify-center pt-4 pr-4">
              <div className="border-2 border-opacity-80 border-gray-600 rounded-full p-1 shadow-md">
                <HiChevronDoubleRight />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-80 w-fit rounded-lg py-4 px-8 shadow-md bg-white">
        <p className="text-2xl font-bold pb-2">Suggested Trips</p>
        <div className="flex flex-row space-x-4">
        {suggestedTrips.map(trip => (
          <div key={trip.id} className="border-2 shadow-md w-96 p-2 flex flex-col">
            <div>
              {trip.title}
            </div>
            <div className="flex flex-row space-x-2 flex-grow">
              <img src={trip.image_url} className="max-w-36 max-h-36"></img>
              <div className="p-1">
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
            <div className="w-full flex justify-end flex-end">
              <Button className="bg-blue-700 -px-4 -py-1 rounded-md text-white" type="button" onClick={() => { setModalVisible(true); setCurrentTrip(trip)}}>Add to Trips</Button>
            </div>
          </div>
        ))}
        </div>
        <Modal onClose={handleClose} show={modalVisible}>
          {currentTrip && <AddSuggestedTrip onClose={handleClose} trip={currentTrip}/>}
        </Modal>
      </div>
    </div>
  )
}