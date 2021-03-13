import React from 'react';
import classNames from 'classnames';

import WebCamTools from "./WebCamTools";

const LeftSideBar = ({ toggle, webcamRef, result, isOpen }) => {
    return (
        <div className="left-side-bar">
            <div className="top">
                <div className="visible-side">
                    <div className="logo">
                        <img src="/logo.svg" alt="logo" />
                    </div>
                </div>

                <div className="hidden-side">
                    <div className="logo-text">
                        Hands Pose
                    </div>
                </div>
            </div>

            <div className="bottom">
                <div className="visible-side">
                    <div className="btns-group">
                        <button
                            className={classNames('hamburger btn-bg', {
                                'hamburger__open': isOpen,
                            })}
                            onClick={toggle}
                        >
                            <span/>
                            <span/>
                            <span/>
                        </button>

                        <button
                            className="rec_mode btn-bg"
                        >
                            <img src="/webcam.svg" alt="rec_mode" />
                        </button>
                    </div>
                </div>

                <div className="hidden-side">
                    <WebCamTools
                        webcamRef={webcamRef}
                        result={result}
                    />
                </div>
            </div>
        </div>

    )
}

export default LeftSideBar;
