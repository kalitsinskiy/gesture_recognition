import { createDetector, SupportedModels } from '@tensorflow-models/hand-pose-detection';
import fp from "fingerpose";
import _ from "lodash";
import RecognitionSettings from "../utils/RecognitionSettings";
import gestures from "../gestures";

import WebCamera from "./WebCamera";

const {
    highFiveGesture,
    fistGesture,
    okGesture,
    leftGesture,
    rightGesture,
    oneFingerUp,
    twoFingerUp,
    oneFingerDown,
    twoFingerDown,
} = gestures;

class Core {
    constructor({ handleGestureSubmit, onWebCamError }) {
        this.detector = null;
        this.gestureEstimator = null;

        this.tempGesture = null;

        this.recognitionInterval = null;
        this.confirmTimer = null;
        this.handleGestureSubmit = handleGestureSubmit;
        this.onWebCamError = onWebCamError;
        this.rafId = null;

        this.recognitionSettings = RecognitionSettings.getSettings();

        this.camera = null;
        this.obseringRecognition = false;
    }

    async createDetector(){
        const model = SupportedModels.MediaPipeHands;
        const config = {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'full'
        }

        this.detector = await createDetector(model, config);
    }

    startObservingRecognition() {
        this.obseringRecognition = true;
        return this.camera.returnLiveDetection();
    }

    stopObservingRecognition() {
        this.obseringRecognition = false;
        this.camera.clearCtx();
    }

    async start() {
        this.camera = await WebCamera.setupCamera(
            {targetFPS: 60, sizeOption: '640 X 480'},
            this.onWebCamError
        );

        try {
            await this.createDetector();
            this.gestureEstimator = new fp.GestureEstimator([
                highFiveGesture,
                fistGesture,
                okGesture,
                rightGesture,
                leftGesture,
                oneFingerUp,
                oneFingerDown,
                twoFingerUp,
                twoFingerDown,
            ]);
            this.detect();
            // this.recognitionInterval = setInterval(() => {
            //     this.detect();
            // }, debugMode ? debugDetectInterval : detectInterval);

            return this.stop;
        } catch (e) {
            throw new Error({
                isOpen: true,
                title: "Recognition Error",
                message: "Something went wrong with recognition, check your connection and try reload the page",
            });
        }
    }

    async reRunRecognition() {
        this.stop();
        await this.start();
    }

    stop() {
        window.cancelAnimationFrame(this.rafId);
        // this.stopObservingRecognition();

        // this.detector.dispose();

        // clearInterval(this.recognitionInterval);
        // this.recognitionInterval = null;
    }

    async detect() {
        if (
            this.camera?.video?.readyState === 4
        ) {
            const video = this.camera.video;
            const {
                debugMode,
                confidence,
                debugConfidence,
            } = this.recognitionSettings;


            const originalEstimation = await this.detector.estimateHands(video);
            // const originalEstimation = await this.detector.estimateHands(video, {flipHorizontal: true});

            const adoptedEstimation = originalEstimation.map((item) => ({
                landmarks: item.keypoints?.map(({x, y}) => ([x, y, 0]))
            }));

            if (adoptedEstimation.length > 0) {
                const temp = adoptedEstimation.map((hand) => {
                    if (_.isEmpty(hand?.landmarks)) {
                        return { confidence: null, gesture: null };
                    }

                    const result = this.gestureEstimator.estimate(
                        hand.landmarks,
                        debugMode ? debugConfidence : confidence,
                    );

                    if (_.isEmpty(result?.gestures)) {
                        return { confidence: null, gesture: null };
                    }

                    const confidenceList = result.gestures.map(prediction => prediction.score);

                    const maxConfidence = Math.max(...confidenceList);
                    const maxConfidenceGestureIndex = confidenceList.indexOf(maxConfidence);
                    const gesture = result.gestures[maxConfidenceGestureIndex].name;

                    return { confidence: maxConfidence, gesture };
                });

                const newGesture = _.maxBy(temp, 'confidence')?.gesture;

                this.confirmGesture(newGesture || null);
            } else {
                this.confirmGesture(null);
            }

            if (this.obseringRecognition) {
                this.camera.setHands(originalEstimation);
            }
        }
        this.rafId = requestAnimationFrame(this.detect.bind(this));
    };

    confirmGesture(gesture) {
        const {
            debugMode,
            confirmTime,
            debugConfirmTime,
        } = this.recognitionSettings;

        if (gesture !== this.tempGesture) {
            clearTimeout(this.confirmTimer);
            this.tempGesture = gesture;

            if (gesture) {
                this.confirmTimer = setTimeout(() => {
                    this.handleGestureSubmit(gesture);
                    this.tempGesture = null;
                }, debugMode ? debugConfirmTime : confirmTime);
             } else {
                this.confirmTimer = null;
            }
        }
    }

    getRecognitionSettings() {
        return this.recognitionSettings;
    }

    updateSetting(field, value) {
        this.recognitionSettings = {
            ...this.recognitionSettings,
            [field]: value,
        };
        RecognitionSettings.updateSetting(field, value);
        // this.reRunRecognition();
    }
}

export default Core;
