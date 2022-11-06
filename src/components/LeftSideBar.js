import React from 'react';
import { RunButton } from "../GestureDetector";
import InfoIcon from "./InfoIcon";
import InstructionTooltip from "./InstructionTooltip";

const LeftSideBar = ({toggleRecognitionMode, recognitionMode}) => (
    <div className="left-side-bar">
        <div className="top">
            <div className="visible-side">
                <div className="logo">
                    <img src="/logo.svg" alt="logo"/>
                </div>
            </div>

            <div className="hidden-side">
                <div className="logo-text">
                    Hand Pose
                </div>
            </div>
        </div>

        <div className="bottom">
            <div className="visible-side">
                <div className="btns-group">
                    <div className="btn-bg">
                        <RunButton
                            toggleRecognitionMode={toggleRecognitionMode}
                            recognitionMode={recognitionMode}
                        />
                    </div>

                    <button className="info btn-bg" id="instruction-btn">
                        <InfoIcon/>
                    </button>

                    <InstructionTooltip target="instruction-btn"/>
                </div>
            </div>
        </div>
    </div>

);

export default LeftSideBar;
