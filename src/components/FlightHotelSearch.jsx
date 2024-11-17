import Datepicker from "react-tailwindcss-datepicker";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export default function FlightHotelSearch() {
  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  const navigate = useNavigate();
  const [ searchDepartureResults, setSearchDepartureResults ] = useState({predictions: [{structured_formatting: ""}]});
  const [ searchDepartureInput, setSearchDepartureInput ] = useState("");
  const [ showDepartureAutocomplete, setShowDepartureAutocomplete ] = useState(false)
  const [ searchReturnResults, setSearchReturnResults ] = useState({predictions: [{structured_formatting: ""}]});
  const [ searchReturnInput, setSearchReturnInput ] = useState("");
  const [ showReturnAutocomplete, setShowReturnAutocomplete ] = useState(false)
  
  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());
    const engine = "google_flights";
    const departure_id = formObject.departure.slice(-4, -1);
    const arrival_id = formObject.destination.slice(-4, -1);
    const outbound_date = new Date(dates.startDate).toISOString().split('T')[0];
    const return_date = new Date(dates.endDate).toISOString().split('T')[0];

    axios.get("http://localhost:3001/search-flights", {
      params: {
        engine,
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
      },
    }).then(response => {
      console.log(response.data);
      navigate("/flights", { state: response.data });
    });
  }

  const handleTextChange = (text, depart) => {
    if (depart) {
      setSearchDepartureInput(text);
      setShowDepartureAutocomplete(text === "" ? false : true);
    } else {
      setSearchReturnInput(text);
      setShowReturnAutocomplete(text === "" ? false : true);
    }
    console.log("TEXT:", text);
    axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
      params: {
        input: text,
        radius: 500,
        types: "airport",
      },
    }).then(response=> {
      console.log(response.data);
      if (depart)
        setSearchDepartureResults(response.data);
      else
        setSearchReturnResults(response.data);
    });
  }

  const handleResultChoice = (choice, depart) => {
    if (depart) {
      setShowDepartureAutocomplete(false)
      setSearchDepartureInput(choice)
    } else {
      setShowReturnAutocomplete(false)
      setSearchReturnInput(choice)
    }
  }

  const SearchAutompleteList = ({depart}) => {
    return (
      <div id="autocomplete" 
      className="max-w-sm"
      style={{position: "absolute", zIndex: 1000, backgroundColor: "white", width: "100%",}}
      > 
        {
        depart ?
        
          showDepartureAutocomplete ?
            searchDepartureResults.predictions.map( (result,i) => (
              <p key={i} className="rounded-sm border-2 border-gray-400 text-sm p-2" onClick={() => handleResultChoice(result.structured_formatting.main_text, depart)}>{result.structured_formatting.main_text}</p>
            ))
            :
            <></>
          :
          showReturnAutocomplete ?
            searchReturnResults.predictions.map( (result,i) => (
              <p key={i} className="rounded-sm border-2 border-gray-400 text-sm p-2" onClick={() => handleResultChoice(result.structured_formatting.main_text, depart)}>{result.structured_formatting.main_text}</p>
            ))
            :
            <></>

        }
      </div>
    )
  }

  return (
    <div className="border-0 border-green-600 pt-1 px-2 bg-white rounded-lg">
      Check Flights
      <form className="flex max-w-4xl flex-row gap-4 mt-1" onSubmit={event => handleSearch(event)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="departure" value="Departure" />
          </div>
          <TextInput id="departure" name="departure" type="text" value={searchDepartureInput} placeholder="Where from?" required onChange={(event)=>handleTextChange(event.target.value, true)}/>
          <SearchAutompleteList depart={true}/>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="destination" value="Destination" />
          </div>
          <TextInput id="destination" name="destination" type="text" value={searchReturnInput} placeholder="Where to?" required onChange={(event)=>handleTextChange(event.target.value, false)}/>
          <SearchAutompleteList depart={false}/>
        </div>
        <div className="w-72">
          <div className="mb-2 block">
            <Label htmlFor="dates" value="Dates" />
          </div>
          <Datepicker 
              value={dates} 
              onChange={newValue => setDates(newValue)}
              /> 
        </div>
        <Button className="bg-blue-500 text-white mt-8 h-11 border-2 rounded-md'" type="submit">Search</Button>
      </form>
    </div>
  )
}