import React, { memo } from 'react';
import { UncontrolledTooltip } from "reactstrap";
import { gesturesIcons } from "../GestureDetector";

const {
    fist,
    high_five,
    left,
    right,
    ok,
    one_finger_up,
    one_finger_down,
    two_finger_up,
    two_finger_down,
} = gesturesIcons;

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
