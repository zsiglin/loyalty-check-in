# Check-in App Homework

## Requirements and Installation
-   Node >= 8.9.1  
-   nodemon  
	- via npm: `npm install -g nodemon`.
-   yarn package manager
	- via Homebrew on MacOS: `brew install yarn` OR npm: `npm install -g yarnpkg`.

Once these are installed you can run `yarn start` in your terminal. Navigate to  [http://127.0.0.1:3000](http://127.0.0.1:3000/) in your browser to see the page. For this project, I tested only in the latest version of Chrome, so that's what I would recommend using. The UI was designed with the idea that it might be used on a tablet.

## Production Improvements
If the time constraint were removed and this were being deployed to a production environment, there are a number of things I would improve upon. Here are a just a few:

-   Add more robust exception handling
-   Client side (Verify phone number is of proper length, some of the error responses are quite robotic)
-   Server side (More thoroughly handle garbage data, edge cases, vulnerabilities)
-   Swap SQLite3 for something that's more suitable/scalable (MySQL/Postgres).
-   Beef up the data model (track check-in location and other things).
-   Add a better build system (CSS preprocessor, asset minification, JS transpiler for better browser support)
-   Add a front-end framework to make future changes scalable/pleasant (React/Angular).
-   Add responsive CSS to better handle more screen sizes.
-   Improve some of the rough edges of general UI/UX.
-   Add test coverage, particularly for the backend.
-   Move Mailgun integration to a background process to reduce request latency. (Queue/workers, Amazon SQS).