import { useLoaderData, useNavigate } from "react-router-dom";
// import { useState } from 'react';
// import { Modal } from "./Modal";
// import { TripsCreateModal } from "./TripsCreateModal";

export function TripsIndexPage() {
  const trips = useLoaderData();
  
  const navigate = useNavigate();
  // const [modalVisible, setModalVisible] = useState(false);

  const handleTripsShow = (trip) => {
    console.log("handleTripsShow", trip);
    navigate(`/trips/${trip.id}`);
  };

  // const handleModalShow = () => {
  //   setModalVisible(true);
  // }
  // const handleClose = () => {
  //   setModalVisible(false);
  // }

  return (
    <div className="flex flex-col">
      <br />
      <h1 className="text-4xl mb-6">Upcoming Trips</h1>
      <hr className="mb-6"/>
      {/* Cards */}
      <div className="grid grid-cols-3 gap-16">
        {trips.map((trip) => (
          <div onClick={() => handleTripsShow(trip)} key={trip.id} className="shadow-xl p-6 rounded-lg flex flex-col w-96 cursor-pointer">
            <h2 className="text-xl">{trip.title}</h2>
            <img  className="max-h-64 w-fit mx-auto" src={trip.image_url} />
            <div className="flex-grow"></div>
            <div className="flex-end">
              <p className="my-2">{trip.start_time} -- {trip.end_time}</p>
              {/* <button className="bg-blue-500 px-4 py-1 rounded text-white" onClick={() => handleTripsShow(trip)}>More info</button> */}
            </div>
          </div>
        ))}
      </div>
      <br /><br />
      {/* <button className="bg-blue-500 px-4 py-1 rounded text-white my-12" onClick={()=>handleModalShow()}>Add Trip</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <TripsCreateModal onClose={handleClose}/>
      </Modal> */}
    </div>
  );
}