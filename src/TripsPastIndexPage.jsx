import { useLoaderData, useNavigate } from "react-router-dom";

export function TripsPastIndexPage() {
  const trips = useLoaderData();
  const navigate = useNavigate();

  const handleTripsShow = (trip) => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="flex flex-col bg-transparent h-screen" >
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-4xl flex-grow text-white">Past Trips</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols-3 gap-16">
        {trips.map((trip) => (
          <div onClick={() => handleTripsShow(trip)} key={trip.id} className="shadow-xl p-6 rounded-lg flex flex-col w-96 cursor-pointer bg-white">
            <h2 className="text-xl">{trip.title}</h2>
            <img  className="max-h-64 w-fit mx-auto" src={trip.image_url} />
            <div className="flex-grow"></div>
            <div className="flex-end">
              {
                trip.start_time ? 
                <p className="my-2">{trip.start_time || "No Date Set"} {` to `} {trip.end_time || "No Date Set"}</p>
                :
                <p>No Date Set</p>
              }
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
    </div>
  );
}