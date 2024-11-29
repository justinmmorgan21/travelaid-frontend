import { useLoaderData, useNavigate } from "react-router-dom";

export function Admin() {
  const users = useLoaderData();
  console.log(users);
  const navigate = useNavigate();

  const handleTripsShow = (trip) => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="flex flex-col bg-transparent" >
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl flex-grow text-white">All Users</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols-3 gap-16">
        {users.map((user,i) => (
          <div key={i} className="bg-white p-2">
            <p>User: {user.name}</p>
            <p>email: {user.email}</p>
              {user.trips.length == 0 ? <p className="m-4">NO TRIPS</p> : user.trips.map((trip, i) => (
              <div onClick={() => handleTripsShow(trip)} key={trip.id} className="border-2 border-gray-300 p-6 rounded-lg flex flex-col w-96 cursor-pointer bg-white mb-4">
                <h2 className="text-xl">Trip #{i + 1}:&nbsp; {trip.title}</h2>
                <div>Dates:&nbsp; {trip.start_time} - {trip.end_time}</div>
                <div>Places:&nbsp; {trip.places.map((place,i)=>(<span key={place.id}>{place.name}{i==trip.places.length-1?"":","} </span>))}</div>
                <div>Flights Booked: &nbsp; {"" + trip.flight_booked}</div>
              </div>
              ))}
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}