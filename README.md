<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://user-images.githubusercontent.com/62433719/173231595-c83f613f-e583-4546-9752-8001b7146c61.png" alt="Logo" width="350" >

  <h3 align="center"> Energy Live SaaS2022-18 </h3>

  <p align="center">
  A SAAS project that follows the microservice archicture.
    <br />
    <a href="https://saas-22-18-frontend.herokuapp.com/">View Demo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#technical-details">Technical Details</a>
          <ul>
        <li><a href="#data-fetch-microservices-and-google-drive-storage">Data Fetch Microservices and Google Drive Storage</a></li>
        <li><a href="#kafka-and-orchestartion">Kafka and Orchestration</a></li>
        <li><a href="#data-management-microservices">Data Management Microservices</a></li>
        <li><a href="#frontend-web-application">Frontend Web application</a></li>
        <li><a href="#user-management-and-security">User Management And Security</a></li>
      </ul></li>
    <li><a href="#about-us">About Us</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project was created for the SaaS course of ECE NTUA. We were asked to implement a system that gets energy Data from the [entso-e](https://www.entsoe.eu/) API for all the countries, processes it and returns the required information to the user in a web app. The project follows the Microservice architecture, uses Kafka as a choreographer between the microservices and serves the result in a website on the browser.

<div align="center">
<img src="https://user-images.githubusercontent.com/75163039/176540352-4f92d4bc-8d5c-4144-a25c-d9951003d5e2.png" alt="overview" width="900" >
</div>

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This section lists major frameworks/libraries that were used to bootstrap our project.

#### Frontend

- [React.js](https://reactjs.org/)

#### APIS

- [Express.js](https://expressjs.com/)
- [Nest.js](https://nestjs.com/)

#### Database

- [PostgreSql](https://www.postgresql.org/)
- [SequalizeORM](https://sequelize.org/)
- [TypeORM](https://typeorm.io/)

#### Messaging System

- [Apache Kafka](https://kafka.apache.org/)

#### Deployment

- [Heroku](https://www.heroku.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This section is about running the project by installing and running it on your local machine.
Or if you just want to see how it works, you can see our live demo [here](https://saas-22-18-frontend.herokuapp.com/).
To get a local copy up and running follow these simple example steps.

### Prerequisites

- [node.js](https://nodejs.org/en/)
  <br/>
- [Apache Kafka](https://kafka.apache.org/)
  <br/>
- [PostgreSql](https://www.postgresql.org/)
  <br/>
- [npm](https://www.npmjs.com/)
  <br/>

### Installation

Below are the instructions you have to follow to run the project on your local machine.

1. Clone the repo
   ```sh
   git clone https://github.com/ntua/saas2022-18
   ```
2. Set up kafka and the corresponding databases for each microservice following the instructions found in the kafkatxt? TODO
   <br/>
3. For all the microservices (folders inside the microservice folder), admin, and frontend folders to install the dependencies, you have to run:
   ```sh
   npm install
   ```
4. Then, to have them running:
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Technical Details

--------->screen of the architecture<-------------

Our app gets data from the ento-e servers, process them and displays the proper info, based on the user query, to the user. Because the data files were roughly 300gbs and we were 30teams in the class, we use data from January to March that are already saved and gives to us by the tutors. Because of that, we simulate the API calls using google Drive as our storage (more details on that below).

The project flow and structure can be split into those main categories:

### Data Fetch Microservices and Google Drive storage

The files are saved in a google drive account. The Fetch microservices are download the data from Google drive and parse them so only the useful data are kept in the format we need them. Then, they upload the parse files back to the Google Drive so the other microservices can get them.

### Kafka and Orchestartion

Apahce Kafka is used as the middleman between all the diferent Services. Using the Publish/Subscribe messaging everything is getting coordinated. Specifically, there is an Admin Application, from which we can simulate the real times requests. Admin applications publishes a message to the corresponding topic in Kafka(Admin_Fetch) , the proper Fetch microservice recieves it now it is informed that new Data have arrived. The fetch microservice downloads the data,parses them and uploads the parsed data. Then it publishes a new message to another Topic in Kafka, the Fetched topic, and the next part of our app comes in play.

### Data Management Microservices

The Data Management mircoservices are subscribed to the Fetched Topic (Where the Data Fetch Microservices publish) and whenever a message is recieved, they get informed that new Parsed data are available. Then instantly,these microservices download the parsed data from the Drive, store them properly in their database and serve as APIs so the frontend can use them to fullfill the user requests.

### Frontend Web application

Now, that we know how the backend works, we have the Web application that is used by the users of the app. After a user signs in and gets a valid lecence (see next section), he is navigated to the main dashboard. From there, he can get information about energy consumption by every European country, the type of that energy and even see cross border energy Flows between countries. Using the frontend listener service, the data update in real time. This is archieved by using polling. Polling means that the frontend application asks continiously (every very small interval) the frontend listener service if any new data has arrived and based on the answer he gets the new Data with a Get Request to the Data Management Microservices and then displays on the screen. This all happens without the user noticing anything. There is no refresh in the page because the web application is a SPA.

### User Management And Security

The users are registered and signed to our App through google. We used the google login library to implement this. The first time the user signs in, automatically an acount is created for them. If he is already registered, he logs in to his already existing account. With every signing in the user gets JWT. This JWT is required both to have access to web app and to every single API. Without JWT, there is no access. Also the JWT expires after a certain time for security in case it gets stolen from the user. Also, to get information from the web application or to access the apis the uses needs to have a valid licence. The user can update his licence through the web application.

<p align="right">(<a href="#top">back to top</a>)</p>

## About Us

This project was created by our team consisting of the mebmers below:

- [Alex Kouridakis](https://github.com/alex-kouridakis)
- [Eleftherios Oikonomou](https://github.com/SeCre827)
- [Vikentios Vitalis](https://github.com/VikentiosVitalis)
- [Stefanos Tsolos](https://github.com/stefanostsolos)

Feel free to reach out to us for any comment or question!

<p align="right">(<a href="#top">back to top</a>)</p>
