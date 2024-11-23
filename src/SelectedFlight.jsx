import { Button } from "flowbite-react";
import { useLocation } from 'react-router-dom';
// import { ProgressBar } from 'react-bootstrap';
import { Flight } from './components/Flight';
import { LuDot } from "react-icons/lu";

export function SelectedFlight() {
  const location = useLocation();
  const data = location.state;
  console.log("SELECTED FLIGHT DATA:", data);
  const departureFlight = data.selected_flights[0];
  const returnFlight = data.selected_flights[1];

  const handleConfirmBooking = () => {
    window.open(`${data.search_metadata.google_flights_url}`, "_blank");
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