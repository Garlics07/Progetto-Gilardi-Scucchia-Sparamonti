# SportAnalytics Platform

A comprehensive sports analytics platform that provides data-driven insights for coaches, analysts, and fans.

## Features

- Real-time sports data visualization
- Player performance analytics
- Match prediction algorithms
- Automated data collection from various sources
- Interactive dashboard for data exploration

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- Data Collection: Python

## Project Structure

```
sport-analytics/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
├── data-collection/   # Python scripts for data collection
└── docs/             # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Install data collection dependencies:
   ```bash
   cd data-collection
   pip install -r requirements.txt
   ```

### Running the Application

1. Start MongoDB service
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
4. Run data collection scripts:
   ```bash
   cd data-collection
   python main.py
   ```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## License

MIT 