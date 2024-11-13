import SplashImage from './assets/TravelAid.svg';
import FlightHotelSearch from "./components/FlightHotelSearch";
export function Hero({ modalShow }) {
  return (
    <div className='relative'>
      <img src={SplashImage} className="w-full" alt="Splash Screen Image" />
      <div className='absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
        <FlightHotelSearch />
      </div>
      <button className='absolute top-1/2 transform -translate-y-1/2 translate-x-3/4 left-1/2 z-10 text-black px-8 py-3 text-lg font-bold border-2 border-gray-500 bg-white rounded-md' onClick={()=>modalShow()}>Sign in</button>
    </div>
  )
}