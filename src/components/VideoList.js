import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({ videos , handleVideoSelect, activeVideoIndex }) => (
    videos.map((video, key) => {
        return <VideoItem
            key={video.id.videoId || key}
            video={video}
            handleVideoSelect={handleVideoSelect}
            active={activeVideoIndex === key}
        />
    })
);
export default VideoList;
