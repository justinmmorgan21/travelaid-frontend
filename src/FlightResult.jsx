import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flight } from './components/Flight';
import axios from 'axios';
export function FlightResult() {

  const location = useLocation();
  const data = location.state;
  console.log("FLIGHT SEARCH:", data);
  const navigate = useNavigate();
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [departSet, setDepartSet] = useState(false);

  const handleFlightSelect = (flight) => {
    if (!departSet) {
      setDepartSet(true);
      setDepartureFlight(flight);
      console.log("DEPARTURE TOKEN", flight.departure_token)
      
      axios.get("http://localhost:3001/search-flights", {
        params: {
          engine: data.search_parameters.engine,
          departure_id: data.search_parameters.departure_id,
          arrival_id: data.search_parameters.arrival_id,
          outbound_date: data.search_parameters.outbound_date,
          return_date: data.search_parameters.return_date,
          departure_token: flight.departure_token
        },
      }).then(response => {
        console.log(response.data);
        navigate("/flights", { state: response.data });
      });
    } else {
      setReturnFlight(flight);
      console.log("BOOKING TOKEN", flight.booking_token)

      axios.get("http://localhost:3001/search-flights", {
        params: {
          engine: data.search_parameters.engine,
          departure_id: data.search_parameters.departure_id,
          arrival_id: data.search_parameters.arrival_id,
          outbound_date: data.search_parameters.outbound_date,
          return_date: data.search_parameters.return_date,
          booking_token: flight.booking_token
        },
      }).then(response => {
        console.log(response.data);
        navigate("/selected_flight", { state: { ...response.data, departureFlight, returnFlight } });
      });
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-white text-4xl">Flight Search Results</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 " >
        <div >
          <p className='mx-48 text-white' hidden={departSet}>Departing flights</p>
          <p className='mx-48 text-white' hidden={!departSet}>Return flights</p>
          {(data.best_flights && data.best_flights || data.other_flights).map((flight, i) => (
            <div key={i}>
              <Flight flight={flight} onFlightSelect={handleFlightSelect} selected={false}/>
            </div>
          ))}
        </div>
      </div>
      
      <br /><br />
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