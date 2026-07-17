import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file client-side to be under 500KB.
 * @param {File} file The raw image file object.
 * @returns {Promise<File>} The compressed image file object.
 */
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.48, // Limit strictly under 500KB
    maxWidthOrHeight: 1600, // Downscale width/height if needed
    useWebWorker: true,
    initialQuality: 0.85
  };
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed image: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB`);
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // Fallback to raw file if compression fails
  }
};

/**
 * Compresses an image client-side and uploads it directly to ImgBB.
 * @param {File} file The raw image file object.
 * @returns {Promise<string>} The hosted image URL.
 */
export const uploadToImgBB = async (file) => {
  try {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      throw new Error("ImgBB API key is not configured. Please add VITE_IMGBB_API_KEY in your .env file.");
    }

    // 1. Compress image to under 500KB
    const compressed = await compressImage(file);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append('image', compressed);

    // 3. Send upload request to ImgBB
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || "ImgBB upload failed");
    }
  } catch (error) {
    console.error("Upload to ImgBB failed:", error);
    throw error;
  }
};

/**
 * Validates video file size and type.
 * Enforces the 500KB size limit.
 * @param {File} file The selected video file object.
 * @returns {{isValid: boolean, error: string|null}} Validation status.
 */
export const validateVideoFile = (file) => {
  const maxSizeBytes = 500 * 1024; // 500KB
  if (!file.type.startsWith('video/')) {
    return { isValid: false, error: 'Only MP4, WebM, or other video formats are supported.' };
  }
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `Video file size is ${(file.size / 1024).toFixed(1)}KB, which exceeds the 500KB limit. Please compress it using the built-in compressor.` 
    };
  }
  return { isValid: true, error: null };
};

/**
 * Client-side video compressor that encodes video using Canvas and MediaRecorder to fit under 500KB.
 * @param {File} file Raw video File.
 * @param {Function} onProgress Optional callback for progress updates.
 * @returns {Promise<File>} Compressed video File.
 */
export const compressVideo = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = () => {
      // Downscale resolution to max 480px width or height
      const maxDim = 480;
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const durationSec = video.duration || 10;
      // Target 450KB to leave a buffer
      const targetSizeKB = 450;
      const targetBytes = targetSizeKB * 1024; 
      const targetBits = targetBytes * 8;
      let bitrate = Math.floor(targetBits / durationSec);
      
      // Enforce sensible bounds (e.g. 80kbps to 800kbps)
      bitrate = Math.max(80000, Math.min(bitrate, 800000));

      const fps = 24;
      const stream = canvas.captureStream(fps);
      
      let mediaRecorder;
      const chunks = [];

      try {
        const options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: bitrate
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm;codecs=vp8';
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm';
        }
        
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream, { videoBitsPerSecond: bitrate });
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
        const compressedFile = new File([compressedBlob], `compressed_${file.name.split('.')[0]}.webm`, {
          type: compressedBlob.type,
          lastModified: Date.now()
        });
        resolve(compressedFile);
      };

      mediaRecorder.start();
      video.play();

      const intervalTime = 1000 / fps;
      let frameCount = 0;
      const totalFrames = durationSec * fps;

      const drawInterval = setInterval(() => {
        if (video.paused || video.ended) {
          clearInterval(drawInterval);
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        } else {
          ctx.drawImage(video, 0, 0, width, height);
          frameCount++;
          if (onProgress) {
            const pct = Math.min(99, Math.round((frameCount / totalFrames) * 100));
            onProgress(pct);
          }
        }
      }, intervalTime);

      video.onended = () => {
        clearInterval(drawInterval);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };

      // Safety timeout: stop recording after video duration + 2s
      setTimeout(() => {
        clearInterval(drawInterval);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, (durationSec + 2) * 1000);
    };

    video.onerror = (err) => {
      reject(new Error("Failed to load video file. Make sure it is a valid format."));
    };
  });
};
