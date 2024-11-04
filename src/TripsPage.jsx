import { useNavigate } from "react-router-dom"
export function TripsPage() {

  const navigate = useNavigate();

  const handleGoToIndex = () => {
    console.log("handleGoToIndex");
    navigate(`/trips`);
  }

  return (
    <main>
      <h1>Welcome to TravelAde!</h1>
      <button onClick={()=>handleGoToIndex()}>Go to Trips</button>
    </main>
  )
}