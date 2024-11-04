import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export function PlacesCreateModal({onClose, trip}) {
  
  const navigate = useNavigate();

  const handleCreate = (event, trip_id) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.append('trip_id', trip_id);
    axios.post("http://localhost:3000/places.json", params).then(response=> {
      navigate(`/trips/${trip_id}`)
      onClose();
    });
  }

  return (
    <div>
      <h2>New Place</h2>
      <form onSubmit={(event) => handleCreate(event, trip.id)}>
        <label htmlFor="name">name:  </label>
        <input type="text" name="name"/><br />
        <label htmlFor="address">address:  </label>
        <input type="text" name="address"/><br />
        <label htmlFor="description">description:  </label>
        <input type="text" name="description"/><br />
        <label htmlFor="image_url">Image URL:  </label>
        <input type="text" name="image_url"></input><br />
        <label htmlFor="start_time">Start:  </label>
        <input type="date" name="start_time"></input><br />
        <label htmlFor="end_time">End:  </label>
        <input type="date" name="end_time"></input><br />
        <br />
        <button type="submit">Submit</button>
      <button onClick={()=>onClose()}>Cancel</button>
      </form>
    </div>
  );
}