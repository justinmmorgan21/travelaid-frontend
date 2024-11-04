import { useLoaderData, useNavigate } from "react-router-dom";

export function TripsIndexPage() {
  const trips = useLoaderData();
  console.log(trips);
  const navigate = useNavigate();

  const handleShow = (trip) => {
    console.log("handleShow", trip);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div>
        <h1>All trips</h1>
        {trips.map((trip) => (
          <div key={trip.id}>
            <h2>{trip.title}</h2>
            <img src={trip.image_url} />
            <p>{trip.start_time} -- {trip.end_time}</p>
            <button onClick={() => handleShow(trip)}>More info</button>
          </div>
        ))}
      </div>
  );
}