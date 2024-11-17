// import { useLoaderData, useNavigate } from "react-router-dom";
// import { useState } from 'react';
import { Button } from "flowbite-react";
// import { Modal } from "./Modal";
// import { TripsCreateModal } from "./TripsCreateModal";
import { useLocation } from 'react-router-dom';
// import { ProgressBar } from 'react-bootstrap';
import { Flight } from './components/Flight';
import { LuDot } from "react-icons/lu";

export function SelectedFlight() {
  // const trips = useLoaderData();
  const location = useLocation();
  // const { departureFlight, returnFlight, ...data } = location.state;
  const data = location.state;
  console.log("SELECTED FLIGHT DATA:", data);
  const departureFlight = data.selected_flights[0];
  const returnFlight = data.selected_flights[1];
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
  console.log("DEP FLIGHT: ", departureFlight);
  console.log("RET FLIGHT: ", returnFlight);

  const handleConfirmBooking = () => {
    window.open(`${data.search_metadata.google_flights_url}`, "_blank");
  }

  return (
    <div className="flex flex-col">
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl">Flight Search Results</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 " >
        {/* <div hidden={returnFlight != null}>
          <p className='mx-48' hidden={departSet}>Departing flights</p>
          <p className='mx-48' hidden={!departSet}>Return flights</p>
          Cards
          {data.best_flights.map((flight, i) => (
            <div key={i}>
              <Flight flight={flight} onFlightSelect={handleFlightSelect} selected={false}/>
            </div>
          ))}
        </div> */}
        <div >
          <h1 className='text-center text-2xl font-bold mb-6'>Selected flights</h1>
          <div className='mx-48 flex flex-row mb-2'>
            <p >Departing flight</p>
            <div className='pt-1 px-1'>
              <LuDot />
            </div>
            {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(departureFlight.flights[0].departure_airport["time"]))
            }
          </div>

          <Flight flight={departureFlight} selected={true} />

          <br />  
          <div className='mx-48 flex flex-row mb-2'>
            <p >Returning flight</p>
            <div className='pt-1 px-1'>
              <LuDot />
            </div>
            {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(returnFlight.flights[0].departure_airport["time"]))
            }
          </div>

          <Flight flight={returnFlight} selected={true} />

        </div>
        {/* <div hidden={returnFlight != null}>

        </div> */}
      </div>

      <div className='mx-auto flex flex-row w-full mt-4'>
          <div className='mx-48 '>
            <p className='font-bold text-2xl'>${data.price_insights.lowest_price}</p>
            <p className='text-sm font-light'>Lowest Total Price</p>
          </div>
          <Button className="ml-20 pt-1 bg-blue-500 h-12 px-2 rounded-md text-white" onClick={()=>handleConfirmBooking()}>Continue to Booking</Button>
          {/* <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>onClose()}>Cancel</Button> */}
        </div>
      {/* <button className="bg-blue-500 px-4 py-1 rounded text-white my-12" onClick={()=>handleModalShow()}>Add Trip</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <TripsCreateModal onClose={handleClose}/>
      </Modal> */}
    </div>
  );
}
              // <div className='w-20 opacity-60' hidden={!returnSet}>
              //   <ProgressBar >
              //     <ProgressBar variant="success" now={30} key={1} />
              //     <ProgressBar variant="warning" now={40} key={2} />
              //     <ProgressBar variant="danger" now={30} key={3} />
              //   </ProgressBar> */}
              // </div>