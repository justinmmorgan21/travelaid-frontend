import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
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
    // console.log(address);
    for (let i = 0; i < 3; i++) {
      address = address.slice(0, address.lastIndexOf(" "));
      // console.log(address);
    }
    // console.log(address.slice(address.includes(" ") ? address.indexOf(" ") : 0, address.length - 1));
    return address.slice(address.includes(" ") ? address.indexOf(" ") : 0, address.length - 1);
  }

  const handleAddFlights = (trip) => {
    setSearching(true);
    // add all flight info to trip in database
    console.log("depart: ", departureFlight);
    console.log("return: ", returnFlight);
    // use spinning wheel while the below is executing...
    const tripUpdateFlightParams = new FormData();
    tripUpdateFlightParams.append('flight_booked', true);
    axios.patch(`http://localhost:3000/trips/${trip.id}.json`, tripUpdateFlightParams).then(() => {
      // make a new Flight, like flight 12 with a trip_id = trip.id, "departing", and total_duration = departureFlight.total_duration
      const departureParams = new FormData();
      departureParams.append('trip_id', trip.id);
      departureParams.append('direction', "departing");
      departureParams.append('total_duration', departureFlight.total_duration);

      // Create DEPARTING FLIGHT, then create legs and layovers for it, on last leg and last layover, check if all have been done
      axios.post("http://localhost:3000/flights.json", departureParams).then(flightCreateResponse=> 
      {
        // console.log("Flight Create Response: ", flightCreateResponse.data);
        // make a new Leg for each element from departureFlight.flights : flight_id from flight just made, doing another proxy server request to get city, and convert times in backend
        departureFlight.flights.map((leg,i) => {
          console.log("Leg " + i + ": ", leg);
          let departureCity = null;
          // id of airport to city
          axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
            params: {
              type: "airport",
              input: leg.departure_airport.id
            },
          }).then((response) => {
            // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
            axios.get("http://127.0.0.1:3001/google-places-details", {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              // console.log(response.data);
              // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
              departureCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);

              let arrivalCity = null;
              // id of airport to city
              axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
                params: {
                  type: "airport",
                  input: leg.arrival_airport.id
                },
              }).then((response) => {
                // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
                axios.get("http://127.0.0.1:3001/google-places-details", {
                  params: {
                    place_id: response.data.predictions[0].place_id,
                  },
                }).then(response => {
                  // console.log(response.data);
                  // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
                  // console.log("Airport PLACES-DETAIL result for airport city from formatted address: ", response.data.result.formatted_address);
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
                  axios.post("http://localhost:3000/legs.json", legParams).then(() => {
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
          axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
            params: {
              type: "airport",
              input: layover.id
            },
          }).then((response) => {
            // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
            axios.get("http://127.0.0.1:3001/google-places-details", {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              // console.log(response.data);
              // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
              layoverCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);
              
              const layoverParams = new FormData();
              layoverParams.append('flight_id', flightCreateResponse.data.id);
              layoverParams.append('duration', layover.duration);
              layoverParams.append('airport_id', layover.id);
              layoverParams.append('airport_name', layover.name);
              layoverParams.append('airport_city', layoverCity);
              axios.post("http://localhost:3000/layovers.json", layoverParams).then(() => {
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
      axios.post("http://localhost:3000/flights.json", returnParams).then(flightCreateResponse=> 
      {
        // console.log(flightCreateResponse.data);
        // make a new Leg for each element from departureFlight.flights : flight_id from flight just made, doing another proxy server request to get city, and convert times in backend
        returnFlight.flights.map((leg,i) => {
          let departureCity = null;
          // id of airport to city
          axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
            params: {
              type: "airport",
              input: leg.departure_airport.id
            },
          }).then((response) => {
            // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
            axios.get("http://127.0.0.1:3001/google-places-details", {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              // console.log(response.data);
              // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
              departureCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);

              let arrivalCity = null;
              // id of airport to city
              axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
                params: {
                  type: "airport",
                  input: leg.arrival_airport.id
                },
              }).then((response) => {
                // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
                axios.get("http://127.0.0.1:3001/google-places-details", {
                  params: {
                    place_id: response.data.predictions[0].place_id,
                  },
                }).then(response => {
                  // console.log(response.data);
                  // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
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
                  axios.post("http://localhost:3000/legs.json", legParams).then(() => {
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
          axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
            params: {
              type: "airport",
              input: layover.id
            },
          }).then((response) => {
            // console.log("Airport AUTOCOMPLETE result for place_id: ", response.data.predictions[0].place_id);
            axios.get("http://127.0.0.1:3001/google-places-details", {
              params: {
                place_id: response.data.predictions[0].place_id,
              },
            }).then(response => {
              // console.log(response.data);
              // console.log("Airport PLACES-DETAIL result for airport city: ", response.data.result.address_components.find(component => component.types.includes('locality')).long_name);
              layoverCity = response.data.result.address_components.find(component => component.types.includes('locality')) ? response.data.result.address_components.find(component => component.types.includes('locality')).long_name : getCity(response.data.result.formatted_address);
              
              const layoverParams = new FormData();
              layoverParams.append('flight_id', flightCreateResponse.data.id);
              layoverParams.append('duration', layover.duration);
              layoverParams.append('airport_id', layover.id);
              layoverParams.append('airport_name', layover.name);
              layoverParams.append('airport_city', layoverCity);
              axios.post("http://localhost:3000/layovers.json", layoverParams).then(() => {
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
      {
        trips.map((trip,i) => (
          <div key={trip.id}>
            <div className="py-4 flex flex-row items-center">
              {/* <Button className="bg-blue-700 -px-1">add to trip</Button> */}
              <button className="bg-blue-700 text-white px-2 py-1 rounded mr-3 text-sm" onClick={()=>handleAddFlights(trip)}>add flights</button>
              <p>{trip.title}</p>
            </div>
            {i != trips.length-1 ? <hr /> : null}
          </div>
        ))
      }
      {
        searching ? 
        <div className="overlay">
          <div className="spinner">
            <svg role="status" className="h-8 w-8 animate-spin mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        </div>
         : null
      }
    </div>
  )
}