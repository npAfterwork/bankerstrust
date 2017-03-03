# bankerstrust

```
bankerstrust
│
└───app: AngularJS 1 Typescript WebApp Build
│   
└───backend: Node Express Server Typescript Build 
│   
└───data: Server Runtime Data Storage
│   
└───dist: Server & WebApp Runtime

```

## Setup

* Copy `dist/config.jscd on.dist` to `dist/config.json`
  
  Adjust settings (e.g. ports) as needed

* Run `npm install` in 
  
  `/` Installs the backend runtime dependencies 
  
  `/app` Installs the app develop & build dependencies
   
  `/backend` Installs the backend develop & build dependencies


## Develop

Run `npm run develop` in `/app` to start webpack develop server with file watcher & hot module replacement 

Run `npm run develop:mac` or `npm run develop:win` in `/backend` to start node backend with file watcher & auto-restart


## Build

Run `npm run build` in `/app` to build the app into `/dist/app/*`

Run `npm run build` in `/backend` to build the backend into `/dist/server.js`


## Deploy

Build, then run `node server.js` in `/dist`

