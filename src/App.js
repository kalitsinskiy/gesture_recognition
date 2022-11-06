import React, { useState, useRef, useCallback } from "react";
import { isEmpty, isNumber } from "lodash";

import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import Header from './components/Header';
import LeftSideBar from './components/LeftSideBar';
import ErrorNotificationPopup from './components/ErrorNotificationPopup';

import {GestureDetector} from './GestureDetector';

import youtube from './apis/youtube';

import gestures from "./GestureDetector/gestures";

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
    const [videos, setVideos] = useState(initialPlayList);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState(null);
    const [errorModal, setErrorModal] = useState({
        isOpen: false,
        title: null,
        message: null,
    });
    const playerRef = useRef();

    const {isOpen, title, message } = errorModal;

    const handleGestureSubmit = useCallback((gesture = null) => {
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
                if (!isEmpty(videos)) {
                    const selectedVideo = videos[activeVideoIndex];

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
                if (!isEmpty(videos)) {
                    setActiveVideoIndex(activeVideoIndex => {
                        if (isNumber(activeVideoIndex)) {
                            if (activeVideoIndex < (videos.length - 1)) {
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
                if (!isEmpty(videos)) {
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
    }, [activeVideoIndex, videos]);

    const handleSubmit = useCallback(async (termFromSearchBar) => {
        const response = await youtube.get('/search', {
            params: {
                q: termFromSearchBar
            }
        })
        setVideos(response.data.items);
    }, []);

    const handleVideoSelect = useCallback((index) => {
        if (!isEmpty(videos)) {
            setSelectedVideo(videos[index]);
            setActiveVideoIndex(index);
        }
    }, [videos]);

    const toggleRecognitionMode = useCallback(()=> {
        setRecognitionMode(state => !state);
    }, []);

    const errorModalToggle = useCallback(() => {
        setErrorModal(isOpen => {
            const nextState = !isOpen;

            return {
                isOpen: nextState,
                title: !nextState ? null : title,
                message: !nextState ? null : message,
            }
        });
    }, [message, title])

    const onReady = useCallback((event) => {
        playerRef.current = event.target;
    }, []);

    // const onWebCamError = () => {
    //     setErrorModal({
    //         isOpen: true,
    //         title: "WebCam Error",
    //         message: "WebCam is not connected or site does not have permission to it",
    //     });
    // }

    const onVideoError = useCallback(() => {
        setErrorModal({
            isOpen: true,
            title: "Player Error",
            message: "Something went wrong with video player, reload the page or try again later",
        });
    }, []);

    return (
        <div className="main-wrapper">
            <GestureDetector
                recognitionMode={recognitionMode}
                handleGestureSubmit={handleGestureSubmit}
            />

            <LeftSideBar
                toggleRecognitionMode={toggleRecognitionMode}
                recognitionMode={recognitionMode}
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
