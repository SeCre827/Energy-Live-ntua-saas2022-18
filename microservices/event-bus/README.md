# Apache Kafka Event Bus

The microservices developed in this project will communicate via an instance of Apache Kafka. When the project is initialised, a broker for that instance of Kafka will be initialised and the following topics will be created:

- USER_CREATED
  - Publisher: **User Management**
    - Event: A new user has been created
  - Subscriber: **Licence Management**
    - Action: Update the list of users in the local database
    
- LICENCE_UPDATED
  - Publisher: **Licence Management**
    - Event: A user's licence has been updated
  - Subscriber: **User Management**
    - Action: Update user's licence expiration date in the local database

- FETCHED_{ATL, AGPT, PF}
  - Publishers: **{ATL, AGPT, PF} Data Fetch**
    - Event: A new CSV file with relevant data has been downloaded from the SFTP server, has been parsed into a JSON file, and has then been uploaded to Google Drive
  - Subscribers: **{ATL, AGPT, PF} Data Management**
    - Action: Download the parsed JSON from Google Drive, validate it, then store its contents in the local database

- STORED_{ATL, AGPT, PF}
  - Publishers: **{ATL, AGPT, PF} Data Management**
    - Event: New data has been stored in the database (as a result of the above procedure)
  - Subscriber: **Frontent Listener**
    - Action: Update the timestamp of the last update of the stored data of the corresponding dataset (ATL, AGPT or PF)

- ADMIN_FETCH
  - Publisher: **Admin Application**
    - Event: Admin command
  - Subscribers: **{ATL, AGPT, PF} Data Fetch**
    - Action: Fetch the current file from the SFTP server

- ADMIN_RESET
  - Publisher: **Admin Application**
    - Event: Admin command
  - Subscribers: **User Management**, **Licence Management**, **{ATL, AGPT, PF} Data Management**, **Frontend Listener**
    - Action: Reset all stored data to default

- RESET_RESPONSE
  - Publishers: **User Management**, **Licence Management**, **{ATL, AGPT, PF} Data Management**, **Frontend Listener**
    - Event: Reset successfully completed
  - Subscriber: **Admin Application**
    - Action: Notify admin of successful reset

- ADMIN_STATUS
  - Publisher: **Admin Application**
    - Event: Admin command
  - Subscribers: All microservices
    - Action: Check status

- STATUS_RESPONSE
  - Publishers: All microservices
    - Event: Status checked
  - Subscriber: **Admin Application**
    - Action: Notify admin of microservices' status
