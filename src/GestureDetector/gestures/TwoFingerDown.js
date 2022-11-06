import { GestureDescription } from 'fingerpose';

import fingers from '../../utils/fingers';
import curls from '../../utils/curls';
import directions from '../../utils/directions';

const { Thumb, Index, Middle, Ring, Pinky } = fingers;
const { NoCurl, FullCurl, HalfCurl } = curls;
const {
    DiagonalUpLeft,
    DiagonalUpRight,
    DiagonalDownRight,
    DiagonalDownLeft,
    VerticalUp,
    VerticalDown,
    HorizontalLeft,
    HorizontalRight,
} = directions;

const twoFingerDown = new GestureDescription('two_finger_down');
// Thumb
twoFingerDown.addCurl(Thumb, HalfCurl, 1);
twoFingerDown.addCurl(Thumb, FullCurl, 0.9);
twoFingerDown.addCurl(Thumb, NoCurl, 0.5);
twoFingerDown.addDirection(Thumb, VerticalDown, 1);
twoFingerDown.addDirection(Thumb, VerticalUp, -5);
twoFingerDown.addDirection(Thumb, DiagonalDownRight, 0.9);
twoFingerDown.addDirection(Thumb, DiagonalDownLeft, 0.9);
twoFingerDown.addDirection(Thumb, HorizontalLeft, -5);
twoFingerDown.addDirection(Thumb, HorizontalRight, -5);
twoFingerDown.addDirection(Thumb, DiagonalUpLeft, -5);
twoFingerDown.addDirection(Thumb, DiagonalUpRight, -5);

for(let finger of [Index, Middle]){
    twoFingerDown.addCurl(finger, NoCurl, 1);
    twoFingerDown.addCurl(finger, FullCurl, -5);
    twoFingerDown.addCurl(finger, HalfCurl, -5);
    twoFingerDown.addDirection(finger, VerticalDown, 1);
    twoFingerDown.addDirection(finger, VerticalUp, -5);
    twoFingerDown.addDirection(finger, DiagonalDownRight, 0.9);
    twoFingerDown.addDirection(finger, DiagonalDownLeft, 0.9);
    twoFingerDown.addDirection(finger, HorizontalLeft, -5);
    twoFingerDown.addDirection(finger, HorizontalRight, -5);
    twoFingerDown.addDirection(finger, DiagonalUpLeft, -5);
    twoFingerDown.addDirection(finger, DiagonalUpRight, -5);
}

for(let finger of [Ring, Pinky]){
    twoFingerDown.addCurl(finger, FullCurl, 1);
    twoFingerDown.addCurl(finger, NoCurl, -5);
    twoFingerDown.addCurl(finger, HalfCurl, -1);

    twoFingerDown.addDirection(finger, VerticalDown, 1);
    twoFingerDown.addDirection(finger, VerticalUp, -1);
    twoFingerDown.addDirection(finger, DiagonalDownRight, 0.9);
    twoFingerDown.addDirection(finger, DiagonalDownLeft, 0.9);
    twoFingerDown.addDirection(finger, HorizontalLeft, -1);
    twoFingerDown.addDirection(finger, HorizontalRight, -1);
    twoFingerDown.addDirection(finger, DiagonalUpRight, -1);
    twoFingerDown.addDirection(finger, DiagonalUpLeft, -1);
}

export default twoFingerDown;
