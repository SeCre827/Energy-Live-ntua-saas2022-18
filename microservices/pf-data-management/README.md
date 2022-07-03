## "Physical Flows" Data Management

This microservice is responsible for getting the Physical Flows data for the countries in JSON format from Google Drive and insert them into the database.
It must be able to create, update and perform queries on these data and also inform the Kafka.

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

## Functionality

This microservice is responsible for getting the Physical Flows data for the countries in JSON format from Google Drive and insert them into the database.
It must be able to create, update and perform queries on these data and also publish in the corresponding Kafka topic.

This microservice also exposes a GET (/getData/:countryFrom/:countryTo/:dateFrom/:dateTo) endpoint, to be used by the frontend web application. This endpoint allows the retrieval of all Energy data between a country pair for the given time period.

