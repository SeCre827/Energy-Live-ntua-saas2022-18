# Frontend Listener

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

This microservice subscribes to the STORED_{ATL, AGPT, PF} topics upon initialisation. Whenever one of the {ATL, AGPT, PF} Data Management microservices publishes to the corresponding topic, this microservice updates the locally stored timestamp of the last import of data of the corresponding dataset.

This microservice also exposes a GET (/getLatest) endpoint to be used by the frontend web application. This endpoint returns the timestamps of the last import of data for all datasets. The frontend is expected to perform HTTP polling on this endpoint, to be informed in real time whenever new data is imported.
