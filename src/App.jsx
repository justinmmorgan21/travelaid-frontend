import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from "./Header";
import { Authentication } from "./Authentication";
import { TripsIndexPage } from "./TripsIndexPage";
import { TripsShowPage } from "./TripsShowPage";
import { Footer } from "./Footer";
import { TripsCreatePage } from "./TripsCreatePage";
import { Hero } from "./Hero";
import { LoginModal } from "./LoginModal";
import UserSettings from "./UserSettings";
import Home from "./Home";
import { Contact } from "./Contact";
import { FlightResult } from "./FlightResult";
import { SuggestedTripsPage } from "./SuggestedTripsPage";
import { TripsPastIndexPage } from "./TripsPastIndexPage";
import { Admin } from "./Admin";
import BackgroundImage from './assets/clouds-4k-for-pc-in-hd-wallpaper-preview.jpg';
import { SelectedFlight } from "./SelectedFlight";
import apiConfig from './apiConfig';

const AppLayout = () => {
  const [showHero, setShowHero] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  useEffect(() => {
    if (localStorage.jwt === undefined) {
      setShowHero(true);
    } else {
      setShowHero(false);
    }
  }, []);

  return (
    <div className="bg-cover bg-center bg-gradient-to-b from-blue-700 to-blue-200 min-h-screen" 
    style={{ backgroundImage: `url(${BackgroundImage})`, backgroundAttachment: 'fixed', }}>
      <div id="main" hidden={showHero}  >
        <Header setShowHero={setShowHero} modalShow={handleModalShow}/>
          <div className="container mx-auto pt-24 pb-12 px-24 flex-auto">
            <Outlet />
          </div>
        <Footer />
      </div>
      <div hidden={!showHero}>
        <Hero modalShow={handleModalShow} setShowHero={setShowHero} />
        <LoginModal onClose={handleClose} show={modalVisible}>
          <Authentication />
        </LoginModal>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/trips/next.json`).then(response => response.data)
      },
      {
        path: "/userSettings",
        element: <UserSettings />
      },
      {
        path: "/home",
        element: <Home />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/trips/next.json`).then(response => response.data)
      },
      {
        path: "/trips",
        element: <TripsIndexPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/trips.json`).then(response => response.data)
      },
      {
        path: "/trips/:id",
        element: <TripsShowPage />,
        loader: ({ params }) => axios.get(`${apiConfig.backendBaseUrl}/trips/${params.id}.json`).then(response => response.data)
      },
      {
        path: "/trips/new",
        element: <TripsCreatePage />
      },
      {
        path: "/trips/past",
        element: <TripsPastIndexPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/trips/past.json`).then(response => response.data)
      },
      {
        path: "/contact",
        element: <Contact />,
        loader: () => localStorage.jwt === undefined ? null : axios.get(`${apiConfig.backendBaseUrl}/users/current.json`).then(response => response.data)
      },
      {
        path: "/flights",
        element: <FlightResult />
      },
      {
        path: "/suggested",
        element: <SuggestedTripsPage />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/trips/suggested.json`).then(response => response.data)
      },
      {
        path: "/selected_flight",
        element: <SelectedFlight />
      },
      {
        path: "/admin",
        element: <Admin />,
        loader: () => axios.get(`${apiConfig.backendBaseUrl}/users.json`).then(response => response.data) 
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;