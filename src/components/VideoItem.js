import React from 'react';

const VideoItem = ({ video , handleVideoSelect, active }) => {
    return (
        <div
            onClick={ () => handleVideoSelect(video)}
            className={`video-item ${active ? 'active' : ''}`}

        >
            <img className='image' src={video.snippet.thumbnails.medium.url} alt={video.snippet.description}/>

            <div className='header'>{video.snippet.title}</div>
        </div>
    )
};
export default VideoItem;
