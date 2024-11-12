// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import { useState } from 'react'
// import axios from 'axios';
// import { Header } from "./Header";
// // import { TripsPage } from "./Authentication";
// import { TripsIndexPage } from "./TripsIndexPage";
// import { TripsShowPage } from "./TripsShowPage";
// import { Footer } from "./Footer";
// import { TripsCreatePage } from "./TripsCreatePage";
// import { Hero } from "./Hero";
// import { About } from "./About";
// import { Dashboard } from "./Dashboard";
// import UserSettings from "./UserSettings";

// let showHero = true;

// const toggleHero = () => {
//   console.log("TOGGLE");
//   console.log(showHero);
//   showHero = !showHero;
// }

// const router = createBrowserRouter([
//   {
//     element: (
//       <div>
//         {showHero && <Hero toggleHero={toggleHero} />}
//         <div id="main" hidden={showHero}>
//           <Header />
//           <div>
//             <div className="container mx-auto py-12 px-24 flex-auto">
//               <Outlet />
//             </div>
//           </div>
//           <Footer />
//         </div>
//       </div>
//     ),
//     children: [
//       {
//         path: "/",
//         element: <Hero />,
//       },
//       {
//         path: "/dashboard",
//         element: <Dashboard />
//       },
//       {
//         path: "/userSettings",
//         element: <UserSettings />
//       },
//       // {
//       //   path: "/home",
//       //   element: <Home />
//       // },
//       {
//         path: "/about",
//         element: <About />
//       },
//       {
//         path: "/trips",
//         element: <TripsIndexPage />,
//         loader: () => axios.get("http://localhost:3000/trips.json").then(response => response.data)
//       },
//       {
//         path: "/trips/:id",
//         element: <TripsShowPage />,
//         loader: ({ params }) => axios.get(`http://localhost:3000/trips/${params.id}.json`).then(response => response.data)
//       },
//       {
//         path: "/trips/new",
//         element: <TripsCreatePage />
//       }
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Header } from "./Header";
import { Authentication } from "./Authentication";
import { TripsIndexPage } from "./TripsIndexPage";
import { TripsShowPage } from "./TripsShowPage";
import { Footer } from "./Footer";
import { TripsCreatePage } from "./TripsCreatePage";
import { Hero } from "./Hero";
import { About } from "./About";
import { Dashboard } from "./Dashboard";
import { LoginModal } from "./LoginModal";
import UserSettings from "./UserSettings";
import Home from "./Home";
import { Contact } from "./Contact";



const AppLayout = () => {
  const [showHero, setShowHero] = useState(false);
  // const [currentUser, setCurrentUser] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  // const getUser = () => {
  //   axios.get("http://localhost:3000/users/current.json").then(response => {
  //     setCurrentUser(response.data);
  //   })
  // }

  // useEffect(getUser, []);

  useEffect(() => {
    if (localStorage.jwt === undefined) {
      setShowHero(true);
    } else {
      setShowHero(false);
    }
  }, []); // Empty dependency array ensures it runs only once

  // const toggleHero = () => {
  //   setShowHero(!showHero);
  // };

  return (
    <div>
      <div id="main" hidden={showHero}>
        <Header />
        <div>
          <div className="container mx-auto pt-24 pb-12 px-24 flex-auto">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
      <div hidden={!showHero}>
        <Hero modalShow={handleModalShow} />
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
        element: <Home />,
        loader: () => axios.get(`http://localhost:3000/trips/next.json`).then(response => response.data)
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
        path: "/contact",
        element: <Contact />,
        loader: () => axios.get(`http://localhost:3000/users/current.json`).then(response => response.data)
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;