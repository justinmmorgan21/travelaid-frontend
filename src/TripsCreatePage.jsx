import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput } from "flowbite-react";
import Datepicker from "react-tailwindcss-datepicker";
import FlightHotelSearch from "./components/FlightHotelSearch";
import apiConfig from './apiConfig';

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
    if (params.get('image_url') === "") {
      const query = params.get("title");
      axios.get(`${apiConfig.proxyServerUrl}/get-image`, { params: {query} }).then(response => {
        const image_url = response.data.images_results[0].thumbnail;
        params.set('image_url', image_url)
        axios.post(`${apiConfig.backendBaseUrl}/trips.json`, params).then(response=> {
          navigate(`/trips/${response.data.id}`);
        });
      })
    } else {
      const url = params.get("image_url");
      isImgUrl(url).then(result => {
        if (result === true) {
          console.log("result: true");
          axios.post(`${apiConfig.backendBaseUrl}/trips.json`, params).then(response=> {
            navigate(`/trips/${response.data.id}`);
          });
        } else {
          console.log("result: false");
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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="image_url" value="URL of trip image" className='text-white'/>
            </div>
            <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}/>
          </div>
          <div className=' flex flex-row space-x-2'>
            <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
            <Button className="bg-blue-700 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>handleReset()}>Clear</Button>
          </div>
        </form>
        <div className="rounded-lg p-4 shadow-lg mx-auto w-fit h-fit bg-white" >
          <FlightHotelSearch />
        </div>
      </div>
    </div>
  );
}