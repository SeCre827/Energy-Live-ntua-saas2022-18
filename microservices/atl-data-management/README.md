# "Actual Total Load" Data Management

Microservice developed using the NestJS framework as part of the semester project of the SaaS course, ECE NTUA, 8th Semester, Team 2022-18.

## Installation

```bash
$ npm install
```

## Running the microservice

Before running the microservice, the Kafka Event Bus must have been initialised.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<!--
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
-->

## Functionality

This microservice subscribes to the FETCHED_ATL topic of the Kafka Event Bus upon initialisation. Whenever the "Actual Total Load" Data Fetch microservice publishes to that topic, this microservice downloads the parsed file uploaded to Google Drive by the previous microservice. The downloaded file is validated and its contained data are then imported into the local database.

This microservice also exposes a GET (/getData/:countryId/:dateFrom/:dateTo) endpoint, to be used by the frontend web application. This endpoint allows the retrieval of all data corresponding to a country for a given time period.
