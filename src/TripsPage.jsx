import { useNavigate } from "react-router-dom"
import { LoginPage } from "./LoginPage";
export function TripsPage() {

  const navigate = useNavigate();

  const handleGoToIndex = () => {
    console.log("handleGoToIndex");
    navigate(`/trips`);
  }

  return (
    <main>
      <h1>Welcome to TravelAde!</h1>
      <LoginPage />
      <button onClick={()=>handleGoToIndex()}>Go to Trips</button>
    </main>
  )
}