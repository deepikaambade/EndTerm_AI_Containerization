
import tensorflow as tf
import numpy as np
from model.model_definition import loss_function

def train_model(model, mag_X, mag_S, epochs=200, batch_size=100):
    """
    Train the model on the given data.
    
    Args:
        model: TensorFlow model
        mag_X: Input data (magnitude spectrogram)
        mag_S: Target data (clean magnitude spectrogram)
        epochs: Number of training epochs
        batch_size: Batch size
        
    Returns:
        model: Trained model
    """
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.0005)
    
    for epoch in range(epochs):
        size = 0
        for i in range(0, 2500, batch_size):
            size += batch_size
            if size <= mag_X.shape[1]:
                batch_x = mag_X[:, i:size]
                batch_y = mag_S[:, i:size]
            else:
                batch_x = mag_X[:, i:mag_X.shape[1]]
                batch_y = mag_S[:, i:mag_S.shape[1]]

            # Gradient computation and weight updates
            with tf.GradientTape() as tape:
                # Transpose to match the model's expected input shape
                predictions = model(tf.transpose(batch_x), training=True)
                loss_value = loss_function(tf.transpose(batch_y), predictions)

            gradients = tape.gradient(loss_value, model.trainable_variables)
            optimizer.apply_gradients(zip(gradients, model.trainable_variables))

        # Log loss every 10 epochs
        if epoch % 10 == 0:
            print(f"Epoch {epoch}, Loss: {loss_value.numpy()}")

    print("Training complete!")
    return model

def save_model(model, filepath):
    """
    Save the model to a file.
    
    Args:
        model: TensorFlow model
        filepath: Path to save the model
    """
    model.save(filepath)
    print(f"Model saved to {filepath}")
