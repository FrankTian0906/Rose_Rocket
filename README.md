# Rose_rocket

![Pic](http://http://github.com/FrankTian0906/Rose_Rocket/raw/1/Sample.png "Sample page")

## Install

- 1 make sure you have installed NodeJS in your system;

- 2 In the directory you specify, enter the commands:

  - git clone https://github.com/FrankTian0906/Rose_Rocket.git (clone the project)

  - cd Rose_Rocket && npm install (install server part)

  - cd client && npm install (install client part)

  - cd .. && npm run dev (start the server and client)

Have fun!

## Structure

- Server: server.js and all json data stored in "data" file;

- Client: client/src/App.js organizes components and communicates with server;
  client/src/components/Maps.js reads the data then drafts the map, and calculates the time;
  client/src/components/DiverController.js updates the driver location on given routes(Legs) and calls back the location;
  client/src/components/BonusDriverController.js updates the bnous driver location on given range(200x200 grids) and calls back the location;
