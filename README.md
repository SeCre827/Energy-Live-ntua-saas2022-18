<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://user-images.githubusercontent.com/62433719/173231595-c83f613f-e583-4546-9752-8001b7146c61.png" alt="Logo" width="80" height="80">

  <h3 align="center"> Energy Live SasS18-NTUA-2022</h3>

  <p align="center">
  A SAAS project that folows the microservice archicture.
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
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
    <li><a href="#technical-details">Technical Details</a></li>
    <li><a href="#about-us">About us</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project was created for the SaaS course of NTUA ECE. We were asked to implement a system that gets energy Data from the [entso-e](https://www.entsoe.eu/) API for all the countries, process it and returns the required information to the user in a web app. The project follows the Micorservice architecture, uses Kafka as a choreographer between the microservices and serves the result in a website on the browser.

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

This section in about running the project either by installing and running it in your local machine.
Or if you just want to see how it works, you can see our live demo [here](https://i.wish.iknew/).
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the softwareX.

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
2. Set up kafka and the corresponding databases for each microservice following the instructionss found in the kafkatxt? TODO
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

Here we have to explaind how our project works

<p align="right">(<a href="#top">back to top</a>)</p>

## About us

This project was created by our team consisting of the mebmers below:
[Alex Kouridakis](https://github.com/alex-kouridakis)
[Eleftherios Oikonomou](https://github.com/SeCre827)
[Vikentios Vitalis](https://github.com/VikentiosVitalis)
[Stefanos Tsolos](https://github.com/stefanostsolos)

Feel free to reach out to us for any comment or question!

<p align="right">(<a href="#top">back to top</a>)</p>
