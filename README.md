# Sports Analytics Platform

A comprehensive sports analytics platform that provides data-driven insights for coaches, analysts, and enthusiasts.

## Key Features

- Real-time sports data visualization
- Player performance analysis
- Match prediction algorithms
- Automated data collection from multiple sources
- Interactive dashboard for data exploration

## Technology Stack

- Frontend: React Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Data Collection: Python

## Project Structure

```
sports-analytics/
├── FrontEnd/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
│
├── BackEnd/          # Node.js backend server
│   ├── src/          # Source code
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   └── package.json  # Backend dependencies
│
├── Data/             # Python data extraction and processing
│   ├── extractors/   # Data extraction modules
│   │   ├── seasons_extractor.py  # Extracts season data
│   │   ├── races_extractor.py    # Extracts race data
│   │   └── drivers_extractor.py  # Extracts driver data
│   ├── extracted/    # Directory for extracted JSON files
│   ├── mongodb/      # Directory for MongoDB-adapted JSON files
│   ├── mongodb_adapter.py  # MongoDB connection and data adaptation
│   └── main.py       # Main script to run all extractors
│
├── documentation/    # Project documentation
├── .env             # Environment variables
└── requirements.txt  # Python dependencies
```

## System Requirements

### Prerequisites

- Node.js (LTS version recommended)
- MongoDB
- Python 3.x
- npm or yarn

### Python Dependencies
- requests==2.31.0
- pymongo==4.6.1
- python-dateutil==2.8.2
- python-dotenv==1.0.0

## Installation

1. Clone the repository:
```bash
git clone [REPOSITORY_URL]
```

2. Install frontend dependencies:
```bash
cd FrontEnd
npm install
npm install react-router-dom
```

3. Install backend dependencies:
```bash
cd BackEnd
npm install
npm i nodemon -D
npm i express
npm i cors
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

1. Create a `.env` file in the root directory with the following variables:
```env
# SportRadar API Configuration
SPORTRADAR_API_KEY=your_api_key_here
SPORTRADAR_BASE_URL=https://api.sportradar.com/indycar/trial/v2/en

# MongoDB Configuration
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
```

2. Ensure MongoDB is running
3. Start the required services

## Data Collection and Processing

### Data Extraction Process
The `Data` folder contains Python scripts that handle data collection and processing:

1. **Seasons Extractor** (`seasons_extractor.py`):
   - Fetches available seasons from SportRadar API
   - Filters seasons between 2017-2025
   - Saves season data to `Data/extracted/seasons.json`

2. **Races Extractor** (`races_extractor.py`):
   - Processes each season to extract race information
   - Fetches detailed race data from SportRadar API
   - Saves race data to `Data/extracted/season_{year}.json`

3. **Drivers Extractor** (`drivers_extractor.py`):
   - Extracts driver information from race data
   - Consolidates driver data across seasons
   - Saves driver data to `Data/extracted/drivers.json`

4. **MongoDB Adapter** (`mongodb_adapter.py`):
   - Connects to MongoDB Atlas
   - Transforms JSON data for MongoDB storage
   - Creates necessary indexes for efficient querying
   - Loads data into MongoDB collections

### Running Data Collection
To run the data collection process:

```bash
cd Data
python main.py [option]

Options:
    all     - Run all extractors and load data into MongoDB
    seasons - Run only the seasons extractor
    races   - Run only the races extractor
    drivers - Run only the drivers extractor
    mongodb - Load extracted data into MongoDB
```

## Frontend and Backend

### Frontend (React + TypeScript)
- Modern, responsive user interface
- Real-time data visualization
- Interactive charts and graphs
- Performance analysis tools

### Backend (Node.js + Express)
- RESTful API endpoints
- Data processing and aggregation
- MongoDB integration
- Authentication and authorization

## Starting the Project

1. Start the backend:
```bash
cd BackEnd
npm start
```

2. Start the frontend:
```bash
cd FrontEnd
npm run dev
```

3. Run data collection (if needed):
```bash
cd Data
python main.py all
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
