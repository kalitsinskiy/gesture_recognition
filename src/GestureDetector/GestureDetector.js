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

import Core from './Core';

import "./styles/index.scss";


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

    const handleRecognitionSettingUpdate = useCallback(field => value => {
        if (field) {
            setRecognitionSettings(currentState => ({
                ...currentState,
                [field]: value,
            }))
        }
    }, []);

    const onChangeComplete = useCallback(field => value => {
        gestureDetector.current.updateSetting(field, value);
    }, []);

    const {
        confirmTime,
        confidence,
        maxHands,
    } = recognitionSettings;

    if (!recognitionMode) return null;

    return (
        <div className="panel">
            <Accordion
                open={panelExpanded ? 'expanded' : 'collapsed'}
                toggle={togglePanel}
            >
                <AccordionItem>
                    <AccordionHeader targetId="expanded">
                        Recognition Tools {panelExpanded ? '↑' : '↓'}
                    </AccordionHeader>

                    <AccordionBody accordionId="expanded">
                        {!loaded && <div className="full_wrapper">
                            <p className="not_loaded">Not loaded yet</p>
                        </div>}

                        {loading && <div className="full_wrapper"><Spinner /></div>}

                        <div className="web-cam_tools" ref={liveVideoRef}/>

                        {!_.isEmpty(recognitionSettings) && <>
                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Confirm Time(s)</h5>

                                <InputRange
                                    maxValue={5}
                                    minValue={1}
                                    step={0.5}
                                    value={+(confirmTime / 1000).toFixed(1)}
                                    onChange={value => {
                                        handleRecognitionSettingUpdate('confirmTime')(value * 1000)
                                    }}
                                    onChangeComplete={value => {
                                        onChangeComplete('confirmTime')(value * 1000)
                                    }}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Confidence</h5>

                                <InputRange
                                    maxValue={10}
                                    minValue={1}
                                    step={0.5}
                                    value={confidence}
                                    onChange={handleRecognitionSettingUpdate('confidence')}
                                    onChangeComplete={onChangeComplete('confidence')}
                                />
                            </div>

                            <div className="setting-wrap">
                                <h5 className="setting-wrap__title">Hands Amount</h5>

                                <InputRange
                                    maxValue={10}
                                    minValue={1}
                                    step={1}
                                    value={maxHands}
                                    onChange={handleRecognitionSettingUpdate('maxHands')}
                                    onChangeComplete={onChangeComplete('maxHands')}
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
