import React, { memo } from 'react';
import { UncontrolledTooltip } from "reactstrap";

import fist from "../assets/gestures/fist.png";
import high_five from "../assets/gestures/high_five.png";
import left from "../assets/gestures/left.png";
import right from "../assets/gestures/right.png";
import ok from "../assets/gestures/ok.png";
import one_finger_up from "../assets/gestures/one_finger_up.png";
import one_finger_down from "../assets/gestures/one_finger_down.png";
import two_finger_up from "../assets/gestures/two_finger_up.png";
import two_finger_down from "../assets/gestures/two_finger_down.png";

const gestures = [
    {
        id: 'left',
        src: left,
        description: 'Select prev video in the list',
    }, {
        id: 'right',
        src: right,
        description: 'Select next video in the list',
    }, {
        id: 'ok',
        src: ok,
        description: 'Run selected video',
    }, {
        id: 'high_five',
        src: high_five,
        description: 'Start/Pause video',
    }, {
        id:'one_finger_up',
        src: one_finger_up,
        description: 'Volume +',
    },{
        id:'one_finger_down',
        src: one_finger_down,
        description: 'Volume -',
    },{
        id:'two_finger_up',
        src: two_finger_up,
        description: 'Fast Forward',
    },{
        id:'two_finger_down',
        src: two_finger_down,
        description: 'Fast Backward',
    }, {
        id:'fist',
        src: fist,
        description: 'Stop video and close player',
    },
];

const InstructionTooltip = ({ target }) => (
    <UncontrolledTooltip
        target={target}
        placement="right"
        popperClassName="instruction-tooltip"
        delay={50}
        fade={false}
    >
        <p className="title">
            In the recognition mode <br/> you can use following gestures:
        </p>

        <div className="gesture_wrapper">
            {gestures.map(({ id, src, description }) => (
                <div className="gesture" key={id}>
                    <img className="gesture__img" src={src} alt={id}/>
                    <p className="gesture__description">{description}</p>
                </div>
            ))}
        </div>
    </UncontrolledTooltip>
);

export default memo(InstructionTooltip);
