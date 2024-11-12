import SplashImage from './assets/TravelAid.svg';
// import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
export function Hero({ modalShow }) {
  return (
    <div className='relative'>
      <img src={SplashImage} className="w-full" alt="Splash Screen Image" />
      <div className='absolute top-16 left-1/2 z-10 -ml-16 mr-16'>
        <FlightHotelSearch />
      </div>
      {/* <div className='absolute top-16 left-1/2 z-10 -ml-16 mr-16'>
        <form className="flex max-w-4xl flex-row gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="departure" value="Departure" />
            </div>
            <TextInput id="departure" type="text" placeholder="Departure" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="Destination" value="Destination" />
            </div>
            <TextInput id="Destination" type="text" placeholder="Destination" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="Destination" value="Leave" />
            </div>
            <Datepicker title="Arrive" name="start_time" />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="Destination" value="Return" />
            </div>
            <Datepicker title="Arrive" name="start_time" />
          </div>

          <Button className="text-black px-6 mt-8 h-11 border-2 border-gray-500 bg-white rounded-md'" type="submit">Search</Button>
        </form>
      </div> */}
      <button className='absolute top-1/2 left-1/3 z-10 text-black px-6 py-2 border-2 border-gray-500 bg-white rounded-md' onClick={()=>modalShow()}>Sign in</button>
    </div>
  )
}