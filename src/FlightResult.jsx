// import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from 'react';
// import { Modal } from "./Modal";
// import { TripsCreateModal } from "./TripsCreateModal";
import { useLocation, useNavigate } from 'react-router-dom';

export function FlightResult() {
  // const trips = useLoaderData();
  const location = useLocation();
  const data = location.state;
  console.log("DATA:", data);
  const navigate = useNavigate();
  const [departSet, setDepartSet] = useState(false);
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

  const handleFlightSelect = (flight) => {
    if (!departSet) {
      setDepartSet(true);
      console.log("TOKEN", flight.departure_token)
      fetch(`http://localhost:3001/?engine=${data.search_parameters.engine}&departure_id=${data.search_parameters.departure_id}&arrival_id=${data.search_parameters.arrival_id}&outbound_date=${data.search_parameters.outbound_date}&return_date=${data.search_parameters.return_date}&departure_token=${flight.departure_token}`)
      .then(response => response.json())
      .then(data => {
        console.log("RETURN", data);
        navigate("/flights", { state: data });
      });
    } else {
      console.log("TOKEN", flight.booking_token)
      fetch(`http://localhost:3001/?engine=${data.search_parameters.engine}&departure_id=${data.search_parameters.departure_id}&arrival_id=${data.search_parameters.arrival_id}&outbound_date=${data.search_parameters.outbound_date}&return_date=${data.search_parameters.return_date}&booking_token=${flight.booking_token}`)
      .then(response => response.json())
      .then(data => {
        console.log("SUCCESS both routes", data);
        navigate("/flights", { state: data });
      });
    }
  }

  return (
    <div className="flex flex-col">
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl">Flight Search Results</h1>
      </div>
      <hr className="mb-6"/>
      {/* Cards */}
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 ">
        <div >
          <p className='mx-56' hidden={departSet}>Departing flights</p>
          <p className='mx-56' hidden={!departSet}>Return flights</p>
        </div>
        {data.best_flights.map((flight, i) => (
          <div key={i} className="shadow-lg px-6 py-2 rounded-xl flex flex-row h-28 border-2 border-gray-200 mx-56">
            <div id="flight times" className="w-4/5 border-0 border-red-500 flex flex-row items-center justify-evenly">
              {/* <div className="w-full h-full border-4 border-green-600 flex flex-row items-center justify-evenly"> */}
              <div className="">
                <img src={flight.airline_logo} alt="" className=" w-12 -ml-2"/>
              </div>
              <div className="-ml-2">
                <p className='mb-1'>
                {flight.flights[0].departure_airport.time.slice(11,16)}pm -  {flight.flights[0].arrival_airport.time.slice(11,16)}pm
                </p>
                {flight.flights[0].airline} - {flight.flights[0].flight_number}
              </div>
              <div className="text-center border-0 my-auto border-yellow-300">
                nonstop
              </div>
              <div className="">
                <p>{Math.floor(flight.flights[0].duration/60)}h {flight.flights[0].duration%60}m</p>
                <span className="font-light text-sm">{flight.flights[0].departure_airport["id"]}-{flight.flights[0].arrival_airport["id"]}</span>
              </div>
              <button className="border-2 border-gray-400 rounded-3xl text-sm text-blue-600 flex-end px-4 py-2 shadow" onClick={()=>handleFlightSelect(flight)}>Select flight</button>
            </div>
            <div className='border-r-2 border-gray-400'></div>
            <div id="price" className="flex items-center justify-center w-1/5 border-0 border-blue-500">
              <p className="text-center">${flight.price}</p>
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