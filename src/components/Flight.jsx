
import { FaSuitcaseRolling } from "react-icons/fa";
import { FaSuitcase } from "react-icons/fa";
import { Accordion, Timeline } from "flowbite-react";
import { LuDot } from "react-icons/lu";

export function Flight({flight, onFlightSelect, selected, bothFlights, isDeparting}) {
  
  const convert_string_time = dateTime => {
    const date = new Date(dateTime);
    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // Determine AM or PM
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convert to 12-hour format, with 12 as the fallback for 0
    // Format the time
    return `${hours}:${minutes}${period}`;
  }

  return (
    <div>
      { flight.flights.length == 1 ?
          <div className="w-3/4 px-6 py-2 rounded-xl flex flex-row h-24 border-2 border-gray-200 mx-auto bg-white">
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
                <button className="border-2 border-gray-400 rounded-3xl text-sm text-blue-700 flex-end px-4 py-2 shadow" onClick={()=>onFlightSelect(flight)}>Select flight</button>
              </div>
            </div>
            <div className='border-r-2 border-gray-400'></div>
            <div className="flex flex-col items-center justify-center w-1/5 border-0 border-blue-500">
              <div hidden={selected}>
                <p className="text-center text-xl font-bold text-gray-600">${flight.price}</p>
              </div>
              <div hidden={!selected}>
                { selected && bothFlights && bothFlights.baggage_prices && bothFlights.baggage_prices.together ?
                  <div>
                    { isDeparting ?
                      <div className="flex flex-col ">
                        <span className="mb-2">Baggage Info</span>
                        <div className="flex flex-row border-0 text-gray-700">
                          <div className="h-4 mt-1 text-gray-700">
                            <FaSuitcase />
                          </div>
                          <span className="ml-2 font-light text-gray-700">{bothFlights.baggage_prices ? bothFlights.baggage_prices.together[0] : `N/A`}</span>
                        </div>
                        <div className="flex flex-row border-0 text-gray-700">
                          <div className="h-4 mt-1 text-gray-700">
                            <FaSuitcaseRolling />
                          </div>
                          <span className="ml-2 font-light text-gray-700">{`1st checked bag: $${bothFlights.baggage_prices ? bothFlights.baggage_prices.together[1].slice(bothFlights.baggage_prices.together[1].lastIndexOf(" ")+1) : `N/A`}`}</span>
                        </div>
                      </div>
                      :
                      null
                    }
                  </div>
                :
                <div>
                {selected && isDeparting && bothFlights? 
                  <div className="flex flex-col ">
                    <span className="mb-2">Baggage Info</span>
                    <div className="flex flex-row border-0 text-gray-700">
                      <div className="h-4 mt-1 text-gray-700">
                        <FaSuitcase />
                      </div>
                      <span className="ml-2 font-light text-gray-700">{bothFlights.baggage_prices ? bothFlights.baggage_prices.departing[0] : `N/A`}</span>
                    </div>
                    <div className="flex flex-row border-0 text-gray-700">
                      <div className="h-4 mt-1 text-gray-700">
                        <FaSuitcaseRolling />
                      </div>
                      <span className="ml-2 font-light text-gray-700">{`1st checked bag: $${bothFlights.baggage_prices ? bothFlights.baggage_prices.departing[1].slice(bothFlights.baggage_prices.departing[1].lastIndexOf(" ")+1) : `N/A`}`}</span>
                    </div>
                  </div>
                  :
                  <div className="flex flex-col ">
                    <span className="mb-2">Baggage Info</span>
                    <div className="flex flex-row border-0 text-gray-700">
                      <div className="h-4 mt-1 text-gray-700">
                        <FaSuitcase />
                      </div>
                      <span className="ml-2 font-light text-gray-700">{selected && bothFlights && bothFlights.baggage_prices ? bothFlights.baggage_prices.returning[0] : `N/A`}</span>
                    </div>
                    <div className="flex flex-row border-0 text-gray-700">
                      <div className="h-4 mt-1 text-gray-700">
                        <FaSuitcaseRolling />
                      </div>
                      <span className="ml-2 font-light text-gray-700">{selected && bothFlights && `1st checked bag: $${bothFlights.baggage_prices ? bothFlights.baggage_prices.returning[1].slice(bothFlights.baggage_prices.returning[1].lastIndexOf(" ")+1) : `N/A`}`}</span>
                    </div>
                  </div>

                }
                </div>
              }
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

        :

          <Accordion collapseAll className="bg-white w-3/4 mx-auto h-auto border-2">
            <Accordion.Panel className="bg-white">
              <Accordion.Title className="border-0 border-red-500 bg-white">
                <div className="rounded-xl w-full flex flex-row items-center border-0 border-blue-200 -my-4 py-2 mx-auto bg-white">
                  <div className="w-5/6 border-0 border-green-500 flex flex-row items-center justify-evenly px-16 -ml-1 h-16">

                    <div className="">
                      <img src={flight.airline_logo} alt="" className=" w-12"/>
                    </div>
                    <div className="className='mb-1 w-56 ml-14">
                        <p className=''>
                          {new Date(flight.flights[0].departure_airport.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(" ","")} - {new Date(flight.flights[flight.flights.length-1].arrival_airport.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(" ","")}
                        </p>
                        <span className="font-light text-sm">{flight.flights[0].airline} - {flight.flights[0].flight_number}</span>
                      </div>
                      <div className=" border-0 -mt-7 ml-2 border-yellow-300">
                        <span className="flex flex-row w-24">
                          {flight.flights.length - 1} stop{flight.flights.length > 2 ? 's':''}
                        </span>
                      </div>
                      <div className="w-40 ml-6 mr-2">
                        <p className=''>
                          {Math.floor((flight.flights.reduce((acc, nextFlight) => acc += nextFlight.duration, 0) + flight.layovers.reduce((acc, nextLayover) => acc += nextLayover.duration, 0) )/ 60)}hr {(flight.flights.reduce((acc, nextFlight) => acc += nextFlight.duration, 0) + flight.layovers.reduce((acc, nextLayover) => acc += nextLayover.duration, 0)) % 60}min
                        </p>
                        <span className="font-light text-sm">{flight.flights[0].departure_airport["id"]}-{flight.flights[flight.flights.length - 1].arrival_airport["id"]}</span>
                      </div>
                      <div hidden={selected}>
                       <button className="border-2 border-gray-400 rounded-3xl text-sm text-blue-700 flex-end py-2 shadow w-28 " onClick={()=>onFlightSelect(flight)}>Select flight</button>
                      </div>
                  </div>
                  <div className='border-r-2 border-gray-400 -ml-2 h-20'></div>
                  <div className="flex flex-col items-center justify-center w-1/6 border-0 border-blue-500">
                    <div hidden={selected} className="border-0">
                      <p className="text-xl font-bold text-gray-600 ml-8">${flight.price}</p>
                    </div>
                    <div hidden={!selected}>
                      { selected && bothFlights && bothFlights.baggage_prices && bothFlights.baggage_prices.together ?  
                          <div className="border-0 border-green-500 pl-2 -pr-6">
                            { isDeparting ?
                                <div className="flex flex-col border-0 border-red-500 ">
                                  <span className="mb-2">Baggage Info</span>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcase />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{bothFlights.baggage_prices.together[0]}</span>
                                  </div>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcaseRolling />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{`1st checked bag: ${bothFlights.baggage_prices.together[1].slice(bothFlights.baggage_prices.together[1].lastIndexOf(" ")+1) != 'free' ? '$' : ' '}${bothFlights.baggage_prices.together[1].slice(bothFlights.baggage_prices.together[1].lastIndexOf(" ")+1)}`}</span>
                                  </div>
                                </div>
                              :
                                <div className="border-0 border-red-500 ml-44"></div>
                            }
                          </div>
                        :
                          <div>
                            {selected && isDeparting && bothFlights? 
                                <div className="flex flex-col ">
                                  <span className="mb-2">Baggage Info</span>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcase />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{bothFlights.baggage_prices ? bothFlights.baggage_prices.departing[0] : `N/A`}</span>
                                  </div>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcaseRolling />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{`1st checked bag: $${bothFlights.baggage_prices ? bothFlights.baggage_prices.departing[1].slice(bothFlights.baggage_prices.departing[1].lastIndexOf(" ")+1) : `N/A`}`}</span>
                                  </div>
                                </div>
                              :
                                <div className="flex flex-col ">
                                  <span className="mb-2">Baggage Info</span>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcase />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{selected && bothFlights && bothFlights.baggage_prices ? bothFlights.baggage_prices.returning[0] : `N/A`}</span>
                                  </div>
                                  <div className="flex flex-row border-0 text-gray-700">
                                    <div className="h-4 mt-1 text-gray-700">
                                      <FaSuitcaseRolling />
                                    </div>
                                    <span className="ml-2 font-light text-gray-700">{selected && bothFlights && `1st checked bag: $${bothFlights.baggage_prices ? bothFlights.baggage_prices.returning[1].slice(bothFlights.baggage_prices.returning[1].lastIndexOf(" ")+1) : `N/A`}`}</span>
                                  </div>
                                </div>

                            }
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </Accordion.Title>
                <Accordion.Content >
                  <div className="ml-32">
                  { flight.flights.map((oneLeg, i) => (
                    <div key={i}>
                      <Timeline>
                        <Timeline.Item>
                          <Timeline.Point />
                          <Timeline.Content>
                            <Timeline.Time></Timeline.Time>
                            <div className="flex flex-row">
                              <Timeline.Title className="mb-2 flex flex-row">{convert_string_time(oneLeg.departure_airport.time)}<LuDot className="mt-1"/> {oneLeg.departure_airport.name} ({oneLeg.departure_airport.id})</Timeline.Title>
                            </div>
                            <Timeline.Body>
                              Travel time: {Math.floor(oneLeg.duration/60)}hr {oneLeg.duration%60}min
                            </Timeline.Body>
                          </Timeline.Content>
                        </Timeline.Item>
                        <Timeline.Item className="-mt-6">
                          <Timeline.Point />
                          <Timeline.Content>
                            <Timeline.Time></Timeline.Time>
                            <Timeline.Title className=" flex flex-row">{convert_string_time(oneLeg.arrival_airport.time)}<LuDot className="mt-1"/> {oneLeg.arrival_airport.name} ({oneLeg.arrival_airport.id})</Timeline.Title>
                            <Timeline.Body></Timeline.Body>
                          </Timeline.Content>
                        </Timeline.Item>
                      </Timeline>
                      { i != flight.flights.length - 1 ?
                        <div className="-mt-2 mb-4 ml-4">
                          <hr />
                            <div className="my-3 ml-2 flex flex-row">
                            {Math.floor(flight.layovers[0].duration/60)}hr {flight.layovers[0].duration%60}min layover <LuDot className="mt-1"/> {oneLeg.arrival_airport.name.slice(0, oneLeg.arrival_airport.name.indexOf(" "))} ({oneLeg.arrival_airport.id})
                            </div>
                          <hr />
                        </div>
                        :
                        null
                      }
                    </div>
                  ))}
                </div>
                </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
      }
    </div>
  )
}