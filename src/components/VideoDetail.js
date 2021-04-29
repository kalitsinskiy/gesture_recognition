import React from 'react';
import YouTube from "react-youtube";

const VideoDetail = ({ video, onReady, onError }) => {
    if (!video) {
        return <div>Loading ...</div>;
    }

    return (
        <div className="active-video">
            <div className='video-player'>
                <YouTube
                    videoId={video.id.videoId}
                    opts={{
                        playerVars: {
                            autoplay: 1,
                        },
                    }}
                    onReady={onReady}
                    onError={onError}
                />
            </div>
            <div className='video-content'>
                <h4 className='title'>{video.snippet.title}</h4>
                <p className='description'>{video.snippet.description}</p>
            </div>
        </div>

    )
}

export default VideoDetail;
