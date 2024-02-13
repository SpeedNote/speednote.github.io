## SpeedNote
### An awesome Web Application built using Vue.js and Firebase

[LIVE SITE]()

![ALT:preview](preview.png)


### This project uses a Firebase Account `https://console.firebase.google.com/` with Cloud Firestore Database provisioning/configuration. 

Feel free to refactor the code for your preferred database system.


```sh
npx create-vue@latest myNewProject
```

## Install tailwindcss
```
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```
## Create tailwind.config.js
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
## Create postcss.config.js
```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```
## Add to main.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# DEPLOYMENT

```sh
npm run build
```

### Deploy `dist` folder to static server