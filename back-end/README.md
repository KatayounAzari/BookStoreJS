## Backend structure

- App.js: Serves as the main entry point for the application.

- Routes: Routes are responsible for defining the endpoints (URLs) of your web application and mapping HTTP requests to specific controller actions.

    They act as the entry point for client requests, determining how different requests should be handled based on the URL and HTTP method.

    Define the application's endpoints and map requests to controller actions.

- Controller: Controllers contain the business logic for handling requests and responses. They interact with models to retrieve, update, and delete data, and they format the data to be sent back to the client.

    They serve as an intermediary between the routes and the models, processing the input from the routes and sending the appropriate response.

    Contain the logic for processing requests, interacting with models, and sending responses.

- Models: Models represent the data structure of the application and contain definitions of the data schema. They handle data validation, querying, and interaction with the database.

    They encapsulate the data logic and ensure that data is correctly structured and stored.

    Define the data structure and interact with the database, ensuring data integrity and validation.