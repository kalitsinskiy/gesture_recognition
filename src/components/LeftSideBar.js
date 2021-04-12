import React, { Fragment } from 'react';
import classNames from 'classnames';
import InputRange from 'react-input-range';

import WebCamTools from "./WebCamTools";
import WebCamIcon from "./WebCamIcon";
import DebugIcon from "./DebugIcon";

const LeftSideBar = props => {
    const {
        toggle,
        webcamRef,
        result,
        isOpen,
        toggleRecognitionMode,
        recognitionMode,
        toggleDebugMode,
        onWebCamError,
        handleRecognitionSettingUpdate,
        recognitionSettings,
        onChangeComplete,
    } = props;

    const {
        debugMode,
        detectInterval,
        debugDetectInterval,
        confirmTime,
        debugConfirmTime,
        confidence,
        debugConfidence,
    } = recognitionSettings;

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
                            disabled={!recognitionMode}
                            onClick={toggle}
                        >
                            <span/>
                            <span/>
                            <span/>
                        </button>

                        <button
                            className={classNames('rec_mode btn-bg', {
                                'active': recognitionMode,
                            })}
                            onClick={toggleRecognitionMode}
                        >
                            <WebCamIcon />
                        </button>

                        <button
                            className={classNames('debug_mode btn-bg', {
                                'active': debugMode,
                            })}
                            disabled={!recognitionMode}
                            onClick={toggleDebugMode}
                        >
                            <DebugIcon />
                        </button>
                    </div>
                </div>

                <div className="hidden-side">
                    {recognitionMode && (
                        <Fragment>
                            <WebCamTools
                                webcamRef={webcamRef}
                                result={result}
                                onError={onWebCamError}
                            />

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Camera FPS</h5>

                                <InputRange
                                    maxValue={60}
                                    minValue={0}
                                    value={Math.ceil(1000 / detectInterval)}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('detectInterval', Math.ceil(1000 / value))
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Confirm Time(s)</h5>

                                <InputRange
                                    maxValue={5}
                                    minValue={1}
                                    step={0.5}
                                    value={+(confirmTime / 1000).toFixed(1)}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('confirmTime', value * 1000)
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Confidence</h5>

                                <InputRange
                                    maxValue={10}
                                    minValue={1}
                                    step={0.5}
                                    value={confidence}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('confidence', value)
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Debug FPS</h5>

                                <InputRange
                                    maxValue={20}
                                    minValue={0}
                                    value={Math.ceil(1000 / debugDetectInterval)}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('debugDetectInterval', Math.ceil(1000 / value))
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Debug Confirm Time(s)</h5>

                                <InputRange
                                    maxValue={5}
                                    minValue={1}
                                    step={0.5}
                                    value={+(debugConfirmTime / 1000).toFixed(1)}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('debugConfirmTime', value * 1000)
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Debug Confidence</h5>

                                <InputRange
                                    maxValue={10}
                                    minValue={1}
                                    step={0.5}
                                    value={debugConfidence}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('debugConfidence', value)
                                    }}
                                    onChangeComplete={onChangeComplete}
                                />
                            </div>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>

    )
}

export default LeftSideBar;
