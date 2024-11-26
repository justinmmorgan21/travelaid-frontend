import { useNavigate } from "react-router-dom";
import axios from 'axios'
export function AddFlightsModal({onClose, trips, flights}) {
  const navigate = useNavigate();

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
    const departureFlight = flights[0];
    const returnFlight = flights[1];
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
      axios.post("http://localhost:3000/flights.json", departureParams).then(flightCreateResponse=> {
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
                  axios.post("http://localhost:3000/legs.json", legParams).then((response) => {
                    console.log(response.data);
                    
                  })
                })
              })
            })
          })
        })
        
        // make a new Layover for each element from departureFlight.layovers
        departureFlight.layovers && departureFlight.layovers.map(layover => {
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
                // console.log(response.data);
              })
            })
          })
        })
      });

      // do it all again for returning
      const returnParams = new FormData();
      returnParams.append('trip_id', trip.id);
      returnParams.append('direction', "returning");
      returnParams.append('total_duration', returnFlight.total_duration);
      axios.post("http://localhost:3000/flights.json", returnParams).then(flightCreateResponse=> {
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
                    // console.log(response.data);
                    if (returnFlight.layovers == null)
                      navigate(`/trips/${trip.id}`)
                      onClose();
                  })
                })
              })
            })
          })
        })
        
        // make a new Layover for each element from departureFlight.layovers
        returnFlight.layovers && returnFlight.layovers.map((layover,i) => {
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
                // console.log(response.data);
                if (i == returnFlight.layovers.length - 1) {
                  //then navigate after all have executed
                  navigate(`/trips/${trip.id}`)
                  onClose();
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
    </div>
  )
}