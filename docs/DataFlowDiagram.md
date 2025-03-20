
# Data Flow Diagram - Audio Noise Eraser

## Level 0 DFD (Context Diagram)
```
+----------------+     Audio File      +-------------------+     Denoised Audio     +----------------+
|                | -------------------> |                   | --------------------->  |                |
|      User      |                     | Audio Noise Eraser |                        |      User      |
|                | <------------------ |                   | <---------------------  |                |
+----------------+   Denoised Audio    +-------------------+     Audio Feedback     +----------------+
```

## Level 1 DFD
```
                                    +-------------------+
                                    |                   |
                                    |   Web Interface   |
                                    |                   |
                                    +--------+----------+
                                             |
                                             | Audio File
                                             v
+----------------+    Audio File    +-------------------+    Processed Data    +-------------------+
|                | --------------->  |                   | -------------------> |                   |
|  File Upload   |                  |   Flask Backend   |                      |   Neural Network  |
|   Component    |                  |       API         |                      |       Model       |
|                | <---------------  |                   | <------------------- |                   |
+----------------+  Response Status  +-------------------+    Denoised Data    +-------------------+
                                             |
                                             | Denoised Audio
                                             v
                                    +-------------------+
                                    |                   |
                                    |  Audio Playback   |
                                    |    Component      |
                                    |                   |
                                    +-------------------+
```

## Level 2 DFD (Backend Processing)
```
                              +-------------------+
                              |                   |
                              |   Audio Upload    |
                              |                   |
                              +--------+----------+
                                       |
                                       | Raw Audio
                                       v
+----------------+     +-------------------+     +-------------------+     +-------------------+
|                |     |                   |     |                   |     |                   |
|  Temp Storage  | --> | Audio Preprocessing | --> |  Model Inference   | --> | Audio Reconstruction |
|                |     |     (STFT)        |     |                   |     |     (ISTFT)       |
+----------------+     +-------------------+     +-------------------+     +-------------------+
                                                                                   |
                                                                                   | Denoised Audio
                                                                                   v
                               +-------------------+     +-------------------+
                               |                   |     |                   |
                               | Processed Storage | --> | Audio Download/   |
                               |                   |     |     Playback      |
                               +-------------------+     +-------------------+
```

This data flow diagram illustrates how audio data flows through the Audio Noise Eraser system, from user upload through processing and back to user download/playback.
