// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

import flowbite from "flowbite-react/tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  // this color strategy was from chatgpt, did not work
  theme: {
    extend: {
      colors: {
        // 'active': '#FF0000',
        'custom-hover': '#FF0000',
      },
    },
  },
  // variants: {
  //   extend: {
  //     backgroundColor: ['active'],
  //     textColor: ['active'],
  //   },
  // },
  plugins: [
    // ...
    flowbite.plugin(),
  ],
};