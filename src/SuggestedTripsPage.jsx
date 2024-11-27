import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { AddSuggestedTrip } from "./components/AddSuggestedTrip";
import { MdFmdGood } from "react-icons/md";
import { Button, Tooltip } from "flowbite-react";


export function SuggestedTripsPage({modalShow, setShowHero}) {
  const suggestedTrips = useLoaderData();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const handleClose = () => {
    setModalVisible(false);
  }

  const handleLogin = () => {
    modalShow();
    setShowHero(true);
  }

  return (
    <div className="mx-auto border-0">
      <br />
        <p className="text-4xl pb-2 text-white">Suggested Trips</p>
        <hr className="my-6"/>
        <div className="grid grid-cols-2 gap-6">
          {suggestedTrips.map(trip => (
            <div key={trip.id} className="border-0 shadow-lg w-full p-4 flex flex-col rounded-md bg-white">
              <div className="text-2xl pb-2 text-gray-600">
                {trip.title}
              </div>
              <div className="flex flex-row space-x-2 flex-grow border-0 mb-4">
                <div className="max-w-64 min-w-56 max-h-48">
                  <img src={trip.image_url} className="max-h-full"></img>
                </div>
                <div>
                  Points of Interest:
                  {trip.places.map(place => (
                    <div key={place.id} className="flex flex-row py-1" >
                      <div className="pt-1 pr-1">
                        <MdFmdGood />
                      </div>
                      <div className="flex flex-col">
                        <div>
                          {place.name}
                        </div>
                        <div className="text-xs">
                          {place.description.length < 105 ?
                            place.description
                              : 
                            <Tooltip content={place.description} placement="top" style="dark" className="max-w-screen-md">
                              {place.description.slice(0,105)}...
                            </Tooltip>
                          }                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-end flex-end">
                {localStorage.jwt === undefined ?
                <Tooltip content={`must be logged in to add Suggested Trips`} placement="top" style="dark" className="py-2 px-4">
                  <Button className="bg-blue-700 -px-4 -py-1 rounded-md text-white" type="button" onClick={()=>{handleLogin()}}>Add to Trips</Button>
                </Tooltip>
                :
                <Button className="bg-blue-700 -px-4 -py-1 rounded-md text-white" type="button" onClick={() => { setModalVisible(true); setCurrentTrip(trip)}}>Add to Trips</Button>
                }
              </div>
            </div>
          ))}
          </div>
          <Modal onClose={handleClose} show={modalVisible}>
            {currentTrip && <AddSuggestedTrip onClose={handleClose} trip={currentTrip}/>}
          </Modal>
    </div>
  );
}