// import { useLoaderData, useNavigate } from "react-router-dom";
// import { useState } from 'react';
// import { Modal } from "./Modal";
// import { TripsCreateModal } from "./TripsCreateModal";
import { useLocation } from 'react-router-dom';


export function FlightResult() {
  // const trips = useLoaderData();
  const location = useLocation();
  const data = location.state;
  console.log("DATA:", data);

  // const navigate = useNavigate();
  // const [modalVisible, setModalVisible] = useState(false);

  // const handleTripsShow = (trip) => {
  //   console.log("handleTripsShow", trip);
  //   navigate(`/trips/${trip.id}`);
  // };

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
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 ">
        {data.best_flights.map((flight) => (
          <div key={flight.id} className="shadow-lg px-6 py-2 rounded-lg flex flex-row h-28 border-2 border-gray-200 mx-56">
            <div id="flight times" className="w-4/5 border-0 border-red-500">
              <div className="w-full h-1/2 border-0 border-green-600 flex flex-row justify-evenly">
                <div className="">
                  <img src={flight.airline_logo} alt="" className=" p-2 w-12"/>
                </div>
                <div className="-ml-12">
                  <p>
                  {flight.flights[0].departure_airport.time.slice(11,16)}pm -  {flight.flights[0].arrival_airport.time.slice(11,16)}pm
                  </p>
                  {flight.flights[0].airline} - {flight.flights[0].flight_number}
                </div>
                <div className="text-center border-0 my-auto border-yellow-300">
                  nonstop
                </div>
                <div className="">
                  <p>{Math.floor(flight.flights[0].duration/60)}h {flight.flights[0].duration%60}m</p>
                  <span className="font-light text-sm">{data.airports[0].departure[0].airport["id"]}-{data.airports[0].arrival[0].airport["id"]}</span>
                </div>

              </div>
              
              <div className="w-full h-1/2 border-0 border-black">

              </div>
              
            </div>
            <div id="price" className="flex items-center justify-center w-1/5 border-0 border-blue-500">
              <p className="text-center">${flight.price}</p>
            </div>



            {/* <h2 className="text-xl">{flight.price}</h2>
            <img  className="max-h-64 w-fit mx-auto" src={flight.airline_logo} />
            <div className="flex-grow"></div> */}
            {/* <div className="flex-end">
              <p className="my-2">{trip.start_time || "No Date Set"} &nbsp; to &nbsp; {trip.end_time || "No Date Set"}</p>
              {
                trip.start_time ? 
                <p className="my-2">{trip.start_time || "No Date Set"} {` to `} {trip.end_time || "No Date Set"}</p>
                :
                <p>No Date Set</p>
              }
              <button className="bg-blue-500 px-4 py-1 rounded text-white" onClick={() => handleTripsShow(trip)}>More info</button>
            </div> */}
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