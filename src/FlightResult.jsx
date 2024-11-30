import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flight } from './components/Flight';
import { Spinner } from './components/Spinner';
import axios from 'axios';

export function FlightResult() {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [departSet, setDepartSet] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleFlightSelect = (flight) => {
    if (!departSet) {
      setDepartureFlight(flight);
      setSearching(true);
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
        setDepartSet(true);
        navigate("/flights", { state: response.data });
      }).finally(() => {
        setSearching(false);
      });
    } else {
      setReturnFlight(flight);
      setSearching(true);
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
        navigate("/selected_flight", { state: { ...response.data, departureFlight, returnFlight } });
      }).finally(() => {
        setSearching(false);
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
      <div className="grid grid-cols space-y-4" >
        <div >
          <p className='mx-48 text-white mb-2 text-center text-lg font-bold' hidden={departSet}>Departing flights</p>
          <p className='mx-48 text-white mb-2 text-center text-lg font-bold' hidden={!departSet}>Return flights</p>
          {(data.best_flights && data.best_flights || data.other_flights).map((flight, i) => (
            <div key={i}>
              <Flight flight={flight} onFlightSelect={handleFlightSelect} selected={false}/>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
      { searching && <Spinner /> }
    </div>
  );
}