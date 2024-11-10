import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Label, TextInput, Datepicker } from "flowbite-react";


export function TripsCreatePage() {

  const navigate = useNavigate();
  
  const handleCreate = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    console.log(params);
    axios.post("http://localhost:3000/trips.json", params).then(response=> {
      console.log(response.data);
      navigate(`/trips/${response.data.id}`);
    });
  }

  return (

    <div>
      <h1 className='text-xl'>New Trip</h1>
      <hr className='my-4'/> 
      <form className="flex max-w-md flex-col gap-4" onSubmit={(event) => handleCreate(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Trip Title" />
          </div>
          <TextInput id="title" name="title" type="text" placeholder="title" shadow required />
        </div>
        
        <div className=' flex flex-row space-x-2'>
          <div>
            <Datepicker title="Arrive" name="start_time" />
          </div>
          <div>
            <Datepicker title="Depart" name="end_time" />
          </div>
        </div>
        
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image_url" value="URL of trip image" />
          </div>
          <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow required />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="w-1/2" type="submit">Submit</Button>
        </div>
      </form>

    </div>
  );
}