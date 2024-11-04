import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export function TripsCreateModal({onClose}) {

  const navigate = useNavigate();
  
  const handleCreate = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    console.log(params);
    axios.post("http://localhost:3000/trips.json", params).then(response=> {
      console.log(response.data);
      onClose("CREATE");
      navigate(`/trips/${response.data.id}`);
    });
  }

  return (
    <div>
      <h2>New Trip</h2>
      <form onSubmit={(event) => handleCreate(event)}>
        <label htmlFor="title">Title:  </label>
        <input type="text" name="title" placeholder="Title"/><br />
        <label htmlFor="image_url">Image URL:  </label>
        <input type="text" name="image_url"></input><br />
        <label htmlFor="start_time">Start:  </label>
        <input type="date" name="start_time"></input><br />
        <label htmlFor="end_time">End:  </label>
        <input type="date" name="end_time"></input><br />
        <br />
        <button type="submit">Submit</button>
      <button onClick={()=>onClose("CLOSE")}>Cancel</button>
      </form>
    </div>
  );
}