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
        <li><a href="#repository-contents">Repository contents</a></li>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage-guide">Usage guide</a>
      <ul>
        <li><a href="#running-the-deployed-application">Running the deployed application</a></li>
      </ul>
    </li>
    <li><a href="#technical-details">Technical details</a>
      <ul>
        <li><a href="#event-passing-using-apache-kafka">Event passing using Apache Kafka</a></li>
        <li><a href="#data-fetch-microservices">Data Fetch Microservices</a></li>
        <li><a href="#data-management-microservices">Data Management Microservices</a></li>
        <li><a href="#frontend-listener">Frontend Listener</a></li>
        <li><a href="#user-management-and-security">User Management and Security</a></li>
        <li><a href="#frontend-web-application">Frontend Web Application</a></li>
      </ul>
    </li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#stress-testing">Stress Testing</a></li>
    <li><a href="#about-us">About us</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Project

This project was developed by our team as part of the SaaS course, during the 8th semester of the Electrical and Computer Engineering school of the National Technical University of Athens. The goal of this project was to develop a SaaS application of non-trivial size, which would conform to the [microservices architecture](https://en.wikipedia.org/wiki/Microservices) and utilise state-of-the-art technologies to implement the communication between the microservices and the deployment of each microservice.

The thematic field of the project is the European electrical energy market. The European Network of Transmission System Operators ([ENTSO-E](https://www.entsoe.eu/)) hosts an [SFTP server](https://transparency.entsoe.eu/content/static_content/Static%20content/knowledge%20base/SFTP-Transparency_Docs.html) which provides a large number of different datasets regarding the operation of Europe's electicity system. Of those datasets, we are concerned with only three, specifically the "Actual Total Load" ("ATL"), "Aggregated Generation per Type" ("AGPT") and "Physical Flows" ("PF") datasets. The purpose of the application we were asked to develop is to gather data from those datasets as they are updated in real time. The users of the application should then be able access the data through a frontend web application, which should enable them to filter through the data, view the requested data in a graph, as well as download the requested data. The contents of the frontend application should be updated in real time, without the need for the user to manually refresh the web page.

<div align="center">
<img src="https://user-images.githubusercontent.com/75163039/176540352-4f92d4bc-8d5c-4144-a25c-d9951003d5e2.png" alt="overview" width="900" >
</div>


<p align="right">(<a href="#top">back to top</a>)</p>

### Repository contents
This repository contains the cumulative work produced to develop this project. Specifically, the `architecture` directory contains a Visual Paradigm file, which describes the project's architecture and functionality through various appropriate diagrams. The `frontend` directory contains all the code for the frontend application, while the `microservices` directory contains one sub-directory for each developed microservice, containing the code for that microservice. The `admin` directory contains an administration application which is used to test the functionality of the project. Finally, the `stress-testing` directory contains the results of the stress testing performed on the project's APIs.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

This section lists the major frameworks/libraries that were used to bootstrap our project. In general, the project's code was written exclusively in JavaScript and TypeScript, with HTML and CSS also being used to develop the frontend application. In addition, different members of the team wished to use different frameworks while developing each microservice. This was possible due to the loose coupling of the microservices (i.e. each microservice functions independently of each other) and led to our project containing various different technologies.

#### Frontend

- [React.js](https://reactjs.org/)
- Data visualisation: [Highcharts](https://www.highcharts.com/)

#### APIs

- [Express.js](https://expressjs.com/)
- [Nest.js](https://nestjs.com/)

#### Database

The DBMS used for each of the microservices' database is [PostgreSQL](https://www.postgresql.org/). Interaction with the database is not done through raw SQL, but instead the following ORMs were used:
- [SequalizeORM](https://sequelize.org/)
- [TypeORM](https://typeorm.io/)

#### Messaging System

- [Apache Kafka](https://kafka.apache.org/) / [CloudKarafka](https://www.cloudkarafka.com/)

#### Deployment

- [Heroku](https://www.heroku.com/)

#### Stress Testing

- [Apache JMeter](https://jmeter.apache.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE GUIDE -->

## Usage Guide

The code contained within this repository has been adjusted so that it can work both in a development (i.e. local deployment) and in a production (i.e. Heroku deployment) environment. This enabled our team to develop code locally and test that everything works as intended, before deploying each version of the software. We will only be describing how to use the application deployed on Heroku and will not present the steps needed to run the application locally, as the setup required is rather involved and is beyond the scope of this document, whose purpose is to summarize the methods and technologies used in this project.

#### Note about sensitive information

Since the code contained in this repository should be able to run locally (given the appropriate setup), it contains sensitive information that should not be checked into a source control, especially not in a public repository (for example, Google Cloud credentials and JWT signatures can be found accompanying the code). This has been done on purpose, to facillitate exhibition of the project for the purposes of assessment, and would obviously constitute a serious security breach in a professional environment.

<p align="right">(<a href="#top">back to top</a>)</p>

### Running the deployed application

#### Accessing the frontend

You can access the frontend of the deployed application on the following URL:

<p align="center">https://saas-22-18-frontend.herokuapp.com/</p>

For the deployment of the project, we have used the Heroku platform. Since this is a university project, we have used the free tiers of all Heroku services that we utilised. This imposes a number of limitations on our project. One of the limitations is that the various Heroku application used by our project are not active at all times, but instead automatically hibernate after 30' of inactivity. Each application resumes whenever a request is made to it, however the wakeup process requires up to half a minute of time. For this reason, when first accessing the above url, you will experience a noticeable delay, which is to be expected.

After performing Sign-in with Google, you will be presented with the "Extend Licence" page. In order to access the services provided by our application, each user must have an active licence. In a real-life scenario, this is the place where all the financial business logic would take place. However, for the purposes of our application, you can directly extend their licence as often as you would like through the "Extend Licence" page, without any limitations.

Once you have a positive amount of time remaining on your licence, you can access the page containing the main functionality of the web application. Through there, you can select one of the three available datasets and set the filters for the data you wish to view. The web application will present, in a graph, all data specified by the search parameters, for the time period between the specified start date and up to the current date. If new data are fetched by the application's backend, the web application is automatically updated and the graph is refreshed without any user action.

#### Simulating new data

To avoid connecting to the actual ENTSO-E SFTP server and performing large numbers of requests while developing the application and experimenting, we were provided with a large number of real-life data fetched in the past and were instructed to use them to simulate new data being fetched by our application. Specifically, for each hour from 2022-01-01 00:00:00 to 2022-03-08 23:00:00, for each of the three datasets, we were given a CSV file containing all data fetched from the SFTP server at that hour. The total size of the data we received was about 163 GB. To achieve the desired result, we created a Google Drive folder where we placed a small subset of the given data. Thus, instead of actually connecting to the SFTP server, the application's backend simply fetches the appropriate CSV files from Google Drive, and then proceeds to store the relevant data. In other words, we simulate the SFTP server using Google Drive.

In a real-life scenario, the application's backend periodically fetch the next CSV file from the SFTP server, for example once every hour. However, for the purposes of exhibition, we need to be able to manually cause the backend to fetch the next CSV file whenever we wish to. This goal is achieved through the use of the admin application contained in the `admin` directory. You should pull that directory into a local machine and run `npm install && tsc` to install the required packages and compile the TypeScript code. Afterwards, you should run `npm run prod:reset` and `npm run reset_files`. From here on, every time you run `npm run update_files` followed by `npm run prod:fetch_files`, the backend application will fetch the next CSV file for each dataset, the relevant data will be stored, and the frontend application will be updated automatically.

#### About the available data

The CSV files fetched from the SFTP server get progressively larger as time passes, reaching the maximum size at the end of each month (the largest CSV we were provided with is about 130MB). While developing our application locally, we ensured it was able to fetch and store such large files effectively, without significant delays. However, when deploying our application, one of the limitations of the free tier of Heroku services is the relatively small amount of storage space provided in each database, which limits how much data we can store in the deployed application. Specifically, we are only able to store data for 2022-01-01 and for no more days after that. Therefore, in order to view any data in the frontend application, the user should select a start date before 2022-01-01.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- TECHNICAL DETAILS -->

## Technical details

In this section, we shall describe the inner workings of the application, by presenting its architecture and functionality in more detail. Below is the component diagram contained in the Visual Paradigm file of the `architecture` directory.

<div align="center">
<img src="https://user-images.githubusercontent.com/75163039/176975258-932a1817-09a9-4461-bf8c-c3fc3d2f0a6b.png" alt="overview" width="900" >
</div>

Also in the Visual Paradigm file are contained a number of sequence diagrams which describe the application's functionality (and may be used instead of or in conjunction with the description that follows). The project flow and structure can be split into the following main categories:

<p align="right">(<a href="#top">back to top</a>)</p>

### Event passing using Apache Kafka

Apahce Kafka is used as the middleman between all the different microservices. Whenever a microservice wishes to communicate with another, it publishes a corresponding event to the Kafka event bus. Each microservice subscribes to all events that concern it, and is informed whenever such an event is published. Therefore, all communication between the microservices is indirect and asynchronous, thereby facilitating the isolation of the microservices and increasing the scalability of the project.

<p align="right">(<a href="#top">back to top</a>)</p>

### Data Fetch Microservices 

The project contains three "Data Fetch" microservices, one for each of the available datasets. All these microservices subscribe to the ADMIN_FETCH events which is published manually by the admin application (by running `npm run prod:fetch_files`, as described in <a href="#simulating-new-data">Simulating new data</a>). Whenever one of those microservices receives this event, it fetches its corresponding CSV file from the simulated SFTP server. The file is then parsed and converted into a JSON file containing only the useful data and formatted in a convenient fashion. Afterwards, the JSON file is uploaded to a Google Drive directory created for this project. Finally, the microservice publishes a FETCHED event to the Kafka Event Bus, which is to be received by the corresponding "Data Management" microservice.

<p align="right">(<a href="#top">back to top</a>)</p>

### Data Management Microservices

The project contains three "Data Management" microservices, one for each of the available datasets. All these microservices subscribe to the FETCHED events published by the "Data Fetch" microservices. Each FETCHED event contains information regarding which dataset it concerns, and also contains the ID of the uploaded JSON file in Google Drive. Whenever one of the "Data Management" microservices receives a FETCHED event corresponding to its dataset, it downloads the JSON file from Google Drive, parses it, then imports it into its local database. During this process, apart from new data being imported to the database, existing data may also be updated. After the new data has been imported into the database, the "Data Management" microsercvice publishes a STORED event to the Kafka Event Bus, which is to be received by the Frontend Listener microservice.

Each of the "Data Management" microservices also exposes a GET endpoint, which is used by the frontend application to fetch the data requested by the user.

<p align="right">(<a href="#top">back to top</a>)</p>

### Frontend Listener

The Frontend Listener microservice subscribes to the STORED events published by the "Data Management" microservices. The function of the Frontend Listener is to keep a record of the latest data import performed for each dataset. The purpose of this function will be described shortly, when we present the Frontend Web Application.

<p align="right">(<a href="#top">back to top</a>)</p>

### User Management and Security

The users are registered and signed in our app using Sign-in with Google. The Frontend application redirects the user to the Google Authentication server, which performs authentication and returns a Google ID token. That token is then sent to the User Management microservice (via the Sign-in endpoint), which creates an account for the user, if one does not already exist. This microservice returns a private JWT to the Frontend application. The JWT holds information regarding the user and their licence. To access any endpoint of any microservice (other than Sign-in), a valid, non-expired JWT is required.  In addition, in order to access any endpoint other than Sign-in and Extend Licence, a non-expired licence is required. Whenever a user updates their licence, a new JWT is generated to reflect the updated licence. 

<p align="right">(<a href="#top">back to top</a>)</p>

### Frontend Web Application

In order to fetch the data requested by the user, the Frontend Web Application sends an appropriate GET request to the relevant "Data Management" microservice. The microservice returns the requested data, which is visualised using the Highcharts library. The Highcharts library is also used to provide the option of downloading the data as an image graph or as a CSV file. In order to refresh the presented data whenever new data is received, the Frontend application performs HTTPS polling to the Frontend Listener microservice, periodically checking whether a new data import has occurred. Whenever a new data import is detected, a new request is sent to the relevant microservice and the presented data is updated automatically, without any user action. Overall, the Frontend application achieves seamless transitions without loading new pages or refreshing, owing to the fact that it was developed as a Single-Page Application.

<p align="right">(<a href="#top">back to top</a>)</p>

## Deployment

The whole project was deployed on the Heroku platform. Each of the microservices was deployed as a separate Heroku application. The microservices that need a database use Heroku PostgreSQL as a service. To use Apache Kafka for messaging in the deployment environment, we utilised Apache Kafka clusters provided by CloudKarafka were used as a service. The Frontend application was also deployed as a separate Heroku application. In total, we created 10 different Heroku applications, thus achieving the total decoupling of all backend microservices, whose only method of communication is through the Apache Kafka event bus.

<p align="right">(<a href="#top">back to top</a>)</p>

## Stress Testing

For the purposes of the project, we were also asked to perform stress testing on our application. Details regarding stress testing can be found in the `stress-testing` directory.

<p align="right">(<a href="#top">back to top</a>)</p>

## About us

This project was created by our team consisting of the members below:

- [Alex Kouridakis](https://github.com/alex-kouridakis)
- [Eleftherios Oikonomou](https://github.com/SeCre827)
- [Vikentios Vitalis](https://github.com/VikentiosVitalis)
- [Stefanos Tsolos](https://github.com/stefanostsolos)

Feel free to reach out to us for any comment or question!

<p align="right">(<a href="#top">back to top</a>)</p>
