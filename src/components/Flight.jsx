
import { FaSuitcaseRolling } from "react-icons/fa";
import { FaSuitcase } from "react-icons/fa";

export function Flight({flight, onFlightSelect, selected}) {
  console.log("SINGLE FLIGHT: ", flight);
  console.log("SELECTED: " , selected);
  return (
    <div className="w-3/4 px-6 py-2 rounded-xl flex flex-row h-28 border-2 border-gray-200 mx-auto">
      <div id="flight times" className="w-4/5 border-0 border-red-500 flex flex-row items-center justify-evenly">
        <div className="">
          <img src={flight.airline_logo} alt="" className=" w-12 -ml-2"/>
        </div>
        <div className="-ml-2">
          <p className='mb-1'>
            {new Date(flight.flights[0].departure_airport.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(" ","")} - {new Date(flight.flights[0].arrival_airport.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(" ","")}
          </p>
          <span className="font-light text-sm">{flight.flights[0].airline} - {flight.flights[0].flight_number}</span>
        </div>
        <div className=" border-0 -mt-7 border-yellow-300">
          Nonstop
        </div>
        <div className="">
          <p className='mb-1'>
            {Math.floor(flight.flights[0].duration/60)}hr {flight.flights[0].duration%60}min
          </p>
          <span className="font-light text-sm">{flight.flights[0].departure_airport["id"]}-{flight.flights[0].arrival_airport["id"]}</span>
        </div>
        <div hidden={selected}>
          <button className="border-2 border-gray-400 rounded-3xl text-sm text-blue-600 flex-end px-4 py-2 shadow" onClick={()=>onFlightSelect(flight)}>Select flight</button>
        </div>
      </div>
      <div className='border-r-2 border-gray-400'></div>
      <div className="flex flex-col items-center justify-center w-1/5 border-0 border-blue-500">
        <div hidden={selected}>
          <p className="text-center">${flight.price}</p>
        </div>
        <div hidden={!selected}>
          <div className="flex flex-col ">
            <span className="mb-2">Baggage Info</span>
            <div className="flex flex-row border-0">
              <div className="h-4 mt-1">
                <FaSuitcase />
              </div>
              <span className="ml-2 font-light">1 free carry-on</span>
            </div>
            <div className="flex flex-row border-0">
              <div className="h-4 mt-1">
                <FaSuitcaseRolling />
              </div>
              <span className="ml-2 font-light">1st checked bag: $35</span>
            </div>
          </div>
        </div>

        {/* <div className='w-20 opacity-60' hidden={!returnSet}>
          <ProgressBar >
            <ProgressBar variant="success" now={30} key={1} />
            <ProgressBar variant="warning" now={40} key={2} />
            <ProgressBar variant="danger" now={30} key={3} />
          </ProgressBar>
        </div> */}
      </div>
    </div>
  )
}



