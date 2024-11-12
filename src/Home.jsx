import FlightHotelSearch from "./components/FlightHotelSearch"
import { useLoaderData, useNavigate } from "react-router-dom"
export default function Home() {

  const nextTrip = useLoaderData();
  console.log("NEXT", nextTrip);
  const nextImage = nextTrip ? nextTrip.image_url : "";
  const nextTitle = nextTrip ? nextTrip.title : "";
  const nextDate = nextTrip ? nextTrip.start_time : "";

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <div className="border-2 rounded-lg p-4 border-gray-400 shadow-lg" >
        <FlightHotelSearch />
      </div>
      <div id="next-trip" className="h-44 my-12 border-2 border-gray-400 rounded-lg p-4 shadow-md" onClick={()=>{navigate(`/trips/${nextTrip.id}`);}}>
        <h1 className="text-3xl">Next Trip</h1>
        <div className="flex flex-row">
          <img src={nextImage} alt="" className="h-24"/>
          <div className="ml-10">
            <p>{nextTitle}</p>
            <p>{nextDate}</p>
          </div>
        </div>
      </div>
      <div className="h-56 w-full border-2 border-gray-400 rounded-lg p-4 text-3xl shadow-md">
        Suggested Trips
      </div>
    </div>
  )
}