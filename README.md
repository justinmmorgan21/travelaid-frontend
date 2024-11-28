# TravelAid - resource for planning Vacations, including Flight searching and Points of Interest

### What the application does

**A user not logged in can...**
- search flights
- view suggested trips
- contact the admin
- create an account allowing them to log in each time they revisit the site

**A user that is logged in can...**
- view upcoming trips
- make new trips
- view and add suggested trips to their trip list
- add/remove points of interest for a trip
- view points of interest on an embedded map
- add and edit dates for trips and points of interest
- search flights and add booked flights to trip
- contact the admin
- update account info, including add an account image

**An admin (unique login) can...**
- create new suggested trips for viewing and adding by users.

**Flight Search...**
- users enter departing/returning locations and dates to receive real-time departing flight options.
- after selecting departing flight, users are presented with real-time return flight options.
- after selecting both flights, users are presented with summary info including baggage pricing and flight cost
- user has the option to click a button to open a new tab with actual flights in Google to finalize booking
- users logged in can also add these booked flights to their Trip in TravelAid

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/f18f09cd-5ca6-4477-bc5c-9b20b7bb9392" alt="Image 1" /></td>
    <td><img src="https://github.com/user-attachments/assets/59d30e58-be9f-4a64-a632-a263f66410ad" alt="Image 2" /></td>
  </tr>
</table>

### Why I used the technologies I used

- Ruby on Rails allowed for quick creation/updating of the backend with a Postgresql database.
- React provided the ability for frontend UI to update seamlesssly during user interaction.
- Tailwind CSS gave me the proper amount of useful pre-built UI components with the ability to customize as needed.
- Google Places:
  - To auto-fill in the departing flight location for flight search based on user's location, the combo of "nearby" and "autocomplete" searches takes in user's geolocation and results in a list of nearby airports.
  - To produce a list of possible airports when searching departing/return flight locations, an "autocomplete" search takes in whatever text is in input field and results in a list of closely matching airports.
  - To center the Google Map for a trip with no points of interest, thencombo of "autocomplete" and "details" takes in the name of the trip and finds the geolocation most fitting for that title.
- SerpAPI is an excellent data scraping tool that takes in two airport id's and returns back flight options for departure, then through additional tokens gives results for returning flights and finally a link to the matching flights in Google Flights to make a seamless ticket purchase process.
- EmailJS is a very easy to use message provider that uses the inputs of a form to send me an email with the user's message.
- To "store" images for the user accounts when they are uploaded, Cloudinary was used as a 3rd party image host to store the images and provides me with URLs to use when needing to display the image.
- Used a proxy server to run the requests for both Google Places and SerpAPI, as their CORS policies would not allow me to run them directly on the frontend due to a risk of exposing API keys.

### Some of the challenges I faced and features I hope to implement in the future

:interrobang: **Challenges**
- I had some difficulties in understanding and implementing the proxy server due to having no experience with this concept prior. Once I had the SerpAPI route and one of the Google Places routes successfully written, it was fairly easy to add on additional routes with their unique parameters.
- The complexity of the Flight Search was much greater than I had originally anticipated. While, none of it was overly challenging, it was quite time-consuming,and did offer a few minor wrinkles along the way.
- The Google Map has a default center and zoom upon initial display. It was a bit confusing on how to most appropriately assign values to these when showing a Trip. I landed on a mathematical process for calculating these. First, I found the average latitude and longitude of the points of interest to determine a center value. Then, I set up an automated calculation for the point of interest furthest out from the center since I needed to ensure it would be shown. After testing out the needed zoom level for 4 different Trips, I developed a function that defined an input of furthest point of interest distance and an output of zoom level needed to show it.

:dart: **Future goals** 
- sort options for the flight results
- budget feature to track all expenses for a Trip
- add ratings and/or comments to Trips or Points of Interest or both
- trip and points of interest images to be loaded from an api
- adjust image positions/sizes for uniformity
- make an alternative version of a Trip for a roadtrip
- suggested trips populated by other users, internet, possibly an AI assistant
- suggested trips on Home page displayed in a carousel
- points of interest created from an api (probably SerpAPI scraping Google results)
- add hotel searching and booking

Made using
React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
