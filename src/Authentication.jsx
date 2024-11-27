import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { useState } from 'react';
import Logo from './assets/authentication-logo.png';
export function Authentication() {

  const [switchAuth, setSwitchAuth] = useState(false);
  
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white m-2 w-full sm:w-96 flex justify-center flex-col p-5 rounded-md border shadow">
        <img src={Logo} alt="" />
        <div className="w-full h-1 bg-gray-300 "></div>
        <div className="m-4"></div>
        <div className="whitespace-nowrap overflow-hidden">
          <SignIn className={`inline-block w-full transition-all duration-500 align-top ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
          <SignUp className={`inline-block w-full transition-all duration-500 ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
        </div>
      </div>
    </div>
  )
}