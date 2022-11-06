import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Spinner,
} from 'reactstrap';
import InputRange from "react-input-range";
import _ from 'lodash';
import classNames from "classnames";

import Core from './Core';
import DebugIcon from "../components/DebugIcon";

import "./styles.scss";


const GestureDetector = (props) => {
    const { recognitionMode, handleGestureSubmit } = props;
    const previousRecognitionMode = useRef(false);
    const gestureDetector = useRef(null);
    const liveVideoRef = useRef(null);
    const [recognitionSettings, setRecognitionSettings] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [panelExpanded, setPanelExpanded] = useState(false);


    const togglePanel = useCallback(() => {
        setPanelExpanded(state => !state)
    }, []);


    const runRecognition = async () => {
        try {
            setLoading(true);

            const coreDetector = new Core({
                handleGestureSubmit,
                onWebCamError: () => {},
            });
            await coreDetector.start();
            const video = coreDetector.startObservingRecognition();
            const recognitionSettings = coreDetector.getRecognitionSettings();

            setRecognitionSettings(recognitionSettings);
            liveVideoRef.current.appendChild(video);

            gestureDetector.current = coreDetector;
            setLoading(false);
            setLoaded(true);
        } catch (error) {
            console.log('runRecognition', error)
            setLoading(false);
        }
    }

    const stopRecognition = () => {
        gestureDetector.current.stop();
        gestureDetector.current = null;
        setPanelExpanded(false);
    }

    useEffect(() => {
        if (recognitionMode && !previousRecognitionMode.current) {
            runRecognition();
        } else if(!recognitionMode && previousRecognitionMode.current) {
            stopRecognition();
        }

        previousRecognitionMode.current = recognitionMode;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recognitionMode]);

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        gestureDetector.current?.setHandleGestureSubmit(handleGestureSubmit);
    }, [handleGestureSubmit]);

    const toggleDebugMode = () => {
        handleRecognitionSettingUpdate('debugMode', !recognitionSettings.debugMode);
    }

    const handleRecognitionSettingUpdate = (field, value) => {
        if (field) {
            gestureDetector.current.updateSetting(field, value);
            setRecognitionSettings(currentState => ({
                ...currentState,
                [field]: value,
            }))
        }
    }
    const onChangeComplete = () => {
        // reRunRecognition();
    }

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
        <div className="panel">
            <Accordion
                open={panelExpanded ? 'expanded' : 'collapsed'}
                toggle={togglePanel}
            >
                <AccordionItem>
                    <AccordionHeader targetId="expanded">Tools</AccordionHeader>
                    <AccordionBody accordionId="expanded">
                        {!loaded && <div className="full_wrapper">
                            <p className="not_loaded">Not loaded yet</p>
                        </div>}

                        {loading && <div className="full_wrapper"><Spinner /></div>}

                        <div className="web-cam_tools" ref={liveVideoRef}/>

                        {!_.isEmpty(recognitionSettings) && <>
                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Camera FPS</h5>

                                <button
                                    className={classNames('debug_mode', {
                                        'active': debugMode,
                                    })}
                                    // disabled={!recognitionMode}
                                    disabled // TODO
                                    onClick={toggleDebugMode}
                                >
                                    <DebugIcon />
                                </button>

                                <InputRange
                                    disabled // TODO
                                    maxValue={60}
                                    minValue={1}
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
                                    disabled
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
                                    disabled
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
                                    disabled
                                    maxValue={20}
                                    minValue={1}
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
                                    disabled
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
                                    disabled
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
                        </>}
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default GestureDetector;
