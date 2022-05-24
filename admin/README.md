# Admin Application

Usage:

* `npm run`: View list of available functions
* `npm run update_files`: Move the next in order CSV file from the Datasets folder to the Current folder, for each dataset
* `npm run reset_files`: Move the file from the Current folder back to the Datasets folder, for each dataset
* `npm run delete_uploaded`: Delete all files uploaded by the microservices in the FileHost folder
* `npm run fetch_files`: Publish an event to the ADMIN_FETCH topic of the Kafka event bus
* `npm run reset`: Publish an event to the ADMIN_RESET topic of the Kafka event bus and listen to responses in the RESET_RESPONSE topic
* `npm run status`: Publish an event to the ADMIN_STATUS topic of the Kafka event bus and listen to responses in the STATUS_RESPONSE topic
