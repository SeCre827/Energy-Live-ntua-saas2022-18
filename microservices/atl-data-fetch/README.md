# "Actual Total Load" Data Fetch

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

## Functionality

This microservice subscribes to the ADMIN_FETCH topic of the Kafka Event Bus upon initialisation. Whenever the Admin Application publishes to that topic, this microservice downloads the current file corresponding to the "Actual Total Load" dataset, from the SFTP server. The file is then parsed, and a JSON containing only the required information is created. This JSON is finally uploaded to Google Drive. Upon successful upload, this microservice publishes a new message to the FETCHED_ATL topic, to notify the next microservice ("Actual Total Load" Data Management).
