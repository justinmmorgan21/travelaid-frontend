import { AdvancedMarker, APIProvider, Map, useMap, Pin } from "@vis.gl/react-google-maps";
import {useLoaderData} from "react-router-dom";
import { useState, useCallback } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
export function TripsShowPage() {
  
  let trip = useLoaderData();
  console.log("TRIP",trip);
  const locations = trip.places.map((place, i) => {
    return {key: String.fromCharCode(65+i), location: { lat: place.lat, lng: place.lng } }
  })
  console.log("LOCATIONS",locations)
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  const PoiMarkers = ({ pois }) => {
    const map = useMap();
    const handleClick = useCallback((ev) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log('marker clicked:', ev.latLng.toString());
      map.panTo(ev.latLng);
    })
  
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
    <div>
      <div className='absolute top-16 left-1/2 transform -translate-x-1/2 z-10 ml-16 -mr-16 border-2 rounded-lg border-gray-500'>
        <FlightHotelSearch />
      </div>
      <a className="underline" href="/trips">{'<'}- back to Upcoming Trips</a>
      <h1 className="text-4xl my-6">{trip.title}</h1>
      <div className="flex flex-row w-full space-x-6">

        <img className="h-80" src={trip.image_url} />
        <div className="w-96 h-80">

          <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded')}>
            <Map
              defaultZoom={trip.initial_zoom}
              defaultCenter={{ lat: trip.center[0], lng: trip.center[1] }}
              mapId='97aaa7a8b424bee5'
              onCameraChanged={(ev) =>
                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
              }>
              <PoiMarkers pois={locations} />
            </Map>
          </APIProvider>
        </div>
      </div>
      {
        trip.start_time ? 
          <p className="my-2">{trip.start_time || "No Date Set"} {` to `} {trip.end_time || "No Date Set"}</p>
            :
          <p>No Date Set</p>
      }
      <hr />
      <h2 className="mt-6 text-lg">Itinerary:</h2>
      <br />
      <Accordion collapseAll>
        {trip.places.map((place, i) => (
          <Accordion.Panel key={place.id}>
            <Accordion.Title className="flex flex-row">
              <span className="pr-4">
                {locations[i].key}.
              </span>
              <span className="pr-16 font-bold text-gray-700">
                {place.name}  
              </span>
              <span className="">
                { place.start_time ? place.start_time : "No Date Set" }
              </span>
            </Accordion.Title>
            <Accordion.Content>
              <div className="flex flex-row">
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

      <button className="bg-blue-500 px-4 py-1 rounded text-white my-12" onClick={()=>handleModalShow()}>Add a Place to your Itinerary</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <PlacesCreate onClose={handleClose} trip={trip}/>
      </Modal>
    </div>
  );
}