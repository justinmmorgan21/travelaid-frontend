import {useLoaderData} from "react-router-dom";

export function TripsShowPage() {
  const trip = useLoaderData();

  return (
    <div>
      <h2>{trip.title}</h2>
      <img src={trip.image_url} />
      <p>{trip.start_time} -- {trip.end_time}</p>
      <br />
      <h3>Itinerary</h3>
      {trip.places.map(place => (
        <div key={place.id}>
          <p>Place: {place.name}</p>
        </div>      
      ))}
    </div>
  );
}