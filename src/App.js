import React, { useState, useEffect, useRef } from "react";
import { isEmpty, isNumber } from "lodash";
import classNames from "classnames";

import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import Header from './components/Header';
import LeftSideBar from './components/LeftSideBar';
import ErrorNotificationPopup from './components/ErrorNotificationPopup';

import GestureDetector from './GestureDetector';

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
} = gestures;

const volumeStep = 20;
const rewindStep = 10;


const App = () => {
    const [recognitionMode, setRecognitionMode] = useState(false);
    const [recognitionSettings, setRecognitionSettings] = useState({});
    const [videos, setVideos] = useState(initialPlayList);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState(null);
    const [isOpenLeftSideBar, setLeftSideBarVisibility] = useState(false);
    const [errorModal, setErrorModal] = useState({
        isOpen: false,
        title: null,
        message: null,
    });
    const playerRef = useRef();
    const gestureDetector = useRef();
    const unsubscribe = useRef();

    const videosRef = useRef();
    const activeVideoIndexRef = useRef();

    const liveVideoRef = useRef(null);

    useEffect(() => {
        videosRef.current = videos;
    }, [videos]);

    useEffect(() => {
        activeVideoIndexRef.current = activeVideoIndex;
    }, [activeVideoIndex]);

    const {isOpen, title, message } = errorModal;

    const runRecognition = async () => {
        const coreDetector = new GestureDetector({
            handleGestureSubmit,
            onWebCamError,
        });
        const stop = await coreDetector.start();
        const video = coreDetector.startObservingRecognition();
        const recognitionSettings = coreDetector.getRecognitionSettings();

        setRecognitionSettings(recognitionSettings);
        liveVideoRef.current.appendChild(video);

        gestureDetector.current = coreDetector;
        unsubscribe.current = stop;
    }

    const stopRecognition = () => {
        unsubscribe.current();
        gestureDetector.current = null;
    }

    const reRunRecognition = () => {
        gestureDetector.current.reRunRecognition();
    }

    const handleGestureSubmit = (gesture = null) => {
        switch (gesture){
            // Start/Pause
            case(highFiveGesture.name): {
                if (playerRef.current) {
                    const playerState = playerRef.current.getPlayerState();

                    if (playerState === 1) {
                        playerRef.current.pauseVideo();
                    } else if(playerState === 2 /*|| playerState === 5*/) {
                        playerRef.current.playVideo();
                    }
                }
                break;
            }
            // Confirm
            case(okGesture.name): {
                if (!isEmpty(videosRef.current)) {
                    const selectedVideo = videosRef.current[activeVideoIndexRef.current];

                    setSelectedVideo(selectedVideo);
                }
                break;
            }
            // Stop
            case(fistGesture.name): {
                if (playerRef.current) {
                    playerRef.current.stopVideo();
                    setSelectedVideo(null);
                }

                break;
            }
            // Select next/prev
            case(rightGesture.name): {
                if (!isEmpty(videosRef.current)) {
                    setActiveVideoIndex(activeVideoIndex => {
                        if (isNumber(activeVideoIndex)) {
                            if (activeVideoIndex < (videosRef.current.length - 1)) {
                                return activeVideoIndex + 1;
                            }
                            return activeVideoIndex;
                        }
                        return 0;
                    })
                }
                break;
            }
            case(leftGesture.name): {
                if (!isEmpty(videosRef.current)) {
                    setActiveVideoIndex(activeVideoIndex => {
                        if (isNumber(activeVideoIndex)) {
                            if (activeVideoIndex > 0) {
                                return activeVideoIndex - 1;
                            }
                            return activeVideoIndex;
                        }
                        return 0;
                    })
                }
                break;
            }
            // Volume
            case(oneFingerUp.name): {
                if (playerRef.current) {
                    const currentVolume = playerRef.current.getVolume();

                    playerRef.current.setVolume(currentVolume + volumeStep);
                }
                break;
            }
            case(oneFingerDown.name): {
                if (playerRef.current) {
                    const currentVolume = playerRef.current.getVolume();

                    playerRef.current.setVolume(currentVolume - volumeStep);
                }
                break;
            }
            // Rewind
            case(twoFingerUp.name): {
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();

                    playerRef.current.seekTo(currentTime + rewindStep, true);
                }
                break;
            }
            case(twoFingerDown.name): {
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();

                    playerRef.current.seekTo(currentTime - rewindStep, true);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    const handleSubmit = async (termFromSearchBar) => {
        const response = await youtube.get('/search', {
            params: {
                q: termFromSearchBar
            }
        })
        setVideos(response.data.items);
    };

    const handleVideoSelect = (index) => {
        if (!isEmpty(videos)) {
            setSelectedVideo(videos[index]);
            setActiveVideoIndex(index);
        }
    }

    const toggleLeftSideBarModal = () => {
        setLeftSideBarVisibility(currentState => !currentState);
    }

    const toggleRecognitionMode = () => {
        const newState = !recognitionMode;

        setRecognitionMode(newState);
        if (newState) {
            runRecognition();
        } else {
            stopRecognition();
            setLeftSideBarVisibility(false);

            handleRecognitionSettingUpdate('debugMode', false);
        }
    }

    const toggleDebugMode = () => {
        handleRecognitionSettingUpdate('debugMode', !recognitionSettings.debugMode);
        reRunRecognition();
    }

    const handleRecognitionSettingUpdate = (field, value) => {
        if (field) {
            gestureDetector.current.updateSetting(field, value);
            setRecognitionSettings(currentState => ({
                ...currentState,
                [field]: value,
            }))
        }
    }

    const errorModalToggle = () => {
        const nextState = !isOpen;

        setErrorModal({
            isOpen: nextState,
            title: !nextState ? null : title,
            message: !nextState ? null : message,
        });
    }

    const onReady = (event) => {
        playerRef.current = event.target;
    };

    const onWebCamError = () => {
        setErrorModal({
            isOpen: true,
            title: "WebCam Error",
            message: "WebCam is not connected or site does not have permission to it",
        });
    }

    const onVideoError = () => {
        setErrorModal({
            isOpen: true,
            title: "Player Error",
            message: "Something went wrong with video player, reload the page or try again later",
        });
    }

    return (
        <div
            className={classNames('main-wrapper', {
                'open-left-side-bar': isOpenLeftSideBar,
            })}
        >
            <LeftSideBar
                toggle={toggleLeftSideBarModal}
                isOpen={isOpenLeftSideBar}
                toggleRecognitionMode={toggleRecognitionMode}
                recognitionMode={recognitionMode}
                toggleDebugMode={toggleDebugMode}
                // webcamRef={webcamRef}
                liveVideoRef={liveVideoRef}
                // result={result}
                // onWebCamError={onWebCamError}
                handleRecognitionSettingUpdate={handleRecognitionSettingUpdate}
                recognitionSettings={recognitionSettings}
                onChangeComplete={reRunRecognition}
            />

            <div className="content">
                <Header onSearch={handleSubmit}/>

                <div className='playlist'>
                    {selectedVideo ? <VideoDetail
                        video={selectedVideo}
                        onReady={onReady}
                        onError={onVideoError}
                    /> : null}

                    <VideoList
                        handleVideoSelect={handleVideoSelect}
                        videos={videos}
                        activeVideoIndex={activeVideoIndex}
                    />
                </div>
            </div>

            <ErrorNotificationPopup
                isOpen={isOpen}
                toggle={errorModalToggle}
                title={title}
                message={message}
            />
        </div>
    );
};

export default App;
