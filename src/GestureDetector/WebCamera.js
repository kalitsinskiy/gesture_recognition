export const VIDEO_SIZE = {
  '640 X 480': {width: 640, height: 480},
  '640 X 360': {width: 640, height: 360},
  '360 X 270': {width: 360, height: 270}
};

export const STATE = {
  camera: {targetFPS: 60, sizeOption: '640 X 480'},
  backend: '',
  flags: {},
  modelConfig: {}
};

export const DEFAULT_LINE_WIDTH = 2;
export const DEFAULT_RADIUS = 4;

const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};


class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.canvas = document.createElement("CANVAS");
    this.ctx = this.canvas.getContext('2d');
  }

  setHands(hands) {
    this.drawResults(hands);
  }

  returnLiveDetection() {
    return this.canvas;
  }

  /**
   * Initiate a Camera instance and wait for the camera stream to be ready.
   * @param cameraParam From app `STATE.camera`.
   * @param onWebCamError external callback on camera setup error
   */
  static async setupCamera(cameraParam, onWebCamError) {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
      }

      const {targetFPS, sizeOption} = cameraParam;
      const $size = VIDEO_SIZE[sizeOption];
      const videoConfig = {
        'audio': false,
        'video': {
          facingMode: 'user',
          // Only setting the video to a specified size for large screen, on
          // mobile devices accept the default size.
          width: $size.width,
          height:  $size.height,
          frameRate: {
            ideal: targetFPS,
          }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

      const camera = new WebCamera();
      camera.video.srcObject = stream;

      await new Promise((resolve) => {
        camera.video.onloadedmetadata = () => {
          resolve();
        };
      });

      await camera.video.play();

      const videoWidth = camera.video.videoWidth;
      const videoHeight = camera.video.videoHeight;
      // Must set below two lines, otherwise video element doesn't show.
      camera.video.width = videoWidth;
      camera.video.height = videoHeight;

      camera.canvas.width = videoWidth;
      camera.canvas.height = videoHeight;
      // const canvasContainer = document.querySelector('.canvas-wrapper');
      // canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

      // Because the image from camera is mirrored, need to flip horizontally.
      camera.ctx.translate(camera.video.videoWidth, 0);
      camera.ctx.scale(-1, 1);

      return camera;
    } catch (error) {
      onWebCamError(error);
    }
  }

  drawCtx() {
    this.ctx.drawImage(
        this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  /**
   * Draw the keypoints on the video.
   * @param hands A list of hands to render.
   */
  drawResults(hands) {
    this.drawCtx();
    // Sort by right to left hands.
    hands.sort((hand1, hand2) => {
      if (hand1.handedness < hand2.handedness) return 1;
      if (hand1.handedness > hand2.handedness) return -1;
      return 0;
    });

    // Pad hands to clear empty scatter GL plots.
    while (hands.length < 2) hands.push({});

    for (let i = 0; i < hands.length; ++i) {
      this.drawResult(hands[i]);
    }
  }

  /**
   * Draw the keypoints on the video.
   * @param hand A hand with keypoints to render.
   */
  drawResult(hand) {
    if (hand.keypoints != null) {
      const keypointsArray = hand.keypoints;
      this.ctx.fillStyle = hand.handedness === 'Left' ? 'Red' : 'Blue';
      this.ctx.strokeStyle = 'White';
      this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

      for (let i = 0; i < keypointsArray.length; i++) {
        const y = keypointsArray[i].x;
        const x = keypointsArray[i].y;
        this.drawPoint(x - 2, y - 2, 3);
      }

      const fingers = Object.keys(fingerLookupIndices);
      for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const points = fingerLookupIndices[finger].map(idx => hand.keypoints[idx]);
        this.drawPath(points, false);
      }
    }
  }

  drawPath(points, closePath) {
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point.x, point.y);
    }

    if (closePath) {
      region.closePath();
    }
    this.ctx.stroke(region);
  }

  drawPoint(y, x, r) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}

export default WebCamera
