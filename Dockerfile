# ---- Base Node ----
FROM node:16-slim AS frontend-build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY public/ ./public/
COPY src/ ./src/
COPY index.html vite.config.ts tsconfig*.json tailwind.config.ts postcss.config.js components.json ./

# Build the frontend
RUN npm run build

# ---- Base Python ----
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY api/ ./api/
COPY model/ ./model/
COPY audio/ ./audio/
COPY utils/ ./utils/
COPY training/ ./training/
COPY my_model.h5 .

# Copy the built frontend from the frontend-build stage
COPY --from=frontend-build /app/dist ./static

# Expose port for the application
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=api/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV STATIC_FOLDER=./static

# Update the Flask app to serve the static files
COPY <<EOF api/app.py
from flask import Flask, request, jsonify, send_file, send_from_directory
import os
import librosa
import numpy as np
import tensorflow as tf
import soundfile as sf
import tempfile
from flask_cors import CORS

app = Flask(_name_, static_folder=os.environ.get('STATIC_FOLDER', './static'))
CORS(app)  # Enable CORS for all routes

# Load the saved model
model = tf.keras.models.load_model('my_model.h5')

def process_audio(file_path):
    # Load the audio file
    x, sr = librosa.load(file_path, sr=None)
    
    # Compute STFT
    X = librosa.stft(x, n_fft=1024, hop_length=512)
    
    # Calculate magnitude
    mag_X = np.abs(X)
    
    # Reshape for model input
    mag_X_input = np.transpose(mag_X)[:, :100]
    
    # Get model output
    output = model.predict(mag_X_input)
    
    # Recover complex values
    s_hat = recover_sound(X, mag_X, np.transpose(output))
    
    # Inverse STFT
    recon_sound = librosa.istft(s_hat, hop_length=512, win_length=1024)
    
    return recon_sound, sr

def recover_sound(X, mag_X, mag_output):
    # Get phase information
    phase_X = np.angle(X)
    
    # Pad output to match X's shape if needed
    pad_rows = X.shape[0] - mag_output.shape[0]
    pad_cols = X.shape[1] - mag_output.shape[1]
    
    # Ensure pad values are non-negative
    pad_rows = max(0, pad_rows)
    pad_cols = max(0, pad_cols)
    
    mag_output_padded = np.pad(mag_output, ((0, pad_rows), (0, pad_cols)))
    
    # Recombine magnitude with original phase
    recovered_complex = mag_output_padded * np.exp(1j * phase_X)
    
    return recovered_complex

@app.route('/process', methods=['POST'])
def process():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file extension
    allowed_extensions = {'.wav', '.mp3'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        return jsonify({'error': 'File type not supported. Please upload WAV or MP3 files.'}), 400
    
    try:
        # Save uploaded file temporarily
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        
        # Process the audio
        processed_audio, sr = process_audio(temp_path)
        
        # Save processed audio
        output_path = os.path.join(temp_dir, 'processed_' + file.filename)
        sf.write(output_path, processed_audio, sr)
        
        # Return the processed file
        return send_file(
            output_path,
            as_attachment=True,
            download_name='processed_' + file.filename,
            mimetype='audio/' + file_ext[1:]
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up temporary files
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if 'output_path' in locals() and os.path.exists(output_path):
            os.remove(output_path)
        os.rmdir(temp_dir)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

# Serve frontend static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if _name_ == '_main_':
    app.run(host='0.0.0.0', port=5000)
EOF

# Run the application
CMD ["python", "-m", "flask", "run"]
