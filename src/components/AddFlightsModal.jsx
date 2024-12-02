import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Spinner } from './Spinner';
import axios from 'axios';
import apiConfig from '../apiConfig';

export function AddFlightsModal({onClose, trips, flights}) {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);

  const departureFlight = flights[0];
  const returnFlight = flights[1];
  let departLegsCount = 0;
  let departLayoversCount = 0;
  let returnLegsCount = 0;
  let returnLayoversCount = 0;
  let departLegsDone = false;
  let departLayoversDone = departureFlight.flights.length == 1;
  let returnLegsDone = false;
  let returnLayoversDone = returnFlight.flights.length == 1;

  const getCity = address => {
    for (let i = 0; i < 3; i++) {
      address = address.slice(0, address.lastIndexOf(" "));
    }
    return address.slice(address.includes(" ") ? address.indexOf(" ") : 0, address.length - 1);
  }

  const handleAddFlights = (trip) => {
    setSearching(true);
    const tripUpdateFlightParams = new FormData();
    tripUpdateFlightParams.append('flight_booked', true);
    axios.patch(`${apiConfig.backendBaseUrl}/trips/${trip.id}.json`, tripUpdateFlightParams).then(() => {
      const departureParams = new FormData();
      departureParams.append('trip_id', trip.id);
      departureParams.append('direction', "departing");
      departureParams.append('total_duration', departureFlight.total_duration);

      // Create DEPARTING FLIGHT, then create legs and layovers for it, on last leg and last layover, check if all have been done
      axios.post(`${apiConfig.backendBaseUrl}/flights.json`, departureParams).then(flightCreateResponse=> 
      {
        // make a new Leg for each element from departureFlight.flights : flight_id from flight just made, doing another proxy server request to get city, and convert times in backend
        departureFlight.flights.map((leg,i) => {
          let departureCity = null;
          // id of airport to city
          axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
            params: {
              input: leg.departure_airport.id
            },
          }).then((response) => {
            axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              departureCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);

              let arrivalCity = null;
              // id of airport to city
              axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
                params: {
                  input: leg.arrival_airport.id
                },
              }).then((response) => {
                axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
                  params: {
                    place_id: response.data.predictions[0].place_id,
                  },
                }).then(response => {
                  arrivalCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);

                  const legParams = new FormData();
                  legParams.append('flight_id', flightCreateResponse.data.id);
                  legParams.append('leg_number', i);
                  legParams.append('airline', leg.airline);
                  legParams.append('airline_logo', leg.airline_logo);
                  legParams.append('airplane', leg.airplane);
                  legParams.append('departure_airport_id', leg.departure_airport.id);
                  legParams.append('departure_airport_name', leg.departure_airport.name);
                  legParams.append('departure_airport_time', leg.departure_airport.time);
                  legParams.append('departure_airport_city', departureCity);
                  legParams.append('arrival_airport_id', leg.arrival_airport.id);
                  legParams.append('arrival_airport_name', leg.arrival_airport.name);
                  legParams.append('arrival_airport_time', leg.arrival_airport.time);
                  legParams.append('arrival_airport_city', arrivalCity);
                  legParams.append('duration', leg.duration);
                  legParams.append('flight_number', leg.flight_number);
                  axios.post(`${apiConfig.backendBaseUrl}/legs.json`, legParams).then(() => {
                    departLegsCount++;
                    if (departLegsCount == departureFlight.flights.length) { //this is the last leg to complete
                      departLegsDone = true;
                      if (departLegsDone && departLayoversDone && returnLegsDone && returnLayoversDone) {
                        navigate(`/trips/${trip.id}`)
                        onClose();
                        setSearching(false);
                      }
                    }
                  })
                })
              })
            })
          })
        })
        
        // make a new Layover for each element from departureFlight.layovers
        departureFlight.layovers && departureFlight.layovers.map((layover) => {
          let layoverCity = null;
          // id of airport to city
          axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
            params: {
              input: layover.id
            },
          }).then((response) => {
            axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              layoverCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);
              
              const layoverParams = new FormData();
              layoverParams.append('flight_id', flightCreateResponse.data.id);
              layoverParams.append('duration', layover.duration);
              layoverParams.append('airport_id', layover.id);
              layoverParams.append('airport_name', layover.name);
              layoverParams.append('airport_city', layoverCity);
              axios.post(`${apiConfig.backendBaseUrl}/layovers.json`, layoverParams).then(() => {
                departLayoversCount++;
                if (departLayoversCount == departureFlight.layovers.length) { //this is the last layover to complete
                  departLayoversDone = true;
                  if (departLegsDone && departLayoversDone && returnLegsDone && returnLayoversDone) {
                    navigate(`/trips/${trip.id}`)
                    onClose();
                    setSearching(false);
                  }
                }
              })
            })
          })
        })
      });

      // Create RETURNING FLIGHT, then create legs and layovers for it, on last leg and last layover, check if all have been done
      const returnParams = new FormData();
      returnParams.append('trip_id', trip.id);
      returnParams.append('direction', "returning");
      returnParams.append('total_duration', returnFlight.total_duration);
      axios.post(`${apiConfig.backendBaseUrl}/flights.json`, returnParams).then(flightCreateResponse => 
      {
        // make a new Leg for each element from departureFlight.flights : flight_id from flight just made, doing another proxy server request to get city, and convert times in backend
        returnFlight.flights.map((leg,i) => {
          let departureCity = null;
          // id of airport to city
          axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
            params: {
              input: leg.departure_airport.id
            },
          }).then((response) => {
            axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              departureCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);

              let arrivalCity = null;
              // id of airport to city
              axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
                params: {
                  input: leg.arrival_airport.id
                },
              }).then((response) => {
                axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
                  params: {
                    place_id: response.data.predictions[0].place_id,
                  },
                }).then(response => {
                  arrivalCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);
                  const legParams = new FormData();
                  legParams.append('flight_id', flightCreateResponse.data.id);
                  legParams.append('leg_number', i);
                  legParams.append('airline', leg.airline);
                  legParams.append('airline_logo', leg.airline_logo);
                  legParams.append('airplane', leg.airplane);
                  legParams.append('departure_airport_id', leg.departure_airport.id);
                  legParams.append('departure_airport_name', leg.departure_airport.name);
                  legParams.append('departure_airport_time', leg.departure_airport.time);
                  legParams.append('departure_airport_city', departureCity);
                  legParams.append('arrival_airport_id', leg.arrival_airport.id);
                  legParams.append('arrival_airport_name', leg.arrival_airport.name);
                  legParams.append('arrival_airport_time', leg.arrival_airport.time);
                  legParams.append('arrival_airport_city', arrivalCity);
                  legParams.append('duration', leg.duration);
                  legParams.append('flight_number', leg.flight_number);
                  axios.post(`${apiConfig.backendBaseUrl}/legs.json`, legParams).then(() => {
                    returnLegsCount++;
                    if (returnLegsCount == returnFlight.flights.length) { //this is the last leg to complete
                      returnLegsDone = true;
                      if (departLegsDone && departLayoversDone && returnLegsDone && returnLayoversDone) {
                        navigate(`/trips/${trip.id}`)
                        onClose();
                        setSearching(false);
                      }
                    }
                  })
                })
              })
            })
          })
        })
        
        // make a new Layover for each element from departureFlight.layovers
        returnFlight.layovers && returnFlight.layovers.map((layover) => {
          let layoverCity = null;
          // id of airport to city
          axios.get(`${apiConfig.proxyServerUrl}/google-places-autocomplete`, {
            params: {
              input: layover.id
            },
          }).then((response) => {
            axios.get(`${apiConfig.proxyServerUrl}/google-places-details`, {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              layoverCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);
              
              const layoverParams = new FormData();
              layoverParams.append('flight_id', flightCreateResponse.data.id);
              layoverParams.append('duration', layover.duration);
              layoverParams.append('airport_id', layover.id);
              layoverParams.append('airport_name', layover.name);
              layoverParams.append('airport_city', layoverCity);
              axios.post(`${apiConfig.backendBaseUrl}/layovers.json`, layoverParams).then(() => {
                returnLayoversCount++;
                if (returnLayoversCount == returnFlight.layovers.length) { //this is the last leg to complete
                  returnLayoversDone = true;
                  if (departLegsDone && departLayoversDone && returnLegsDone && returnLayoversDone) {
                    navigate(`/trips/${trip.id}`)
                    onClose();
                    setSearching(false);
                  }
                }
              })
            })
          })
        })
      });
    })
  }

  return (
    <div> 
      { localStorage.jwt === undefined ? (
        <p>Must be logged in to make New Trips or Add Flights to Trips</p>
      ) : (
        trips.map((trip,i) => (
          <div key={trip.id}>
            <div className="py-4 flex flex-row items-center">
              <button className="bg-blue-700 text-white px-2 py-1 rounded mr-3 text-sm" onClick={()=>handleAddFlights(trip)}>add flights</button>
              <p>{trip.title}</p>
            </div>
            {i != trips.length-1 && <hr /> }
          </div>
        ))
      )}
      { searching && <Spinner /> }
    </div>
  )
}