
# Audio Noise Eraser

## Project Overview

Audio Noise Eraser is a web application for removing unwanted noise from audio files. It uses a deep neural network model to process WAV and MP3 files and produce cleaner, enhanced audio output.

## Features

- Upload WAV or MP3 audio files
- AI-powered noise reduction
- Real-time audio visualization
- Before/after comparison
- Download processed audio

## Technologies Used

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- ShadCN UI components
- React Router for navigation

### Backend
- Flask RESTful API
- TensorFlow for the deep learning model
- Librosa for audio processing

### Deployment
- Docker and Docker Compose for containerization

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.9+)
- Docker and Docker Compose (optional)

### Running with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd audio-noise-eraser

# Start the application
docker-compose up
```

The frontend will be available at http://localhost:8080 and the backend API at http://localhost:5000.

### Manual Setup

#### Backend

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
cd api
flask run
```

#### Frontend

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## API Endpoints

- `POST /process` - Upload and process an audio file
- `GET /health` - Health check endpoint

## Model Information

The noise reduction model is a deep neural network trained to separate noise from audio signals. It uses spectral analysis and reconstruction techniques to identify and remove unwanted noise patterns while preserving the original audio quality.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
