## Project Name

[LIVE SITE]()

![ALT:preview](preview.png)




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