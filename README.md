# Invoice-Parser-client
**Front-end application for an invoice submission interface**

A React application that allows the user to create and delete invoice records from a MongoDB cluster via an [Express.js API](https://github.com/stevopritchard/Invoice-Parser-server).

The application uses the AWS Textract API to identify key information in the submitted image(s), which is then returned to the client app to be edited or saved to the MongoDB collection.

Note that the application allows for the submission multiple files at the same time, but will only send *.jpeg* and *.png* files to the API.
