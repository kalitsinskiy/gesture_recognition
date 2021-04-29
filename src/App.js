import React, { createRef, PureComponent } from "react";
import { isEqual, isEmpty, isNumber } from "lodash";
import classNames from "classnames";

import "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import fp from "fingerpose";

import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import Header from './components/Header';
import LeftSideBar from './components/LeftSideBar';
import ErrorNotificationPopup from './components/ErrorNotificationPopup';

import RecognitionSettings, { defaultRecognitionSettings } from './utils/RecognitionSettings';

import youtube from './apis/youtube';

import gestures from "./gestures";

import initialPlayList from './initialPlayList'

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
    cornerGesture,
} = gestures;

const initialDetectionState = {
    gesture: null,
    lastGesture: null,
};

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            recognitionMode: false,
            recognitionSettings: RecognitionSettings.getSettings(),
            debugMode: false,
            result: null,
            detectionResult: initialDetectionState,
            videos: initialPlayList,
            selectedVideo: null,
            activeVideoIndex: null,
            isPlayerOpen: false,
            isOpenLeftSideBar: false,
            errorModal: {
                isOpen: false,
                title: null,
                message: null,
            },
        }
        this.webcamRef = createRef();
        this.playerRef = null;
        this.confirmTimer = null;
        this.volumeStep = 20;
        this.rewindStep = 10;
        this.recognitionInterval = null;
    }

    componentDidMount() {
        if (this.state.recognitionMode) {
            this.runRecognition();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            detectionResult,
            recognitionMode,
            recognitionSettings,
        } = this.state;

        const {
            debugMode,
            confirmTime,
            debugConfirmTime,
        } = recognitionSettings;

        if (!isEqual(detectionResult.gesture, prevState.detectionResult.gesture)) {
            if (detectionResult.gesture) {
                clearTimeout(this.confirmTimer);
                this.confirmTimer = setTimeout(() => {
                    console.log('confirm gesture', detectionResult.gesture);
                    this.handleGestureSubmit(detectionResult.gesture);
                    this.setState({ detectionResult: initialDetectionState });
                }, debugMode ? debugConfirmTime : confirmTime);
            } else {
                clearTimeout(this.confirmTimer);
                this.confirmTimer = null;
            }
        }

        if (!isEqual(recognitionMode, prevState.recognitionMode)) {
            if (recognitionMode) {
                this.runRecognition();
            } else {
                this.stopRecognition();
                this.setState({
                    isOpenLeftSideBar: false,
                });

                this.handleRecognitionSettingUpdate('debugMode', false);
            }
        }

        if (!isEqual(debugMode, prevState.recognitionSettings.debugMode)) {
            this.reRunRecognition();
        }
    }

    async runRecognition() {
        try {
            const net = await handpose.load();
            const {
                detectInterval,
                debugDetectInterval,
                debugMode,
            } = this.state.recognitionSettings;

            this.recognitionInterval = setInterval(() => {
                this.detect(net);
            }, debugMode ? debugDetectInterval : detectInterval);
        } catch (e) {
            this.setState({
                errorModal: {
                    isOpen: true,
                    title: "Recognition Error",
                    message: "Something went wrong with recognition, check your connection and try reload the page",
                }
            })
        }
    }

    stopRecognition() {
        clearInterval(this.recognitionInterval);
        this.recognitionInterval = null;
    }

    reRunRecognition = () => {
        this.stopRecognition();
        this.runRecognition();
    }

    detect = async (net) => {
        if (
            typeof this.webcamRef.current !== "undefined" &&
            this.webcamRef.current !== null &&
            this.webcamRef.current.video.readyState === 4
        ) {
            const video = this.webcamRef.current.video;
            const { debugMode } = this.state.recognitionSettings;

            // Make Detections
            const hand = await net.estimateHands(video);

            if (hand.length > 0) {
                const GE = new fp.GestureEstimator([
                    highFiveGesture,
                    fistGesture,
                    okGesture,
                    rightGesture,
                    leftGesture,
                    oneFingerUp,
                    oneFingerDown,
                    twoFingerUp,
                    twoFingerDown,
                    cornerGesture,
                ]);
                const result = await GE.estimate(
                    hand[0].landmarks,
                    debugMode ? defaultRecognitionSettings.debugConfidence : defaultRecognitionSettings.confidence
                );

                if (result.gestures !== undefined && result.gestures.length > 0) {
                    const confidence = result.gestures.map(prediction => prediction.confidence);
                    if (debugMode) {
                        result.gestures.forEach(({confidence, name}) => {
                            console.log('confidence', name, confidence);
                        });
                        result.poseData.forEach(item => console.log(item.join(', ')));
                        console.log('---------------------------------------');
                    }

                    const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
                    const newGesture = result.gestures[maxConfidence].name;

                    this.setState(({ detectionResult }) => ({
                        detectionResult: {
                            gesture: newGesture,
                            lastGesture: detectionResult.gesture,
                        }
                    }))
                } else {
                    this.setState(({ detectionResult }) => ({
                        detectionResult: {
                            gesture: null,
                            lastGesture: detectionResult.gesture,
                        },
                    }))
                }
            } else {
                this.setState({ detectionResult: initialDetectionState });
            }

            this.setState({
                result: hand,
            })
        }
    };

    handleGestureSubmit = (gesture = null) => {
        const {
            activeVideoIndex,
            videos,
        } = this.state;

        switch (gesture){
            // Start/Pause
            case(highFiveGesture.name): {
                if (this.playerRef) {
                    const playerState = this.playerRef.getPlayerState();

                    if (playerState === 1) {
                        this.playerRef.pauseVideo();
                    } else if(playerState === 2 /*|| playerState === 5*/) {
                        this.playerRef.playVideo();
                    }
                }
                break;
            }
            // Confirm
            case(okGesture.name): {
                if (!isEmpty(videos)) {
                    const selectedVideo = videos[activeVideoIndex];

                    this.setState({ selectedVideo });
                }
                break;
            }
            // Stop
            case(fistGesture.name): {
                if (this.playerRef) {
                    this.playerRef.stopVideo();
                    this.setState({ selectedVideo: null });
                }

                break;
            }
            // Select next/prev
            case(rightGesture.name): {
                if (!isEmpty(videos)) {
                    if (isNumber(activeVideoIndex)) {
                        if (activeVideoIndex < (videos.length - 1)) {
                            this.setState(({ activeVideoIndex }) =>({ activeVideoIndex: activeVideoIndex + 1 }));
                        }
                    } else {
                        this.setState({ activeVideoIndex: 0 });
                    }
                }
                break;
            }
            case(leftGesture.name): {
                if (!isEmpty(videos)) {
                    if (isNumber(activeVideoIndex)) {
                        if (activeVideoIndex > 0) {
                            this.setState(({ activeVideoIndex }) =>({ activeVideoIndex: activeVideoIndex - 1 }));
                        }
                    } else {
                        this.setState({ activeVideoIndex: 0 });
                    }
                }
                break;
            }
            // Volume
            case(oneFingerUp.name): {
                if (this.playerRef) {
                    const currentVolume = this.playerRef.getVolume();

                    this.playerRef.setVolume(currentVolume + this.volumeStep);
                }
                break;
            }
            case(oneFingerDown.name): {
                if (this.playerRef) {
                    const currentVolume = this.playerRef.getVolume();

                    this.playerRef.setVolume(currentVolume - this.volumeStep);
                }
                break;
            }
            // Rewind
            case(twoFingerUp.name): {
                if (this.playerRef) {
                    const currentTime = this.playerRef.getCurrentTime();

                    this.playerRef.seekTo(currentTime + this.rewindStep, true);
                }
                    break;
            }
            case(twoFingerDown.name): {
                if (this.playerRef) {
                    const currentTime = this.playerRef.getCurrentTime();

                    this.playerRef.seekTo(currentTime - this.rewindStep, true);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    handleSubmit = async (termFromSearchBar) => {
        const response = await youtube.get('/search', {
            params: {
                q: termFromSearchBar
            }
        })
        this.setState({
            videos: response.data.items
        })
    };

    handleVideoSelect = (index) => {
        const { videos } = this.state;

        if (!isEmpty(videos)) {
            this.setState({ selectedVideo: videos[index] })
            this.setState({ activeVideoIndex: index })
        }
    }

    toggleLeftSideBarModal = () => {
        this.setState(({ isOpenLeftSideBar }) => ({ isOpenLeftSideBar: !isOpenLeftSideBar }))
    }

    toggleRecognitionMode = () => {
        this.setState(({ recognitionMode }) => ({ recognitionMode: !recognitionMode }))
    }

    toggleDebugMode = () => {
        this.handleRecognitionSettingUpdate('debugMode', !this.state.recognitionSettings.debugMode)
    }

    handleRecognitionSettingUpdate = (field, value) => {
        if (field) {
            this.setState({
                recognitionSettings: {
                    ...this.state.recognitionSettings,
                    [field]: value,
                }
            });
            RecognitionSettings.updateSetting(field, value);
        }
    }

    errorModalToggle = () => {
        const { isOpen, title, message } = this.state.errorModal;

        const nextState = !isOpen;

        this.setState({
            errorModal: {
                isOpen: nextState,
                title: !nextState ? null : title,
                message: !nextState ? null : message,
            }
        })
    }

    onReady = (event) => {
        // console.log(event.target);
        // console.log(event.target.getOptions());
        this.playerRef = event.target;
    };

    onWebCamError = () => {
        this.setState({
            errorModal: {
                isOpen: true,
                title: "WebCam Error",
                message: "WebCam is not connected or site does not have permission to it",
            }
        })
    }

    onVideoError = () => {
        this.setState({
            errorModal: {
                isOpen: true,
                title: "Player Error",
                message: "Something went wrong with video player, reload the page or try again later",
            }
        })
    }

    render() {
        const {
            result,
            selectedVideo,
            videos,
            activeVideoIndex,
            isOpenLeftSideBar,
            recognitionMode,
            recognitionSettings,
            errorModal,
        } = this.state;

        const {isOpen, title, message } = errorModal;

        return (
            <div
                className={classNames('main-wrapper', {
                    'open-left-side-bar': isOpenLeftSideBar,
                })}
            >
                <LeftSideBar
                    toggle={this.toggleLeftSideBarModal}
                    isOpen={isOpenLeftSideBar}
                    toggleRecognitionMode={this.toggleRecognitionMode}
                    recognitionMode={recognitionMode}
                    toggleDebugMode={this.toggleDebugMode}
                    webcamRef={this.webcamRef}
                    result={result}
                    onWebCamError={this.onWebCamError}
                    handleRecognitionSettingUpdate={this.handleRecognitionSettingUpdate}
                    recognitionSettings={recognitionSettings}
                    onChangeComplete={this.reRunRecognition}
                />

                <div className="content">
                    <Header onSearch={this.handleSubmit}/>

                    <div className='playlist'>
                        {selectedVideo ? <VideoDetail
                            video={selectedVideo}
                            onReady={this.onReady}
                            onError={this.onVideoError}
                        /> : null}

                        <VideoList
                            handleVideoSelect={this.handleVideoSelect}
                            videos={videos}
                            activeVideoIndex={activeVideoIndex}
                        />
                    </div>
                </div>

                <ErrorNotificationPopup
                    isOpen={isOpen}
                    toggle={this.errorModalToggle}
                    title={title}
                    message={message}
                />
            </div>
        );
    }
}

export default App;
