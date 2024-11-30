import SplashImage2 from './assets/clouds-4k-for-pc-in-hd-wallpaper-preview.jpg';
import Logo from './assets/hero-image.png';
import FlightHotelSearch from "./components/FlightHotelSearch";

export function Hero({ modalShow, setShowHero }) {
  return (
    <div className='relative'>
      <img src={SplashImage2} className="w-full" alt="Splash Screen Image" />
      <img src={Logo} className="absolute top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1/5" alt="Logo Image" />
      <div className='absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-md'>
        <FlightHotelSearch setShowHero={setShowHero}/>
      </div>
      <button className='absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 left-1/2 z-10 px-8 py-2 text-lg bg-white rounded-md text-gray-600 shadow-xl' onClick={()=>modalShow()}>Sign in</button>
    </div>
  )
}