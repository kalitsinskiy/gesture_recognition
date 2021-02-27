import React from 'react';
import YouTube from "react-youtube";

const VideoDetail = ({ video, onReady}) => {
    if (!video) {
        return <div>Loading ...</div>;
    }

    // const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;

    return (
        <div>
            <div className='video-player'>
                {/*<iframe src={videoSrc} allowFullScreen title='Video player'/>*/}
                <YouTube
                    videoId={video.id.videoId}
                    // id={selectedVideo.id}                       // defaults -> null
                    // className={string}                // defaults -> null
                    // containerClassName={string}       // defaults -> ''
                    opts={{
                        // height: '390',
                        // width: '640',
                        playerVars: {
                            // https://developers.google.com/youtube/player_parameters
                            autoplay: 1,
                        },
                    }}                        // defaults -> {}
                    onReady={onReady}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    // onEnd={func}                      // defaults -> noop
                    // onError={func}
                    // defaults -> noop
                    // onPlayerStateChange={e => console.log(e)}
                    // onStateChange={e => console.log(e)}
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
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
