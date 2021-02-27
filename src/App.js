import React, { PureComponent, createRef } from "react";
import { isEqual, isEmpty, isNumber } from "lodash";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import YouTube from 'react-youtube';

import "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import fp from "fingerpose";

import WebCamTools from "./components/WebCamTools";
import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import SearchBar from './components/Searchbar';
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

class App extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            result: null,
            isVisibleWebCamTools: debugMode,
            detectionResult: initialDetectionState,
            videos: initialPlayList,
            selectedVideo: null,
            // selectedVideo: initialPlayList[0],
            activeVideoIndex: null,
            isPlayerOpen: false,
        }
        this.webcamRef = createRef();
        // this.playerRef = createRef();
        this.playerRef = null;
        this.confirmTimer = null;
        this.detectInterval = debugMode ? 1000 : 100;
        this.confirmTime = debugMode ? 4000 :2000;
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
            case(okGesture.name): {
                if (!isEmpty(videos)) {
                    const selectedVideo = videos[activeVideoIndex];

                    this.setState({ selectedVideo });
                }
                break;
            }
            case(fistGesture.name): {
                if (this.playerRef) {
                    this.playerRef.stopVideo();
                    this.setState({ selectedVideo: null });
                }

                break;
            }
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
            default: {
                // console.log(gesture);
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

    handleVideoSelect = (video) => {
        this.setState({selectedVideo: video})
    }

    togglePlayerModal = () => {
        this.setState(({ isPlayerOpen }) => ({ isPlayerOpen: !isPlayerOpen }))
    }

    stopPlayer = () => {
        if (this.state.isPlayerOpen) {
            this.playerRef.pauseVideo();
        }
    }

    onReady = (event) => {
        console.log(event.target);
        this.playerRef = event.target;
    };

    render() {
        const {
            result,
            isVisibleWebCamTools,
            selectedVideo,
            videos,
            activeVideoIndex,
        } = this.state;

        return (
            <div className="main-wrapper">
                <LeftSideBar/>

                <WebCamTools
                    webcamRef={this.webcamRef}
                    result={result}
                    isVisible={isVisibleWebCamTools}
                />

                <div className="content">
                    <button onClick={() => this.setState({ isVisibleWebCamTools: !isVisibleWebCamTools })}>Toggle Web Cam Tools</button>
                    <button onClick={this.togglePlayerModal}>Toggle Player Modal</button>
                    <button onClick={() => this.playerRef.playVideo()}>Run Video</button>

                    <SearchBar handleFormSubmit={this.handleSubmit}/>

                    {selectedVideo
                        ? <div className="active-video">
                            <VideoDetail video={selectedVideo} onReady={this.onReady}/>
                        </div>
                        : null
                    }

                    <div className='youtube_playlist'>
                        <VideoList
                            handleVideoSelect={this.handleVideoSelect}
                            videos={videos}
                            activeVideoIndex={activeVideoIndex}
                        />
                    </div>
                </div>

                {/*<Modal isOpen={isPlayerOpen} toggle={this.togglePlayerModal}>*/}
                {/*    <ModalHeader toggle={this.stopPlayer}>Modal title</ModalHeader>*/}
                {/*    <ModalBody>*/}
                {/*        <YouTube*/}
                {/*            videoId={selectedVideo.id.videoId}*/}
                {/*            // id={selectedVideo.id}                       // defaults -> null*/}
                {/*            // className={string}                // defaults -> null*/}
                {/*            // containerClassName={string}       // defaults -> ''*/}
                {/*            opts={{*/}
                {/*                // height: '390',*/}
                {/*                // width: '640',*/}
                {/*                playerVars: {*/}
                {/*                    // https://developers.google.com/youtube/player_parameters*/}
                {/*                    autoplay: 1,*/}
                {/*                },*/}
                {/*            }}                        // defaults -> {}*/}
                {/*            onReady={this.onReady}                    // defaults -> noop*/}
                {/*            // onPlay={func}                     // defaults -> noop*/}
                {/*            // onPause={func}                    // defaults -> noop*/}
                {/*            // onEnd={func}                      // defaults -> noop*/}
                {/*            // onError={func}*/}
                {/*            // defaults -> noop*/}
                {/*            onPlayerStateChange={e => console.log(e)}*/}
                {/*            onStateChange={e => console.log(e)}*/}
                {/*            // onPlaybackRateChange={func}       // defaults -> noop*/}
                {/*            // onPlaybackQualityChange={func}    // defaults -> noop*/}
                {/*        />*/}
                {/*    </ModalBody>*/}
                {/*</Modal>*/}
            </div>
        );
    }
}

export default App;
