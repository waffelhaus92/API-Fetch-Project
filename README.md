This is a simple React application that fetches data from an API, displays it in a list, and implements pagination for better user experience.
Table of Contents

    Installation
    Usage
    Components
    Custom Hooks
    API Fetching
    Pagination
    License

Installation

    Clone the repository:

    bash

git clone <(https://github.com/waffelhaus92/API-Fetch-Project.git)>

Navigate to the project directory:

bash

cd react-pagination-app

Install dependencies:

bash

    npm install

Usage

To run the application locally:

bash

npm start

This will start the development server, and you can view the app in your browser at http://localhost:3000.
Components
App Component

The main component (App.js) fetches data from an external API, displays it in a list, and implements pagination for better navigation through the dataset. 
Pagination Component

The Pagination component generates page buttons based on the number of pages required. It takes an array of items, page size, and a callback function for handling page changes.
Custom Hooks
useDataApi

The useDataApi hook is a custom React hook that fetches data from an API using Axios. It handles loading and error states, making it easy to manage asynchronous data fetching in functional components.
API Fetching

The application fetches data from the MediaStack API. Make sure to replace the placeholder API key in the useDataApi hook with your own key.
Pagination

Pagination is implemented to display a limited number of items per page for better user experience. You can customize the page size in the App.js file.
License

This project is licensed under the MIT License - see the LICENSE file for details.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
