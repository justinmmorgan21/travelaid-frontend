import { AdvancedMarker, APIProvider, Map, useMap, Pin } from "@vis.gl/react-google-maps";
import {useLoaderData} from "react-router-dom";
import { useState, useCallback } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
import axios from 'axios'
export function TripsShowPage() {
  
  let trip = useLoaderData();
  console.log("TRIP",trip);
  // const Poi = { key: string, location: google.maps.LatLngLiteral }
  const locations = trip.places.map((place, i) => {
    return {key: String.fromCharCode(65+i), location: { lat: place.lat, lng: place.lng } }
  })
  console.log("LOCATIONS",locations)
  // const locations = 
  // [
  //   { key: 'A', location: { lat: -33.8567844, lng: 151.213108 } },
  //   { key: 'B', location: { lat: -33.8472767, lng: 151.2188164 } },
  //   { key: 'C', location: { lat: -33.8209738, lng: 151.2563253 } },
  //   { key: 'D', location: { lat: -33.8690081, lng: 151.2052393 } }
  // ];
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
    axios.get(`http://localhost:3000/trips/${params.id}.json`).then(response => {
      trip = response.data;
      window.location.href = `/trips/${trip.id}`;
    })
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
      <div className='absolute top-20 left-1/3 z-10 ml-16 -mr-16 border-2 rounded-lg border-gray-500'>
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
      <p className="my-6 text-lg">Dates: &nbsp; {trip.start_time}  &nbsp; to &nbsp;  {trip.end_time}</p>
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
                {place.start_time}
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