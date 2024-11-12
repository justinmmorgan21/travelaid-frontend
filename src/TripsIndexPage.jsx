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
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl flex-grow">Upcoming Trips</h1>
        <button className="bg-blue-500 rounded text-white flex-end px-2 ">Past Trips</button>
      </div>
      <hr className="mb-6"/>
      {/* Cards */}
      <div className="grid grid-cols-3 gap-16">
        {trips.map((trip) => (
          <div onClick={() => handleTripsShow(trip)} key={trip.id} className="shadow-xl p-6 rounded-lg flex flex-col w-96 cursor-pointer">
            <h2 className="text-xl">{trip.title}</h2>
            <img  className="max-h-64 w-fit mx-auto" src={trip.image_url} />
            <div className="flex-grow"></div>
            <div className="flex-end">
              <p className="my-2">{trip.start_time} &nbsp; to &nbsp; {trip.end_time}</p>
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