## SpeedNote

[LIVE SITE]()

![ALT:preview](preview.png)


# This project uses a Firebase Account `https://console.firebase.google.com/` with Cloud Firestore Databae provisioning/configuration. Feel free to refactor the code for your preferred database system.

## Install tailwindcss
```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```
## // create tailwind.config.js
```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
## // create postcss.config.js
```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
## add to main.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```


```sh
npx create-vue@latest .
```
```sh
npm run build
```

## deploy dist folder to static server