
from flask import Flask, request, jsonify, send_file
import os
import librosa
import numpy as np
import tensorflow as tf
import soundfile as sf
import tempfile
from flask_cors import CORS

app = Flask(__name__)
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
