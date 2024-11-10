// import { useNavigate } from "react-router-dom"
// import { LoginPage } from "./LoginPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { useState } from 'react';
export function TripsPage() {

  // const navigate = useNavigate();

  // const handleGoToIndex = () => {
  //   console.log("handleGoToIndex");
  //   navigate(`/trips`);
  // }
  const [switchAuth, setSwitchAuth] = useState(false);
  

  return (
    <div className="bg-blue-600 h-screen flex justify-center items-center">
      <div className="bg-white m-2 w-full sm:w-96 flex justify-center flex-col p-5 rounded-md">
        <h1 className="text-center mt-10 mb-10 text-3xl font-bold">Welcome!</h1>
        <div className="w-full h-1 bg-gray-300 "></div>
        <div className="m-6"></div>
    <div className="whitespace-nowrap overflow-hidden ">
          <SignIn className={`inline-block w-full transition-all duration-500 align-top ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
          <SignUp className={`inline-block w-full transition-all duration-500 ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
        </div>
      </div>
    </div>

    // <div className="bg-indigo-900 h-screen flex justify-center items-center">
    //   <div className="bg-white m-2 w-full sm:w-96 flex justify-center flex-col p-5">
    //     {/* <button className="w-full bg-blue-500 py-5 rounded-md text-white mb-10">
    //       Continue with Google
    //     </button> */}
    //     <div className="grid grid-cols-3 gap-2 mb-10">
    //       <div className="flex items-center">
    //         <span className="w-full h-1 bg-gray-300 block"></span>
    //       </div>
    //       <h1 className="text-center mt-10 mb-10 text-3xl font-bold">Welcome back!</h1>
    //       <div className="flex items-center">
    //         <span className="w-full h-1 bg-gray-300 block"></span>
    //       </div>
    //     </div>

    //     <div className="whitespace-nowrap overflow-hidden">
    //       <SignUp className={`inline-block w-full transition-all duration-1000 ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
    //       <SignIn className={`inline-block w-full transition-all duration-1000 align-top ${switchAuth ? "-translate-x-full" : "translate-x-0"}`} setSwitchAuth={setSwitchAuth}/>
    //     </div>
    //   </div>
    // </div>




    // <main>
    //   <h1>Welcome to TravelAde!</h1>
    //   <LoginPage />
    //   {/* <button onClick={()=>handleGoToIndex()}>Go to Trips</button> */}
    // </main>
  )
}