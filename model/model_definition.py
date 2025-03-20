
import tensorflow as tf

def create_model(input_shape, learning_rate=0.0005):
    """
    Create a deep neural network model for audio noise reduction.
    
    Args:
        input_shape: Shape of the input data (number of features)
        learning_rate: Learning rate for the optimizer
        
    Returns:
        model: Compiled TensorFlow model
    """
    input_layer = tf.keras.layers.Input(shape=(input_shape,), name="input")
    hidden_layer1 = tf.keras.layers.Dense(128, activation="relu", name="hidden1")(input_layer)
    hidden_layer2 = tf.keras.layers.Dense(256, activation="relu", name="hidden2")(hidden_layer1)
    hidden_layer3 = tf.keras.layers.Dense(128, activation="relu", name="hidden3")(hidden_layer2)
    output_layer = tf.keras.layers.Dense(input_shape, activation=None, name="output")(hidden_layer3)

    model = tf.keras.Model(inputs=input_layer, outputs=output_layer)
    optimizer = tf.keras.optimizers.Adam(learning_rate)
    
    return model

def loss_function(labels, predictions):
    """
    Mean squared error loss function.
    
    Args:
        labels: Target values
        predictions: Predicted values
        
    Returns:
        Loss value
    """
    return tf.reduce_mean(tf.square(labels - predictions))

def create_legacy_model(x, act_layers, neurons):
    """
    Create a model using the legacy approach (for backward compatibility).
    
    Args:
        x: Input tensor
        act_layers: List of activation functions
        neurons: List of neuron counts for each layer
        
    Returns:
        Output tensor after applying all layers
    """
    num_layers = len(act_layers)
    layers = [0]*num_layers

    for i in range(0, len(act_layers)):
        if i == 0:
            layers[i] = tf.keras.layers.Dense(units=neurons[i], activation=act_layers[i])
        elif i < num_layers-1:
            layers[i] = tf.keras.layers.Dense(units=neurons[i], activation=act_layers[i])
        else:
            layers[i] = tf.keras.layers.Dense(units=neurons[i], activation=act_layers[i])

    output = x
    for layer in layers:
        output = layer(output)
    return output
