import Datepicker from "react-tailwindcss-datepicker";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from 'react'


export default function FlightHotelSearch() {
  const [value, setValue] = useState({ 
    startDate: null, 
    endDate: null
  });

  return (
    <div className="border-2 border-white pt-2 px-2 bg-white rounded-lg">
      <form className="flex max-w-4xl flex-row gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="departure" value="Departure" />
          </div>
          <TextInput id="departure" type="text" placeholder="Where from?" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="Destination" value="Destination" />
          </div>
          <TextInput id="Destination" type="text" placeholder="Where to?" required />
        </div>
        <div className="w-72">
          <div className="mb-2 block">
            <Label htmlFor="Dates" value="Dates" />
          </div>
          <Datepicker 
              value={value} 
              onChange={newValue => setValue(newValue)}
              /> 
        </div>
        <Button className="bg-blue-500 text-white mt-8 h-11 border-2 rounded-md'" type="submit">Search</Button>
      </form>
    </div>
  )
}