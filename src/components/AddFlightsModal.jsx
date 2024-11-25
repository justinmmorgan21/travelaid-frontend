import { useNavigate } from "react-router-dom";

export function AddFlightsModal({onClose, trips, flights}) {
  const navigate = useNavigate();

  const handleAddFlights = (trip) => {
    console.log("TRIP: ", trip);
    const departureFlight = flights[0];
    const returnFlight = flights[1];
    // add all flight info to trip in database
    console.log("depart: ", departureFlight);
    console.log("return: ", returnFlight);
    navigate(`/trips/${trip.id}`)
    onClose();
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