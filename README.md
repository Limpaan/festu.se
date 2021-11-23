# festu.se
Repository for Festkommittén FestUs webpage festu.se

## Description
This repository contains the different parts of the new website for FestU. 

## Development
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

#### To also run development backend
Node backend. Throw files and data on everyone!
```
npm run serve:backend
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### To run locally
Create *.env* file. See *example.env* for info.

Change *vue.config.js* to point proxy to **http://localhost:5000** if using local backend.