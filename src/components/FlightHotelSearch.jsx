import Datepicker from "react-tailwindcss-datepicker";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useGeoLocation } from 'use-geo-location';

export default function FlightHotelSearch({destinationTitle}) {
  // text -> airport string w (DAL) at end
  // computer lat/lng -> to get same

  // destinationLocation lat / lng -> to get same

  console.log("FHS loc: ", destinationTitle);
  // console.log("FHS lng: ", lng);

  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });

  const inputDepartRef = useRef(null);
  const handleDepartFocus = () => {
    inputDepartRef.current.select();
  }
  const inputReturnRef = useRef(null);
  const handleReturnFocus = () => {
    inputReturnRef.current.select();
  }

  const navigate = useNavigate();
  const [ searchDepartureResults, setSearchDepartureResults ] = useState({predictions: [{structured_formatting: ""}]});
  const [ searchDepartureInput, setSearchDepartureInput ] = useState("");
  const [ showDepartureAutocomplete, setShowDepartureAutocomplete ] = useState(false)
  const [ searchReturnResults, setSearchReturnResults ] = useState({predictions: [{structured_formatting: ""}]});
  const [ searchReturnInput, setSearchReturnInput ] = useState("");
  const [ showReturnAutocomplete, setShowReturnAutocomplete ] = useState(false)
  const { latitude, longitude } = useGeoLocation();

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get("http://127.0.0.1:3001/google-places-nearby", {
          params: {
            location: `${latitude},${longitude}`,
            radius: 50000,
            type: "airport",
          },
        })
        .then((response) => {
          console.log("AIRPORTS RESULT: ", response.data);
          console.log("AIRPORT: ", response.data.results[0].name);
          axios
            .get("http://127.0.0.1:3001/google-places-autocomplete", {
              params: {
                input: response.data.results[0].name,
                radius: 500,
                types: "airport",
              },
            })
            .then((response) => {
              console.log(response.data);
              console.log(response.data.predictions[0].structured_formatting.main_text);
              setSearchDepartureInput(response.data.predictions[0].structured_formatting.main_text);
            });
        });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    console.log("Destination Location:", destinationTitle);
    if (destinationTitle) {
      axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
        params: {
          input: destinationTitle,
          radius: 500,
          types: "airport",
        },
      }).then(response=> {
        if (response.data.predictions && response.data.predictions.length > 0) {
          console.log("Destination Airport: ", response.data.predictions[0]);
          setSearchReturnInput(response.data.predictions[0].structured_formatting.main_text);
        }
      });
    }
  }, [destinationTitle]);

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
    console.log(text + " " + depart);
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
      style={{position: "absolute", zIndex: 10, backgroundColor: "white", width: "100%",}}
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
    <div className="pt-1 px-2 bg-white rounded-lg">
      <form className="flex max-w-5xl flex-row gap-4 mt-1" onSubmit={event => handleSearch(event)}>
        <div className="w-1/4">
          <div className="mb-2 block">
            <Label htmlFor="departure" value="Departure" />
          </div>
          <TextInput id="departure" name="departure" type="text" value={searchDepartureInput} placeholder="Where from?" required onChange={(event)=>handleTextChange(event.target.value, true)} ref={inputDepartRef} onFocus={handleDepartFocus}  />
          <SearchAutompleteList depart={true}/>
        </div>
        <div className="w-1/4">
          <div className="mb-2 block">
            <Label htmlFor="destination" value="Destination" />
          </div>
          <TextInput id="destination" name="destination" type="text" value={searchReturnInput} placeholder="Where to?" required onChange={(event)=>handleTextChange(event.target.value, false)} ref={inputReturnRef} onFocus={handleReturnFocus}/>
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
        <Button className="bg-blue-700 text-white mt-8 h-11 border-2 rounded-md'" type="submit">Search</Button>
      </form>
    </div>
  )
}