import { AdvancedMarker, APIProvider, Map, useMap, Pin } from "@vis.gl/react-google-maps";
import {useLoaderData, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion, Timeline } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
import axios from "axios";
import { UpdateTrip } from "./components/UpdateTrip";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { PlacesUpdate } from "./PlacesUpdate";
import { LuDot } from "react-icons/lu";

export function TripsShowPage() {
  const trip = useLoaderData();
  const navigate = useNavigate();
  const [placeToEdit, setPlaceToEdit] = useState(null);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  const fetchDefaultCenter = useCallback(() => {
    axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
      params: {
        input: trip.title,
      },
    }).then(response=> {
      axios.get("http://127.0.0.1:3001/google-places-details", {
        params: {
          place_id: response.data.predictions[0].place_id,
        },
      }).then(resp => {
        setCoords(resp.data.result.geometry.location)
        useMap.panTo(coords)
      })
    });
  }, [trip, coords]);

  useEffect(() => {
    if (trip.places.length === 0) {
      fetchDefaultCenter();
    }
  }, [trip.places, fetchDefaultCenter]);

  const locations = trip.places.map((place, i) => {
    return {key: String.fromCharCode(65+i), location: { lat: place.lat, lng: place.lng } }
  })
  
  const [placesCreateModalVisible, setPlacesCreateModalVisible] = useState(false);
  const handlePlacesCreateModalShow = () => {
    setPlacesCreateModalVisible(true);
  }
  const handlePlacesCreateClose = () => {
    setPlacesCreateModalVisible(false);
  }

  const [tripUpdateModalVisible, setTripUpdateModalVisible] = useState(false);
  const handleTripUpdateModalShow = () => {
    setTripUpdateModalVisible(true);
  }
  const handleTripUpdateClose = () => {
    setTripUpdateModalVisible(false);
  }
  
  const [placeUpdateModalVisible, setPlaceUpdateModalVisible] = useState(false);
  const handlePlaceUpdateModalShow = (place) => {
    setPlaceToEdit(place)
    setPlaceUpdateModalVisible(true);
  }
  const handlePlaceUpdateClose = () => {
    setPlaceUpdateModalVisible(false);
  }

  const handleDeletePlace = (place) => {
    axios.delete(`http://localhost:3000/places/${place.id}.json`).then(() => {
      navigate(`/trips/${trip.id}`);
    })
  }

  const PoiMarkers = ({ pois }) => {
    const map = useMap();
    const handleClick = useCallback((ev) => {
      if (!map) return;
      if (!ev.latLng) return;
      map.panTo(ev.latLng);
    }, [map])
  
    return (
      <>
        {pois.map((poi) => (
          <AdvancedMarker
            key={poi.key}
            title={poi.key}
            position={poi.location}
            clickable={true}
            onClick={handleClick}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} glyph={poi.key} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-4/5 items-center py-1">
        <a className="underline text-white" href="/trips">{'<'}- back to Upcoming Trips</a>
        <h1 className="text-4xl mt-6 mb-3 text-white">{trip.title}</h1>
      </div>
      {trip.flight_booked ? (
        <div className="flex flex-col items-center mb-2 space-y-1">
          <p className="text-white font-bold">Booked Flights</p>
          {/* DEPARTING flight */}
          <div className="border-2 border-gray-300 flex flex-row justify-evenly rounded-md bg-white w-4/5">
            {trip.flights[0].legs.length == 1 ? (
              <div className="flex flex-row justify-evenly w-full py-1">
                <p className="-mx-12">Departing Flight</p>
                <img className="h-12" src={trip.flights[0].legs[0].airline_logo} alt="" />
                <div>
                  <div className="flex flex-row">
                    {trip.flights[0].legs[0].departure_day} <LuDot className="mt-1 mx-1" /> {trip.flights[0].legs[0].departure_airport_time} - {trip.flights[0].legs[trip.flights[0].legs.length-1].arrival_airport_time}
                  </div>
                  <p className="font-light text-sm">{trip.flights[0].legs[0].airline}</p>
                </div>
                <div>
                  {trip.flights[0].total_duration}
                  <div className="flex flex-row text-sm font-light">
                    {trip.flights[0].legs[0].departure_airport_id} - {trip.flights[0].legs[trip.flights[0].legs.length-1].arrival_airport_id}
                  </div>
                </div>
                <div>
                  <p>nonstop</p>
                </div>
              </div>
            ) : (
              <Accordion collapseAll className="bg-white w-full mx-auto h-auto">
                <Accordion.Panel className="bg-white w-full">
                  <Accordion.Title className="bg-white w-full">
                    <div className="flex flex-row py-1 ">
                      <p className="">Departing Flight</p>
                      <img className="h-12 mx-16" src={trip.flights[0].legs[0].airline_logo} alt="" />
                      <div>
                        <div className="flex flex-row">
                          {trip.flights[0].legs[0].departure_day} <LuDot className="mt-1 mx-1" /> {trip.flights[0].legs[0].departure_airport_time} - {trip.flights[0].legs[trip.flights[0].legs.length-1].arrival_airport_time}
                        </div>
                        <p className="font-light text-sm">{trip.flights[0].legs[0].airline}</p>
                      </div>
                      <div className="mx-16">
                        {trip.flights[0].total_duration}
                        <div className="flex flex-row text-sm font-light">
                          {trip.flights[0].legs[0].departure_airport_id} - {trip.flights[0].legs[trip.flights[0].legs.length-1].arrival_airport_id}
                        </div>
                      </div>
                      <div>
                        <p>{trip.flights[0].legs.length - 1} stop{trip.flights[0].legs.length > 2 ? 's':''}</p>
                        <div>
                          {trip.flights[0].layovers.map(layover => (
                            <p key={layover.id} className="text-sm font-light">{layover.duration} &nbsp; {layover.airport_city}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Accordion.Title>
                  <Accordion.Content >
                    <div className="ml-32">
                      {trip.flights[0].legs.map((oneLeg, i) => (
                      <div key={i}>
                        <Timeline>
                          <Timeline.Item>
                            <Timeline.Point />
                            <Timeline.Content>
                              <Timeline.Time></Timeline.Time>
                              <div className="flex flex-row">
                                <Timeline.Title className="mb-2 flex flex-row">{oneLeg.departure_airport_time}<LuDot className="mt-1"/> {oneLeg.departure_airport_name} ({oneLeg.departure_airport_id})</Timeline.Title>
                              </div>
                              <Timeline.Body>
                                Travel time: {oneLeg.duration}
                              </Timeline.Body>
                            </Timeline.Content>
                          </Timeline.Item>
                          <Timeline.Item className="-mt-6">
                            <Timeline.Point />
                            <Timeline.Content>
                              <Timeline.Time></Timeline.Time>
                              <Timeline.Title className=" flex flex-row">{oneLeg.arrival_airport_time}<LuDot className="mt-1"/> {oneLeg.arrival_airport_name} ({oneLeg.arrival_airport_id})</Timeline.Title>
                              <Timeline.Body></Timeline.Body>
                            </Timeline.Content>
                          </Timeline.Item>
                        </Timeline>
                        { i != trip.flights.length - 1 &&
                          <div className="-mt-2 mb-4 ml-4">
                            <hr />
                            <div className="my-3 ml-2 flex flex-row">
                              {trip.flights[0].layovers[i].duration} layover <LuDot className="mt-1"/> {oneLeg.arrival_airport_name.slice(0, oneLeg.arrival_airport_name.indexOf(" "))} ({oneLeg.arrival_airport_id})
                            </div>
                            <hr />
                          </div>
                        }
                      </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            )}
          </div>
          {/* RETURN flight */}
          <div className="border-2 border-gray-300 flex flex-row justify-evenly rounded-md bg-white w-4/5">
            {trip.flights[1].legs.length == 1 ? (
            <div className="flex flex-row justify-evenly w-full py-1">
              <p className="-mx-12">Returning Flight</p>
              <img className="h-12" src={trip.flights[1].legs[0].airline_logo} alt="" />
              <div>
                <div className="flex flex-row">
                  {trip.flights[1].legs[trip.flights[1].legs.length-1].arrival_day} <LuDot className="mt-1 mx-1" /> {trip.flights[1].legs[0].departure_airport_time} - {trip.flights[1].legs[trip.flights[1].legs.length-1].arrival_airport_time}
                </div>
                <p className="font-light text-sm">{trip.flights[1].legs[0].airline}</p>
              </div>
              <div>
                {trip.flights[1].total_duration}
                <div className="flex flex-row text-sm font-light">
                  {trip.flights[1].legs[0].departure_airport_id} - {trip.flights[1].legs[trip.flights[1].legs.length-1].arrival_airport_id}
                </div>
              </div>
              <div>
                <p>nonstop</p>
              </div>
            </div>
            ) : (
              <Accordion collapseAll className="bg-white w-full mx-auto h-auto border-2">
                <Accordion.Panel className="bg-white">
                  <Accordion.Title className="bg-white">
                    <div className="flex flex-row py-1 ">
                      <p className="">Returning Flight</p>
                      <img className="h-12 mx-16" src={trip.flights[1].legs[0].airline_logo} alt="" />
                      <div>
                        <div className="flex flex-row">
                          {trip.flights[1].legs[0].departure_day} <LuDot className="mt-1 mx-1" /> {trip.flights[1].legs[0].departure_airport_time} - {trip.flights[1].legs[trip.flights[1].legs.length-1].arrival_airport_time}
                        </div>
                        <p className="font-light text-sm">{trip.flights[1].legs[0].airline}</p>
                      </div>
                      <div className="mx-16">
                        {trip.flights[1].total_duration}
                        <div className="flex flex-row text-sm font-light">
                          {trip.flights[1].legs[0].departure_airport_id} - {trip.flights[1].legs[trip.flights[1].legs.length-1].arrival_airport_id}
                        </div>
                      </div>
                      <div>
                        <p>{trip.flights[1].legs.length - 1} stop{trip.flights[1].legs.length > 2 ? 's':''}</p>
                        <div>
                          {trip.flights[1].layovers.map(layover => (
                            <p key={layover.id} className="text-sm font-light">{layover.duration} &nbsp; {layover.airport_city}</p>
                          ))}
                        </div>
                      </div>
                    </div>  
                  </Accordion.Title>
                  <Accordion.Content >
                    <div className="ml-32">
                      {trip.flights[1].legs.map((oneLeg, i) => (
                      <div key={i}>
                        <Timeline>
                          <Timeline.Item>
                            <Timeline.Point />
                            <Timeline.Content>
                              <Timeline.Time></Timeline.Time>
                              <div className="flex flex-row">
                                <Timeline.Title className="mb-2 flex flex-row">{oneLeg.departure_airport_time}<LuDot className="mt-1"/> {oneLeg.departure_airport_name} ({oneLeg.departure_airport_id})</Timeline.Title>
                              </div>
                              <Timeline.Body>
                                Travel time: {oneLeg.duration}
                              </Timeline.Body>
                            </Timeline.Content>
                          </Timeline.Item>
                          <Timeline.Item className="-mt-6">
                            <Timeline.Point />
                            <Timeline.Content>
                              <Timeline.Time></Timeline.Time>
                              <Timeline.Title className=" flex flex-row">{oneLeg.arrival_airport_time}<LuDot className="mt-1"/> {oneLeg.arrival_airport_name} ({oneLeg.arrival_airport_id})</Timeline.Title>
                              <Timeline.Body></Timeline.Body>
                            </Timeline.Content>
                          </Timeline.Item>
                        </Timeline>
                        { i != trip.flights.length - 1 &&
                          <div className="-mt-2 mb-4 ml-4">
                            <hr />
                            <div className="my-3 ml-2 flex flex-row">
                              {trip.flights[1].layovers[i].duration} layover <LuDot className="mt-1"/> {oneLeg.arrival_airport_name.slice(0, oneLeg.arrival_airport_name.indexOf(" "))} ({oneLeg.arrival_airport_id})
                            </div>
                            <hr />
                          </div>
                        }
                      </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            )}
          </div>
        </div>
      ) : (
        <div className=' p-2 mx-auto w-4/5 bg-white rounded-lg'>
          <FlightHotelSearch destinationTitle={trip.title} />
        </div>
      )}
      <div className="mx-auto w-4/5 items-center pt-1">
        <div className="bg-white w-full">
          <div className="bg-white p-4 w-fit">
            <div className="flex flex-row w-full space-x-6">
              <img className="h-80" src={trip.image_url} />
              <div className="w-96 h-80">
                <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded')}>
                  <Map
                    defaultZoom={trip.places.length != 0 ? trip.initial_zoom : 10}
                    defaultCenter={ { lat: trip.center[0] , lng: trip.center[1] } }
                      mapId='97aaa7a8b424bee5'
                  >
                    <PoiMarkers pois={locations} />
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <div className="mt-1">
                {trip.start_time ? (
                  <p className="my-2 text-lg text-gray-700">Dates:  
                    {` ${trip.start_time.slice(0,3)+' '+trip.start_time.slice(trip.start_time.indexOf(' '))} to 
                        ${trip.end_time.slice(0,3)+' '+trip.end_time.slice(trip.end_time.indexOf(' '))}`}
                  </p>
                ) : (
                  <p>No Date Set</p>
                )}
              </div>
              <button className="bg-blue-700 px-4 h-8 mt-2 rounded text-white" onClick={()=>handleTripUpdateModalShow()}>Edit Trip</button>
            </div>
          </div>
          <hr className="mx-4 -my-2"/>
          <h2 className="mt-8 ml-4 text-lg text-gray-700">Itinerary</h2>
          <br />
          <div className="mx-4">
            <Accordion collapseAll className="w-full shadow-md rounded-md">
              {trip.places.map((place, i) => (
                <Accordion.Panel open key={place.id}>
                  <Accordion.Title>
                    <div className="flex flex-row w-[950px]">
                      <span className="pr-4">
                        {locations[i].key}.
                      </span>
                      <span className="font-bold text-gray-700 w-1/3">
                        {place.name}  
                      </span>
                      <div className="flex-auto flex flex-row ">
                        <span className="text-gray-700">
                          { place.start_time ? place.start_time : "No Date Set" }
                        </span>
                        <button className="rounded-3xl px-2 mx-3 border-2 border-gray-300 bg-gray-200 text-black text-sm font-light -px-24  flex-initial" onClick={()=>handlePlaceUpdateModalShow(place)}>change</button>
                      </div>
                      <button className="text-gray-700 flex-initial mr-4" onClick={()=>handleDeletePlace(place)}><RiDeleteBin5Fill /></button>
                    </div>
                    <Modal onClose={handlePlaceUpdateClose} show={placeUpdateModalVisible}>
                      <PlacesUpdate onClose={handlePlaceUpdateClose} place={placeToEdit} trip={trip}/>
                    </Modal>
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className="flex flex-row bg-white">
                      <img className="w-36 mr-16" src={place.image_url} alt="" />
                      <div>
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          {place.address}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </div>
          <button className="bg-blue-700 ml-4 px-4 py-1 rounded text-white mt-4 mb-12" onClick={()=>handlePlacesCreateModalShow()}>Add a Point of Interest</button>
        </div>
        <Modal onClose={handlePlacesCreateClose} show={placesCreateModalVisible}>
          <PlacesCreate onClose={handlePlacesCreateClose} trip={trip}/>
        </Modal>
        <Modal onClose={handleTripUpdateClose} show={tripUpdateModalVisible}>
          <UpdateTrip onClose={handleTripUpdateClose} trip={trip}/>
        </Modal>
      </div>
    </div>
  );
}