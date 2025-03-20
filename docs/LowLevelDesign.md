
# Low-Level Design - Audio Noise Eraser

## 1. Component Breakdown

### Frontend Components

#### Core Components
| Component | Responsibility | Key Functions |
|-----------|----------------|---------------|
| `Index.tsx` | Main page container | Manages upload state, audio URLs, and component orchestration |
| `FileUploader.tsx` | Audio file upload interface | Handles drag-drop, file validation, upload triggering |
| `AudioControls.tsx` | Audio playback interface | Provides play, pause, volume, seek controls |
| `AudioVisualizer.tsx` | Waveform visualization | Renders real-time audio waveforms using canvas |
| `ComparisonSlider.tsx` | Before/after comparison | Interactive slider to compare original and processed audio |

#### Utility Components
| Component | Responsibility |
|-----------|----------------|
| `InfoCard.tsx` | Displays feature information cards |
| `Statistics.tsx` | Renders performance metrics |
| `Header.tsx` | Application header with navigation |
| `Footer.tsx` | Application footer with links |

#### Service Layer
| Service | Responsibility | Key Functions |
|---------|----------------|---------------|
| `api.ts` | Backend API communication | `processAudio()`, `downloadAudio()` |

### Backend Components

#### API Endpoints
| Endpoint | Method | Purpose | Parameters | Response |
|----------|--------|---------|------------|----------|
| `/process` | POST | Process audio file | File upload | Processed audio file |
| `/health` | GET | Health check | None | Status JSON |

#### Processing Pipeline
| Module | Function | Input | Output |
|--------|----------|-------|--------|
| `process_audio()` | Main processing function | File path | Processed audio, sample rate |
| `recover_sound()` | Reconstruct processed audio | X, mag_X, mag_output | Reconstructed complex spectrogram |

#### Neural Network Model
| Layer | Type | Neurons | Activation |
|-------|------|---------|------------|
| Input | Dense | Input Shape | - |
| Hidden 1 | Dense | 128 | ReLU |
| Hidden 2 | Dense | 256 | ReLU |
| Hidden 3 | Dense | 128 | ReLU |
| Output | Dense | Input Shape | Linear |

## 2. Data Structures

### Audio Processing Data Flow
```
Raw Audio File → Audio Samples (numpy array) → STFT (complex 2D array) → 
Magnitude Spectrogram (real 2D array) → Processed Magnitude (real 2D array) → 
Complex Spectrogram (complex 2D array) → Inverse STFT → Processed Audio Samples
```

### Key Data Types
| Data | Type | Shape | Description |
|------|------|-------|-------------|
| Raw Audio | Float32Array | [samples] | Time-domain audio samples |
| STFT | Complex64 | [freq_bins, time_frames] | Complex spectrogram |
| Magnitude | Float32 | [freq_bins, time_frames] | Absolute values of STFT |
| Phase | Float32 | [freq_bins, time_frames] | Phase angles of STFT |
| Model Input | Float32 | [time_frames, truncated_freq_bins] | Transposed and truncated magnitude |

## 3. Algorithm Details

### Audio Processing Pipeline
1. **File Loading**: 
   ```python
   x, sr = librosa.load(file_path, sr=None)
   ```

2. **STFT Computation**:
   ```python
   X = librosa.stft(x, n_fft=1024, hop_length=512)
   ```

3. **Magnitude Calculation**:
   ```python
   mag_X = np.abs(X)
   ```

4. **Input Preparation**:
   ```python
   mag_X_input = np.transpose(mag_X)[:, :100]
   ```

5. **Model Inference**:
   ```python
   output = model.predict(mag_X_input)
   ```

6. **Audio Reconstruction**:
   ```python
   phase_X = np.angle(X)
   recovered_complex = mag_output * np.exp(1j * phase_X)
   ```

7. **Inverse STFT**:
   ```python
   recon_sound = librosa.istft(s_hat, hop_length=512, win_length=1024)
   ```

## 4. Error Handling

| Error Type | Handling Strategy | User Experience |
|------------|-------------------|-----------------|
| Invalid File Format | Validate file extension and MIME type | User-friendly error message |
| Empty File | Check file size before processing | Error message prompt |
| Processing Error | Try-except around processing code | General error notification |
| Model Error | Graceful degradation with feedback | Error message with retry option |

## 5. Performance Considerations

### Optimizations
- **Memory Management**: Temporary file cleanup after processing
- **Processing Time**: Truncation of frequency bins to essential range
- **Model Efficiency**: Using intermediate layer output instead of full model when possible

### Resource Usage
- **CPU**: Heavy during STFT/ISTFT operations and model inference
- **Memory**: Proportional to audio file length and FFT window size
- **Storage**: Temporary files during processing, cleaned up after completion

## 6. Security Considerations

- **File Validation**: Check file extensions and MIME types
- **Temporary Storage**: Use secure temporary directories
- **Resource Limiting**: Implement maximum file size checks
- **Output Sanitization**: Ensure safe file paths for output
