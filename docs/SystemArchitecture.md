
# System Architecture - Audio Noise Eraser

## Overview

The Audio Noise Eraser is a web application designed to remove unwanted noise from audio files using deep learning techniques. The system is structured as a client-server architecture with containerized deployment for scalability and portability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Docker Environment                         │
│  ┌───────────────────────┐          ┌────────────────────────┐  │
│  │   Frontend Container  │          │   Backend Container    │  │
│  │   (Node.js/React)     │◄────────►│   (Python/Flask)       │  │
│  │                       │  HTTP/   │                        │  │
│  │ - User Interface      │  REST    │ - RESTful API          │  │
│  │ - Audio Visualization │          │ - Audio Processing     │  │
│  │ - File Upload/Download│          │ - Neural Network Model │  │
│  └───────────────────────┘          └────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend (React Application)

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Application                          │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐│
│  │  Components   │  │   Services    │  │      UI Library       ││
│  │               │  │               │  │                       ││
│  │ - FileUploader│  │ - API Service │  │ - ShadCN Components  ││
│  │ - AudioPlayer │  │ - Audio Utils │  │ - Tailwind CSS       ││
│  │ - Visualizer  │  │               │  │                       ││
│  └───────────────┘  └───────────────┘  └───────────────────────┘│
│                                                                 │
│  ┌───────────────────────────────┐  ┌───────────────────────────┐│
│  │        Page Structure         │  │     State Management      ││
│  │                               │  │                           ││
│  │ - Index Page                  │  │ - React Hooks             ││
│  │ - Error Page                  │  │ - Context (if needed)     ││
│  └───────────────────────────────┘  └───────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 2. Backend (Flask Application)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Flask Application                           │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐│
│  │  API Routes   │  │ Audio Process │  │    Neural Network     ││
│  │               │  │    Logic      │  │         Model         ││
│  │ - /process    │  │               │  │                       ││
│  │ - /health     │  │ - STFT        │  │ - TensorFlow Model    ││
│  │               │  │ - Inference   │  │ - Trained Weights     ││
│  │               │  │ - ISTFT       │  │                       ││
│  └───────────────┘  └───────────────┘  └───────────────────────┘│
│                                                                 │
│  ┌───────────────────────────────┐  ┌───────────────────────────┐│
│  │        File Handling          │  │      Error Handling       ││
│  │                               │  │                           ││
│  │ - Temporary Storage           │  │ - Input Validation        ││
│  │ - Format Conversion           │  │ - Process Error Handling  ││
│  └───────────────────────────────┘  └───────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
   User                   Frontend                  Backend                 Model
    │                        │                         │                       │
    │  Upload Audio File    │                         │                       │
    │ ───────────────────► │                         │                       │
    │                        │                         │                       │
    │                        │     POST /process       │                       │
    │                        │ ────────────────────► │                       │
    │                        │                         │                       │
    │                        │                         │  Preprocess Audio    │
    │                        │                         │ ──────────────────► │
    │                        │                         │                       │
    │                        │                         │     Run Inference    │
    │                        │                         │ ◄────────────────── │
    │                        │                         │                       │
    │                        │                         │  Postprocess Audio   │
    │                        │                         │ ──────────────────► │
    │                        │                         │                       │
    │                        │   Processed Audio File  │                       │
    │                        │ ◄──────────────────── │                       │
    │                        │                         │                       │
    │  Audio Visualization   │                         │                       │
    │ ◄─────────────────── │                         │                       │
    │                        │                         │                       │
    │  Download Processed    │                         │                       │
    │ ◄─────────────────── │                         │                       │
    │                        │                         │                       │
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Setup                        │
│                                                                 │
│  ┌───────────────────────┐          ┌────────────────────────┐  │
│  │   Frontend (Node.js)  │          │   Backend (Python)     │  │
│  │   Port: 8080          │◄────────►│   Port: 5000           │  │
│  │   Volume: ./:/app     │          │   Volume: ./api:/app   │  │
│  └───────────────────────┘          └────────────────────────┘  │
│                                         │                       │
│                                         ▼                       │
│                             ┌────────────────────────┐          │
│                             │   Neural Network Model │          │
│                             │   Volume: ./my_model.h5│          │
│                             └────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: ShadCN UI components
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Key Dependencies**:
  - React Router for navigation
  - Web Audio API for visualization

### Backend
- **Framework**: Flask
- **Audio Processing**: Librosa, SoundFile
- **Machine Learning**: TensorFlow
- **Data Handling**: NumPy
- **Key Dependencies**:
  - Flask-CORS for cross-origin resource sharing
  - TensorFlow for model loading and inference

### Model
- **Framework**: TensorFlow
- **Architecture**: Deep Neural Network with multiple dense layers
- **Input**: Magnitude spectrograms from audio STFT
- **Output**: Denoised magnitude spectrograms
- **Performance Metric**: Signal-to-Noise Ratio (SNR)

### Deployment
- **Containerization**: Docker
- **Services**: Frontend, Backend
- **Networking**: Port mapping (8080:8080, 5000:5000)
- **Volumes**: Source code and model file mapping

## Sequence Flow

1. User uploads audio file through web UI
2. Frontend validates and sends to backend API
3. Backend saves file temporarily
4. Audio processing pipeline:
   - Convert audio to frequency domain using STFT
   - Extract magnitude information
   - Process with neural network model
   - Recombine with original phase information
   - Convert back to time domain using ISTFT
5. Backend returns processed audio file
6. Frontend displays visualizations and enables playback
7. User can download the processed file

## Future Enhancements

- Real-time audio processing
- Additional noise reduction algorithms
- Batch processing capability
- User accounts and saved history
- Advanced audio analysis and metrics
