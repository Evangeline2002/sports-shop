# Tamil Nadu Sports Shop Mapping System

## Overview
The Tamil Nadu Sports Shop Mapping System is a full-stack web application designed to provide a comprehensive directory and mapping system for sports shops across all 38 districts in Tamil Nadu. This application leverages Google Maps for visualization and Firebase for backend services, ensuring a seamless user experience.

## Features
- **Authentication**: Secure admin login using Firebase Authentication.
- **Dashboard**: An admin dashboard displaying total sports shops, district-wise statistics, recently added shops, and analytics.
- **District Management**: Manage and filter sports shops by the 38 districts of Tamil Nadu.
- **Map Integration**: Interactive map with district-wise markers, clustering, and detailed shop information.
- **Data Collection**: Automatic fetching of sports shop data using Google Places API.
- **Excel Import/Export**: Upload and download shop data in Excel format using SheetJS.
- **Search and Filters**: Global search functionality and various filters for enhanced user experience.
- **Admin Features**: CRUD operations for managing sports shops, including bulk import and deletion.
- **Analytics**: Visual representation of data using Recharts for better insights.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Axios, React Leaflet, Leaflet Marker Cluster, React Icons, Framer Motion, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: Firebase Firestore.
- **APIs**: Google Maps JavaScript API, Google Places API, Google Geocoding API.
- **Excel Processing**: SheetJS (xlsx).

## Folder Structure
```
Tamil_Nadu_Sports_Shop_Mapping_System
├── client
│   ├── public
│   ├── src
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server
│   ├── src
│   ├── package.json
│   └── .eslintrc.js
├── firebase.rules
├── scripts
├── .env.example
├── README.md
└── deployment
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```
3. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```
4. Set up Firebase and Google Maps API keys in the `.env` file based on the `.env.example` provided.

## Usage
- Start the client application:
  ```
  cd client
  npm run dev
  ```
- Start the server application:
  ```
  cd server
  npm start
  ```

## Deployment
Refer to the deployment guides in the `deployment` folder for instructions on deploying the application to Vercel, Netlify, or Firebase Hosting.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.