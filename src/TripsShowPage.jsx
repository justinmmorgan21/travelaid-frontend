import {useLoaderData} from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
export function TripsShowPage() {
  const trip = useLoaderData();
  console.log(trip);

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  return (
    <div>
      <div className='absolute top-24 left-1/3 z-10 ml-16 -mr-16 border-2 rounded-lg border-gray-500'>
        <FlightHotelSearch />
      </div>
      <a className="underline" href="/trips">{'<'}- back to Upcoming Trips</a>
      <h1 className="text-4xl my-6">{trip.title}</h1>
      <img className="w-80" src={trip.image_url} />
      <p className="my-6 text-lg">Date: {trip.start_time} -- {trip.end_time}</p>
      <hr />
      <h2 className="mt-6 text-lg">Itinerary:</h2>
      <br />
    <Accordion collapseAll>
      {trip.places.map(place => (
      <Accordion.Panel key={place.id}>
        <Accordion.Title className="flex flex-row">
          <span className="pr-16">
            {place.name}  
          </span>
          <span className="">
            {place.start_time} -- {place.end_time}
          </span>
        </Accordion.Title>
        <Accordion.Content>
          <div className="flex flex-row">
            <img className="w-36 mr-16" src={place.image_url} alt="" />
            <div>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                {place.address}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {place.description}
              </p>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
      ))}
    </Accordion>

      <button className="bg-blue-500 px-4 py-1 rounded text-white my-12" onClick={()=>handleModalShow()}>Add a Place to your Itinerary</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <PlacesCreate onClose={handleClose} trip={trip}/>
      </Modal>
    </div>
  );
}