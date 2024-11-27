import { Button } from "flowbite-react";
import { useLocation } from 'react-router-dom';
import { useState } from 'react'
// import { ProgressBar } from 'react-bootstrap';
import { Flight } from './components/Flight';
import { LuDot } from "react-icons/lu";
import { FaRepeat } from "react-icons/fa6";
import { AddFlightsModal } from "./components/AddFlightsModal";
import { Modal } from "./Modal";
import axios from 'axios'
export function SelectedFlight() {
  const location = useLocation();
  const data = location.state;
  const departureFlight = data.selected_flights[0];
  const returnFlight = data.selected_flights[1];

  const handleConfirmBooking = () => {
    window.open(`${data.search_metadata.google_flights_url}`, "_blank");
  }

  const [trips, setTrips] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const handleClose = () => {
    setModalVisible(false);
  }

  const handleAddFlights = () => {
    axios.get("http://localhost:3000/trips.json").then(response => {
      setTrips(response.data);
      setModalVisible(true);
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl text-white">Flight Search Results</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 " >
        <div >
          <h1 className='ml-48 text-4xl text-white flex flex-row items-center' >{data.selected_flights[0].flights[0].departure_airport.id} &nbsp; <FaRepeat /> &nbsp;
          {data.selected_flights[1].flights[0].departure_airport.id} </h1>
          <h1 className='text-center text-2xl font-bold mb-6 text-white'>Selected flights</h1>
          <div className='mx-48 flex flex-row mb-2 text-white'>
            <p >Departing flight</p>
            <div className='pt-1 px-1'>
              <LuDot />
            </div>
            {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(departureFlight.flights[0].departure_airport["time"]))
            }
          </div>

          <Flight flight={departureFlight} selected={true} bothFlights={data} isDeparting={true}/>

          <br />  
          <div className='mx-48 flex flex-row mb-2 text-white'>
            <p >Returning flight</p>
            <div className='pt-1 px-1'>
              <LuDot />
            </div>
            {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(returnFlight.flights[0].departure_airport["time"]))
            }
          </div>

          <Flight flight={returnFlight} selected={true} bothFlights={data} isDeparting={false}/>

        </div>
      </div>

      <div className='mx-auto ml-20 flex flex-row w-full text-white border-0 border-black'>
          <Button className=" pt-1 mt-4 bg-blue-700 h-12 px-2 rounded-md text-white mx-auto" onClick={()=>handleConfirmBooking()}>Continue to Booking</Button>
          <div className='mr-72 -ml-72  py-1 px-4 bg-white mt-2 rounded-md'>
            <p className='text-gray-700 text-2xl'>${data.price_insights.lowest_price}</p>
            <p className='text-gray-700 text-sm font-light'>Lowest Total Price</p>
          </div>
      </div>
      <div className="mx-auto">
        <Button className=" pt-1 mt-4 bg-blue-700 h-12 px-3 rounded-md text-white ml-3" onClick={()=>handleAddFlights()}>Add flights to a trip</Button>
      </div>
      <Modal onClose={handleClose} show={modalVisible}>
        <AddFlightsModal onClose={handleClose} trips={trips} flights={data.selected_flights}/>
      </Modal>
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