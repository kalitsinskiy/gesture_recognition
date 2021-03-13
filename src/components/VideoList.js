import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({ videos , handleVideoSelect, activeVideoIndex }) => (
    videos
        .filter((video) => video?.id?.videoId)
        .map((video, index) => {
        return <VideoItem
            key={video.id.videoId}
            video={video}
            handleVideoSelect={handleVideoSelect}
            index={index}
            active={activeVideoIndex === index}
        />
    })
);
export default VideoList;
