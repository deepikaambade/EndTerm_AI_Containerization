
import librosa
import numpy as np
import soundfile as sf
import tensorflow as tf

def load_audio(file_path, sr=None):
    """
    Load an audio file using librosa.
    
    Args:
        file_path: Path to the audio file
        sr: Sample rate (None for original)
        
    Returns:
        audio_data: Audio time series
        sample_rate: Sample rate
    """
    return librosa.load(file_path, sr=sr)

def compute_stft(audio_data, n_fft=1024, hop_length=512):
    """
    Compute the Short-Time Fourier Transform (STFT) of an audio signal.
    
    Args:
        audio_data: Audio time series
        n_fft: FFT window size
        hop_length: Number of samples between frames
        
    Returns:
        stft_data: STFT of audio_data
    """
    return librosa.stft(audio_data, n_fft=n_fft, hop_length=hop_length)

def compute_magnitude(stft_data):
    """
    Compute the magnitude of an STFT.
    
    Args:
        stft_data: STFT data
        
    Returns:
        magnitude: Magnitude of STFT
    """
    return np.abs(stft_data)

def prepare_input(magnitude, max_features=100):
    """
    Prepare input for the model by transposing and truncating.
    
    Args:
        magnitude: Magnitude spectrogram
        max_features: Maximum number of features to keep
        
    Returns:
        model_input: Input ready for the model
    """
    transposed = tf.transpose(magnitude)
    return transposed[:, :max_features]

def reconstruct_audio(complex_spectrogram, hop_length=512, win_length=1024):
    """
    Reconstruct audio from a complex spectrogram using inverse STFT.
    
    Args:
        complex_spectrogram: Complex spectrogram
        hop_length: Number of samples between frames
        win_length: Window length
        
    Returns:
        audio_data: Reconstructed audio time series
    """
    return librosa.istft(complex_spectrogram, hop_length=hop_length, win_length=win_length)

def save_audio(file_path, audio_data, sample_rate):
    """
    Save audio data to a file.
    
    Args:
        file_path: Path to save the audio file
        audio_data: Audio time series
        sample_rate: Sample rate
    """
    sf.write(file_path, audio_data, sample_rate)
    print(f"Audio saved to {file_path}")
