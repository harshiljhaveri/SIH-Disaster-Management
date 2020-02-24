# Welcome to Auxilium

For some it's a Savior. For others, it's a Messiah. Auxilium is powerful open-source disaster management platform made with Node.js and MongoDB.

Developed by:-
Soham Parekh
Harshil Jhaveri
Pushkar Bhuse
Divyam Sheth
Jugal Mistry

![](https://img.shields.io/badge/license-MIT-green.svg) 

## Features

- Sign in through Google account or Auxilium account.
- Register a disaster/event.
- Get updates on the disaster through a dedicated chatroom in realtime.
- All events are divided into following categories
  - Accident 
  - Fire
  - Natural
  - Angry Mob
  - Others
- Trigger an SoS for immediate help from a nearby user.
- Dedicated API for developers
- Get information about the safest route to take from Place A to   Place B.
- Stuck in a disaster? Have no internet access? Get information about the nearest Police Station 👮🏻‍♀️, Railway Station 🚉 and Hospital 🏥 with fastest routing.
- Pay toll through the web app.
- An Electron app

And a lot more functionalities to be added soon...

## To Do's

- Dedicated Android and IOS app
- Toll payment via bluetooth.
- Notifications

## Requirements

- [Node.js](https://nodejs.org)
  - expressjs [ExpressJS HTTP middleware](https://npmjs.org/package/express)
  - ejs [Embedded JavaScript templates](https://npmjs.org/package/ejs)
- [MongoDB](http://mongodb.org)

## Installation

Clone the repo locally then install all the dependencies using [NPM](https://npmjs.org/)

```bash
$ git clone https://github.com/AlQaholic007/auxilium.git
$ cd auxilium
$ npm i
```

## Local Development

Before running the app, you will need to add the Google API Credentials to the project. Under the `config` directory of the repo, you will find `google.js`. Replace `<CLIENT_ID>`, `<CLIENT_SECRET>` and `<host>:<port>` with your own API credentials

```javascript
/** REPLACE YOUR API CREDENTIALS HERE **/
var in_client_id = 'XXXXXXXXXXXXXXXXXX', // <CLIENT_ID>
    in_client_secret = 'XXXXXXXXXXXXXXXXXXXX', // <CLIENT_SECRET>
```

Now Replace the `<host>` & `<port>` with the redirect uri specified  [Google API Dashboard](https://developers.google.com). Default is `http://localhost:8080/account/oauth`.

```javascript
var in_redirect_uri = "http://localhost:8080/account/oauth/:service";
```

Finally start the MongoDB server in a seperate bash/pm2

```bash
$ mongod
```

and then start the auxilium server via `npm`.

```bash
$ npm start
```
