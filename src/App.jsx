import { Button } from "flowbite-react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import axios from 'axios';
import { Header } from "./Header";
import { SignupPage } from "./SignupPage";
import { LoginPage } from "./LoginPage";
import { TripsPage } from "./TripsPage";
import { TripsIndexPage } from "./TripsIndexPage";
import { TripsShowPage } from "./TripsShowPage";
import { Footer } from "./Footer";
import { TripsCreatePage } from "./TripsCreatePage";
import { Home } from "./Home";
import { About } from "./About";
import { Dashboard } from "./Dashboard";
import UserSettings from "./UserSettings";

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <div>
          <div className="container mx-auto py-12 px-24 flex-auto">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <TripsPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/userSettings",
        element: <UserSettings />
      },
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/trips",
        element: <TripsIndexPage />,
        loader: () => axios.get("http://localhost:3000/trips.json").then(response => response.data)
      },
      {
        path: "/trips/:id",
        element: <TripsShowPage />,
        loader: ({ params }) => axios.get(`http://localhost:3000/trips/${params.id}.json`).then(response => response.data)
      },
      {
        path: "/trips/new",
        element: <TripsCreatePage />
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;