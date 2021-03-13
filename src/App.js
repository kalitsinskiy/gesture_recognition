import React, { createRef, Component } from "react";
import { isEqual, isEmpty, isNumber } from "lodash";
import classNames from "classnames";

import "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import fp from "fingerpose";

import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import Header from './components/Header';
import LeftSideBar from './components/LeftSideBar';

import youtube from './apis/youtube';

import highFiveGesture from "./gestures/HighFive";
import fistGesture from "./gestures/Fist";
import okGesture from "./gestures/Ok";
import rightGesture from "./gestures/Right";
import leftGesture from "./gestures/Left";
import oneFingerUp from "./gestures/OneFingerUp";
import twoFingerUp from "./gestures/TwoFingerUp";
import oneFingerDown from "./gestures/OneFingerDown";
import twoFingerDown from "./gestures/TwoFingerDown";

import initialPlayList from './initialPlayList'

const initialDetectionState = {
    gesture: null,
    lastGesture: null,
};

const debugMode = false;

// class App extends PureComponent {
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: null,
            detectionResult: initialDetectionState,
            videos: initialPlayList,
            selectedVideo: null,
            activeVideoIndex: null,
            isPlayerOpen: false,
            isOpenLeftSideBar: false,
        }
        this.webcamRef = createRef();
        this.playerRef = null;
        this.confirmTimer = null;
        this.detectInterval = debugMode ? 1000 : 100; // 34 if 30fps
        this.confirmTime = debugMode ? 4000 : 2000;
        this.volumeStep = 20;
        this.rewindStep = 10;
    }

    async componentDidMount() {
        const net = await handpose.load();
        // console.log("Handpose model loaded.");
        setInterval(() => {
            this.detect(net);
        }, this.detectInterval);
    }

    componentDidUpdate(prevProps, prevState) {
        const { detectionResult } = this.state;

        if (!isEqual(detectionResult.gesture, prevState.detectionResult.gesture)) {
            if (detectionResult.gesture) {
                clearTimeout(this.confirmTimer);
                this.confirmTimer = setTimeout(() => {
                    console.log('confirm gesture', detectionResult.gesture);
                    this.handleGestureSubmit(detectionResult.gesture);
                    this.setState({ detectionResult: initialDetectionState });
                }, this.confirmTime);
            } else {
                clearTimeout(this.confirmTimer);
                this.confirmTimer = null;
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
    }

    detect = async (net) => {
        if (
            typeof this.webcamRef.current !== "undefined" &&
            this.webcamRef.current !== null &&
            this.webcamRef.current.video.readyState === 4
        ) {
            // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = this.webcamRef.current.video;

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
                ]);
                const result = await GE.estimate(hand[0].landmarks, debugMode ? 1 : 7.5);

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

    togglePlayerModal = () => {
        this.setState(({ isPlayerOpen }) => ({ isPlayerOpen: !isPlayerOpen }))
    }

    toggleLeftSideBarModal = () => {
        this.setState(({ isOpenLeftSideBar }) => ({ isOpenLeftSideBar: !isOpenLeftSideBar }))
    }

    onReady = (event) => {
        console.log(event.target);
        console.log(event.target.getOptions());
        this.playerRef = event.target;
    };

    render() {
        const {
            result,
            selectedVideo,
            videos,
            activeVideoIndex,
            isOpenLeftSideBar,
        } = this.state;

        return (
            <div
                className={classNames('main-wrapper', {
                    'open-left-side-bar': isOpenLeftSideBar,
                })}
            >
                <LeftSideBar
                    toggle={this.toggleLeftSideBarModal}
                    webcamRef={this.webcamRef}
                    result={result}
                    isOpen={isOpenLeftSideBar}
                />

                <div className="content">
                    <Header onSearch={this.handleSubmit}/>

                    <div className='playlist'>
                        {selectedVideo ? <VideoDetail video={selectedVideo} onReady={this.onReady}/> : null}

                        <VideoList
                            handleVideoSelect={this.handleVideoSelect}
                            videos={videos}
                            activeVideoIndex={activeVideoIndex}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
