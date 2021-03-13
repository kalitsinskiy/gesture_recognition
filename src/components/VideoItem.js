import React from 'react';
import moment from 'moment';

const VideoItem = (item) => {
    const { video , handleVideoSelect, active, index } = item;
    const {
        description,
        thumbnails,
        title,
        channelTitle,
        publishTime,
        publishedAt,
    } = video.snippet;

    return (
        <div
            onClick={() => handleVideoSelect(index)}
            className={`video-item ${active ? 'active' : ''}`}
        >
            <img className='image' src={thumbnails.medium.url} alt={description}/>

            <div className="video-content">
                <div className='title'>{title}</div>

                <div className="footer">
                    <p className="channel">{channelTitle}</p>

                    <p className="published">{moment(publishTime || publishedAt).fromNow()}</p>
                </div>
            </div>
        </div>
    )
};

export default VideoItem;
