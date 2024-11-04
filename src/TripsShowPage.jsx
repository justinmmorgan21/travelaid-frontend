import {useLoaderData} from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { PlacesCreateModal } from "./PlacesCreateModal";

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
      <h1>{trip.title}</h1>
      <img src={trip.image_url} />
      <p>{trip.start_time} -- {trip.end_time}</p>
      <hr />
      <h2>Itinerary:</h2>
      <br />
      {trip.places.map(place => (
        <div key={place.id}>
          <h3>Place: {place.name}</h3>
          <p>Address: {place.address}</p>
          <p>{place.description}</p>
          <img src={place.image_url} alt="" />
          <p>{place.start_time} -- {place.end_time}</p>
          <br />
        </div>      
      ))}
      <button onClick={()=>handleModalShow()}>Add Stop</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <PlacesCreateModal onClose={handleClose} trip={trip}/>
      </Modal>
    </div>
  );
}