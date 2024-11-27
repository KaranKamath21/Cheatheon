# Cheatheon Project

Cheatheon is a LeetCode plagiarism detection system built using Node.js (for the backend), React (for the frontend), and Python (for data acquisition and processing).

This README will guide you through setting up and running the project locally.

---

## Project Structure

Cheatheon/
├── backend/                # Node.js backend  
├── frontend/               # React frontend  
├── data/                   # Python scripts for data acquisition and processing  
├── .gitignore              # Git ignore configuration  
└── README.md               # This file  

---

## Prerequisites

- **Node.js** (for backend and frontend)
- **Python** (for data processing)
- **MongoDB** (for storing contest data)

---

## Backend Setup (Node.js)

1. Navigate to the `backend` directory and run:
   ```console
   cd backend
   ```
2. Install dependencies:
   ```console
   npm install
   ```

3.	Create a `.env file` in the root of the backend directory with the following content:
   ```console
   MONGO_URL=<your-mongo-db-url>
   PORT=5000  # You can change the port if needed
   ```

4. Start the backend server:
   ```console
   node index.js
   ```


## Frontend Setup (React)


1. Navigate to the frontend directory:
   ```console
   cd frontend
   ```
2. Install dependencies:
   ```console
   npm install
   ```

3.	Create a `.env file` in the root of the frontend directory with the following content:
   ```console
   MONGO_URL=<your-mongo-db-url>
   PORT=3000  # You can change the port if needed
   ```

4. Start the frontend server:
   ```console
   npm start
   ```


## Data Acquisition (Python)


1. Navigate to the data directory:
   ```console
   cd data
   ```
2. Install the required Python dependencies:
   ```console
   pip install -r requirements.txt
   ```

3.	Create a `.env file` in the root of the data directory with the following content:
   ```console
   MONGO_URL=<your-mongo-db-url>
   ```

3.	Before running the script, make sure to modify the contest_slug in the orchestration.py file with the desired contest slug from LeetCode.

4. Run the orchestration.py script to acquire data and process it:
   ```console
   python orchestration.py
   ```

This script will:  
	•	Fetch data from LeetCode APIs  
	•	Process the data using copy detection algorithms  
	•	Insert the processed data into MongoDB  
No additional steps are needed for data processing, just running this script will do everything automatically.



## .gitignore Configuration

Make sure your .gitignore is set up correctly to prevent committing unnecessary files like node_modules. Here is an example configuration:

# Ignore node_modules in both frontend and backend
frontend/node_modules/
backend/node_modules/

# Ignore environment files
.env




## Troubleshooting

	•	Missing Dependencies: If you encounter issues with missing dependencies, try running npm install in both the frontend and backend directories or pip install -r requirements.txt in the data directory.
	•	MongoDB Connection: Make sure your MongoDB instance is running and that you’ve correctly configured the MONGO_URL in the .env file.



License

This project is licensed under the MIT License.

### Key Sections in the README:

1. **Project Overview**: Describes the overall structure of your project.
2. **Prerequisites**: Lists the software that needs to be installed before running the project.
3. **Backend Setup**: Instructions for setting up and running the backend (Node.js).
4. **Frontend Setup**: Instructions for setting up and running the frontend (React).
5. **Data Acquisition Setup**: Instructions for running the Python script to acquire and process data from LeetCode.
6. **.gitignore Configuration**: Ensures that `node_modules` and environment files aren't tracked by Git.
7. **Troubleshooting**: Provides guidance on how to fix common issues, such as missing dependencies and MongoDB connection problems.

---