import Datepicker from "react-tailwindcss-datepicker";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useGeoLocation } from 'use-geo-location';
import { Alert } from "flowbite-react";


export default function FlightHotelSearch({destinationTitle}) {
  const [dates, setDates] = useState({ 
    startDate: null, 
    endDate: null
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searching, setSearching] = useState(false);

  const inputDepartRef = useRef(null);
  const handleDepartFocus = () => {
    inputDepartRef.current.select();
    setShowAlert(false);
  }
  const inputReturnRef = useRef(null);
  const handleReturnFocus = () => {
    inputReturnRef.current.select();
    setShowAlert(false);
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
    setSearching(true);
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
      setSearching(false);
      if (response.data.error) {
        setShowAlert(true);
        setAlertMessage("No matching flights!")
      } else {
        navigate("/flights", { state: response.data });
      }
    }).catch(error => {
      setSearching(false);
      console.error("Error fetching flight data:", error);
      // Add any additional error handling here
      setShowAlert(true); // Display the alert in case of error
      setAlertMessage("Invalid search")
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
        {showAlert && (
          <div className="border-0 -mt-3">
            <Alert color="info" className="border-0 border-green-500 p-2">
              <span className="text-red-500 font-medium border-0 border-red-500">{alertMessage}</span>
            </Alert>
            <Button className="bg-blue-700 text-white mt-1 h-11 border-0 rounded-md'" type="submit">Search</Button>
          </div>
        )}
        {!showAlert && (
          <Button className="bg-blue-700 text-white mt-7 h-11 border-0 rounded-md'" type="submit">Search</Button>
        )}
      </form>
      {
        searching ? 
        <div className="overlay">
          <div className="spinner">
            <svg role="status" className="h-8 w-8 animate-spin mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        </div>
         : null
      }
    </div>
  )
}