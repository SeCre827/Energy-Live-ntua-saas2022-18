<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://user-images.githubusercontent.com/62433719/173231595-c83f613f-e583-4546-9752-8001b7146c61.png" alt="Logo" width="350" >

  <h3 align="center"> Energy Live SaaS2022-18 </h3>

  <p align="center">
  A SaaS project that follows the microservices architecture.
    <br />
    <a href="https://saas-22-18-frontend.herokuapp.com/">View Demo</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#technical-details">Technical details</a>
          <ul>
        <li><a href="#data-fetch-microservices-and-google-drive-storage">Data Fetch Microservices and Google Drive Storage</a></li>
        <li><a href="#kafka-and-orchestartion">Kafka and Orchestration</a></li>
        <li><a href="#data-management-microservices">Data Management Microservices</a></li>
        <li><a href="#frontend-web-application">Frontend Web Application</a></li>
        <li><a href="#user-management-and-security">User Management and Security</a></li>
      </ul></li>
    <li><a href="#about-us">About us</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Project

This project was created for the SaaS course of ECE NTUA. We were asked to implement a system that gets energy data from the [entso-e](https://www.entsoe.eu/) API for all the countries, processes it and returns the required information to the user in a web app. The project follows the microservices architecture, uses Kafka as a choreographer between the microservices and serves the result in a website on the browser.

<div align="center">
<img src="https://user-images.githubusercontent.com/75163039/176540352-4f92d4bc-8d5c-4144-a25c-d9951003d5e2.png" alt="overview" width="900" >
</div>


<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

This section lists major frameworks/libraries that were used to bootstrap our project.

#### Frontend

- [React.js](https://reactjs.org/)

#### APIs

- [Express.js](https://expressjs.com/)
- [Nest.js](https://nestjs.com/)

#### Database

- [PostgreSQL](https://www.postgresql.org/)
- [SequalizeORM](https://sequelize.org/)
- [TypeORM](https://typeorm.io/)

#### Messaging System

- [Apache Kafka](https://kafka.apache.org/)

#### Deployment

- [Heroku](https://www.heroku.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This section is about installing and running the project on your local machine.
If you just want to see how it works, you can see our live demo [here](https://saas-22-18-frontend.herokuapp.com/).
To get a local copy up and running follow these simple example steps.

### Prerequisites

- [node.js](https://nodejs.org/en/)
  <br/>
- [Apache Kafka](https://kafka.apache.org/)
  <br/>
- [PostgreSQL](https://www.postgresql.org/)
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
3. For all the microservices (folders inside the microservices folder), admin and frontend folders, to install the dependencies you have to run:
   ```sh
   npm install
   ```
4. Then, to have them running:
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Technical details


<div align="center">
<img src="https://user-images.githubusercontent.com/75163039/176975258-932a1817-09a9-4461-bf8c-c3fc3d2f0a6b.png" alt="overview" width="900" >
</div>


Our app gets data from the entso-e servers, processes them and displays the proper info, based on the user query, to the user. The data files are roughly 300 GB, so we use data from January to March that are already saved and given to us by the tutors. Because of that, we simulate the API calls using Google Drive as our storage (more details on that below).

The project flow and structure can be split into those main categories:

### Data Fetch Microservices and Google Drive storage

The files are saved in a Google Drive storage. The fetch microservices download the data from Google Drive and parses them, so only the useful data are kept in the format we need them. Then, they upload the parse files back to Google Drive so the other microservices can get them.

### Kafka and Orchestration

Apahce Kafka is used as the middleman between all the diferent services. Using the Publish/Subscribe Messaging everything is getting coordinated. Specifically, there is an Admin Application, from which we can simulate the real-time requests. Admin application publishes a message to the corresponding topic in Kafka (Admin_Fetch), the proper data fetch microservice receives it, so now it is informed that new data have arrived. The data fetch microservice downloads the data, parses them and uploads the parsed data. Then it publishes a new message to another topic in Kafka, the Fetched Topic, and the next part of our app comes in play.

### Data Management Microservices

The Data Management microservices are subscribed to the Fetched Topic (where the Data Fetch Microservices publish) and whenever a message is received, they get informed that new parsed data are available. Then instantly, these microservices download the parsed data from Google Drive, store them properly in their database and serve as APIs so the frontend can use them to fullfill the user requests.

### Frontend Web Application

Now, that we know how the backend works, we have the Web Application that is used by the users of the app. After a user signs in and gets a valid license (see next section), the user is navigated to the main dashboard. From there, he can get information about energy consumption by every European country, the type of that energy and even see cross border energy flows between countries. Using the frontend listener service, the data update in real time. This is achieved by using polling. Polling means that the frontend application asks continuously (every very small time interval) the frontend listener service if any new data has arrived. Then, based on the answer he gets the new data with a Get Request to the Data Management Microservices and then displays on the screen. This all happens without the user noticing anything. There are no page refreshes because the web application is a SPA.

### User Management and Security

The users are registered and signed in our app through a Google account. We used the Google login library to implement this. The first time the user signs in, an account is automatically created for them. If the user is already registered, the user logs in to the already existing account. With every sign-in, the user gets a JWT. This JWT is required both to have access to the web app and to every single API. Without the JWT, there is no access. For additional security, the JWT expires after a certain time, in case it gets stolen from the user. Furthermore, to get information from the web application or to access the APIs, the user needs to have a valid license. The user can update the license through the web application.

<p align="right">(<a href="#top">back to top</a>)</p>

## About us

This project was created by our team consisting of the members below:

- [Alex Kouridakis](https://github.com/alex-kouridakis)
- [Eleftherios Oikonomou](https://github.com/SeCre827)
- [Vikentios Vitalis](https://github.com/VikentiosVitalis)
- [Stefanos Tsolos](https://github.com/stefanostsolos)

Feel free to reach out to us for any comment or question!

<p align="right">(<a href="#top">back to top</a>)</p>
