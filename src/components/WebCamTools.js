import React, {memo, useEffect, useRef} from "react";
import Webcam from "react-webcam";

import drawHand from "../utils/drawHand";


const WebCamTools = ({ webcamRef, result }) => {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (result && webcamRef.current) {
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            wrapperRef.current.width = videoWidth;
            wrapperRef.current.height = videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const ctx = canvasRef.current.getContext("2d");
            drawHand(result, ctx);
        }
    }, [result, webcamRef])

    return (
        <div className="web-cam_tools" ref={wrapperRef}>
            <Webcam
                ref={webcamRef}
                className="webcam"
                // onUserMedia={() => {
                //     console.log('onUserMedia');
                // }}
                videoConstraints={{
                    width: 'auto',
                    height: 'auto',
                }}
            />

            <canvas ref={canvasRef} className="canvas-hands" />
        </div>
    )
};

export default memo(WebCamTools);
