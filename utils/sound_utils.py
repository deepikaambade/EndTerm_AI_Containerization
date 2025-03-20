
import numpy as np
import tensorflow as tf

def feedforward(input_data, model, layer_num):
    """
    Run input data through the model and get the output of a specific layer.
    
    Args:
        input_data: Input data for the model
        model: TensorFlow model
        layer_num: Layer number to get the output from
        
    Returns:
        layer_output: Output of the specified layer
    """
    # Ensure the input_data is a tensor compatible with model
    input_tensor = tf.convert_to_tensor(input_data, dtype=tf.float32)
    intermediate_model = tf.keras.Model(inputs=model.input, outputs=model.layers[layer_num].output)
    output = intermediate_model(input_tensor)

    return output.numpy()

def recover_sound(X, mag_X, mag_output):
    """
    Recover complex spectrogram from magnitude output using original phase.
    
    Args:
        X: Original complex spectrogram
        mag_X: Original magnitude spectrogram
        mag_output: Processed magnitude spectrogram
        
    Returns:
        recovered_complex: Recovered complex spectrogram
    """
    # Get the phase of X
    phase_X = np.angle(X)

    # Pad mag_output to match X's shape
    pad_rows = X.shape[0] - mag_output.shape[0]
    pad_cols = X.shape[1] - mag_output.shape[1]

    # Ensure pad values are non-negative
    pad_rows = max(0, pad_rows)
    pad_cols = max(0, pad_cols)

    mag_output_padded = tf.pad(mag_output, [[0, pad_rows], [0, pad_cols]])
    mag_output_padded = mag_output_padded.numpy()

    # Recombine magnitude with original phase
    recovered_complex = mag_output_padded * np.exp(1j * phase_X)

    return recovered_complex

def calculate_snr(original, processed):
    """
    Calculate the Signal-to-Noise Ratio (SNR) in dB.
    
    Args:
        original: Original audio data
        processed: Processed audio data
        
    Returns:
        snr: Signal-to-Noise Ratio in dB
    """
    # Ensure same length
    min_length = min(len(original), len(processed))
    original = original[:min_length]
    processed = processed[:min_length]
    
    # Calculate SNR
    num = np.dot(original.T, original)
    den = np.dot((original - processed).T, (original - processed))
    snr = 10 * np.log10(num/den)
    
    return snr
