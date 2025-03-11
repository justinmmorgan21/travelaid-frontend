import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";
import FlightHotelSearch from "./components/FlightHotelSearch";
import apiConfig from './apiConfig';
import { ImagePickerModal } from './ImagePickerModal';
import { TripImagePicker } from "./components/TripImagePicker";

export function TripsCreatePage() {

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  function isImgUrl(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
    });
  }
  
  const handleCreate = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.append('start_time', dates.startDate);
    params.append('end_time', dates.endDate);
    if (imageUrl === "") {
      const query = params.get("title");
      axios.get(`${apiConfig.proxyServerUrl}/get-image`, { params: {query} }).then(response => {
        const image_url = response.data.images_results[0].thumbnail;
        params.set('image_url', image_url)
        axios.post(`${apiConfig.backendBaseUrl}/trips.json`, params).then(response=> {
          navigate(`/trips/${response.data.id}`);
        });
      })
    } else {;
      isImgUrl(imageUrl).then(result => {
        if (result === true) {
          params.set('image_url', imageUrl)
          axios.post(`${apiConfig.backendBaseUrl}/trips.json`, params).then(response=> {
            navigate(`/trips/${response.data.id}`);
          });
        } else {
          const query = params.get("title");
          axios.get(`${apiConfig.proxyServerUrl}/get-image`, { params: {query} }).then(response => {
            const image_url = response.data.images_results[0].thumbnail;
            params.set('image_url', image_url)
            axios.post(`${apiConfig.backendBaseUrl}/trips.json`, params).then(response=> {
              navigate(`/trips/${response.data.id}`);
            });
          })
        }
      });
    }
  }

  const handleReset = () => {
    setTitle('');
    setDates({ 
      startDate: null, 
      endDate: null
    });
    setImageUrl('');
  };

  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  const [tripImagePickerModalVisible, setTripImagePickerModalVisible] = useState(false);
  const handleTripImagePickerResult = (url) => {
    setImageUrl(url)
    setTripImagePickerModalVisible(false);
  }
  const handleTripImagePickerClose = () => {
    setTripImagePickerModalVisible(false);
  }

  return (
    <div className='h-screen'>
      <br />
      <h1 className='text-4xl text-white'>New Trip</h1>
      <hr className='my-4'/>
      <div className='flex flex-row'>
        <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleCreate(event)}>
          <div>
            <div className="mb-2 block ">
              <Label htmlFor="title" value="Trip Title" className='text-white'/>
            </div>
            <TextInput id="title" name="title" type="text" placeholder="title" shadow required value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className=' flex flex-row space-x-2'>
            <Datepicker 
              value={dates} 
              onChange={newValue => setDates(newValue)}
              />
          </div>
          {imageUrl && <div>
            <img src={imageUrl} alt="Chosen trip image" />
          </div>}
          <Button className="bg-blue-700 px-2 py-0 rounded-md text-white" onClick={()=>{setTripImagePickerModalVisible(true)}}>{imageUrl ? "Change Image" : "Choose Image"}</Button>
          <div className=' flex flex-row space-x-2'>
            <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
            <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>handleReset()}>Clear</Button>
          </div>
        </form>
        <div className="rounded-lg p-4 shadow-lg mx-auto w-fit h-fit bg-white" >
          <FlightHotelSearch />
        </div>
      </div>
      <ImagePickerModal onClose={handleTripImagePickerClose} show={tripImagePickerModalVisible} >
        <TripImagePicker onClose={handleTripImagePickerClose} onResult={handleTripImagePickerResult} title={title}/>
      </ImagePickerModal>
    </div>
  );
}