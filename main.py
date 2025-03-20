
import os
import tensorflow as tf
import numpy as np

from model.model_definition import create_model
from audio.audio_processor import (
    load_audio, compute_stft, compute_magnitude, 
    prepare_input, reconstruct_audio, save_audio
)
from utils.sound_utils import feedforward, recover_sound, calculate_snr
from training.train import train_model, save_model

def main():
    # Load training and testing files
    print("Loading audio files...")
    s, sr = load_audio('train_clean_male.wav')
    sn, sr = load_audio('train_dirty_male.wav')
    x_test, sr = load_audio('test_01.wav')
    x_test2, sr = load_audio('test_02.wav')
    
    # Compute STFT
    print("Computing STFT...")
    S = compute_stft(s)
    X = compute_stft(sn)
    X_test = compute_stft(x_test)
    X_test2 = compute_stft(x_test2)
    
    # Calculate magnitudes
    print("Computing magnitudes...")
    mag_S = compute_magnitude(S)
    mag_X = compute_magnitude(X)
    mag_X_test = compute_magnitude(X_test)
    mag_X_test2 = compute_magnitude(X_test2)
    
    # For demonstration purposes, using placeholder data as in the original
    print("Creating placeholder tensors for training...")
    mag_X_placeholder = tf.random.normal([100, 2459])
    mag_S_placeholder = tf.random.normal([100, 2459])
    
    # Create and train model
    print("Creating model...")
    model = create_model(mag_X_placeholder.shape[0])
    
    print("Training model...")
    # In a real scenario, you would use actual data, not placeholders
    model = train_model(model, mag_X_placeholder, mag_S_placeholder)
    
    # Process test files
    print("Processing test files...")
    # Prepare input for the model
    mag_X_test_input = prepare_input(mag_X_test)
    mag_X_test2_input = prepare_input(mag_X_test2)
    
    # Get intermediate layer outputs
    s_hat_test1 = feedforward(mag_X_test_input, model, 2)
    s_hat_test2 = feedforward(mag_X_test2_input, model, 2)
    
    # Recover complex spectrograms
    s_hat1 = recover_sound(X_test, mag_X_test, s_hat_test1.T)
    s_hat2 = recover_sound(X_test2, mag_X_test2, s_hat_test2.T)
    
    # Reconstruct audio
    print("Reconstructing audio...")
    recon_sound1 = reconstruct_audio(s_hat1)
    recon_sound2 = reconstruct_audio(s_hat2)
    
    # Save reconstructed audio
    save_audio('test_s_01_recons.wav', recon_sound1, sr)
    save_audio('test_s_02_recons.wav', recon_sound2, sr)
    
    # Process train dirty file for testing
    print("Processing training file for testing...")
    s_hat_test3 = feedforward(tf.transpose(mag_X), model, 2)
    s_hat3 = recover_sound(X, mag_X, s_hat_test3.T)
    recon_sound3 = reconstruct_audio(s_hat3)
    
    # Calculate SNR
    size_recon_sound3 = np.shape(recon_sound3)[0]
    s_truncated = s[:size_recon_sound3]
    snr = calculate_snr(s_truncated, recon_sound3)
    print(f'Value of SNR: {snr}')
    
    # Save the model
    save_model(model, 'my_model.h5')

if __name__ == "__main__":
    main()
