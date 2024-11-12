import FlightHotelSearch from "./components/FlightHotelSearch"
import { useLoaderData, useNavigate } from "react-router-dom"
export function Home() {

  const nextTrip = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 rounded-lg p-4" >
        <FlightHotelSearch />
      </div>
      <div className="h-44 my-12 border-2 rounded-lg p-4" onClick={()=>{navigate(`/trips/${nextTrip.id}`);}}>
        <h1 className="text-3xl">Next Trip</h1>
        <div className="flex flex-row">
          <img src={nextTrip.image_url} alt="" className="h-24"/>
          <div className="ml-10">
            <p>{nextTrip.title}</p>
            <p>{nextTrip.start_time}</p>
          </div>
        </div>
      </div>
      <div className="h-56 w-full border-2">
        Suggested Trips
      </div>
    </div>
  )
}