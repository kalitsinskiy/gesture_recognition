import React from 'react';

import LogoIcon from './LogoIcon'
import classNames from "classnames";

const RunButton = ({toggleRecognitionMode, recognitionMode}) => {
    return (
        <button
            onClick={toggleRecognitionMode}
            className={classNames('run-button', {
                'active': recognitionMode,
            })}
        >
            <LogoIcon/>
        </button>
    );
};

export default RunButton;
