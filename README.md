# PDF Merger

A simple web application to merge multiple PDF files into one combined document. Built with React on the frontend and Express.js on the backend.

## Features

- Upload multiple PDF files (up to 10 at a time)
- Merge PDFs into a single downloadable file
- Preview merged PDF before downloading
- Clear uploaded files from server storage
- Responsive and user-friendly interface

## Technologies Used

- Frontend: React, Axios, CSS
- Backend: Node.js, Express, Multer, pdf-merger-js
- Security: Helmet, CORS
- File storage: Local filesystem (uploads folder)
- Environment variables for configuration

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pdf-merger.git
   cd pdf-merger

2. Install backend dependencies:

    ```bash
    cd server
    npm install

3. Install frontend dependencies:
    
    ```bash
    cd ../client
    npm install

4. Setup environment variables:
    Create a .env file in the server folder with the following content (adjust as needed):

PORT=5000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

### Running the App Locally

1. Start the backend server:

    ```bash
    cd server
    npm start

2. Start the frontend development server:

    ```bash
    cd ../client
    npm start 

3. Open your browser and visit http://localhost:3000 to use the app.

Deployment
Build the React app for production (npm run build in client folder).

Serve the static files from the backend by setting NODE_ENV=production.

Host the backend on a platform like Heroku, Vercel, or your preferred service.

API Endpoints
POST /api/merge — Merge uploaded PDF files (accepts multipart/form-data)

POST /api/clear-uploads — Clear uploaded files on the server

GET /api/health — Health check endpoint

## License
This project is open-source and available under the MIT License.

Feel free to contribute, report issues, or suggest features!