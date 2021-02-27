import { GestureDescription } from 'fingerpose';

import fingers from '../utils/fingers';
import curls from '../utils/curls';
import directions from '../utils/directions';

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

const twoFingerUp = new GestureDescription('two_finger_up');

// Thumb
twoFingerUp.addDirection(Thumb, VerticalUp, 1);
twoFingerUp.addCurl(Thumb, HalfCurl, 1);
twoFingerUp.addCurl(Thumb, FullCurl, 0.9);
twoFingerUp.addCurl(Thumb, NoCurl, 0.5);
twoFingerUp.addDirection(Thumb, DiagonalUpRight, 0.9);
twoFingerUp.addDirection(Thumb, DiagonalUpLeft, 0.9);
twoFingerUp.addDirection(Thumb, VerticalDown, -5);
twoFingerUp.addDirection(Thumb, HorizontalLeft, -5);
twoFingerUp.addDirection(Thumb, HorizontalRight, -5);
twoFingerUp.addDirection(Thumb, DiagonalDownRight, -5);
twoFingerUp.addDirection(Thumb, DiagonalDownLeft, -5);

for(let finger of [Index, Middle]){
    twoFingerUp.addCurl(finger, NoCurl, 1);
    twoFingerUp.addCurl(finger, FullCurl, -5);
    twoFingerUp.addCurl(finger, HalfCurl, -5);

    twoFingerUp.addDirection(finger, VerticalUp, 1);
    twoFingerUp.addDirection(finger, DiagonalUpRight, 0.9);
    twoFingerUp.addDirection(finger, DiagonalUpLeft, 0.9);
    twoFingerUp.addDirection(finger, VerticalDown, -5);
    twoFingerUp.addDirection(finger, HorizontalLeft, -5);
    twoFingerUp.addDirection(finger, HorizontalRight, -5);
    twoFingerUp.addDirection(finger, DiagonalDownRight, -5);
    twoFingerUp.addDirection(finger, DiagonalDownLeft, -5);
}

for(let finger of [Ring, Pinky]){
    twoFingerUp.addDirection(finger, VerticalUp, 1);
    twoFingerUp.addCurl(finger, FullCurl, 1);
    twoFingerUp.addDirection(finger, DiagonalUpLeft, 0.9);
    twoFingerUp.addDirection(finger, DiagonalUpRight, 0.9);

    twoFingerUp.addCurl(finger, NoCurl, -5);
    twoFingerUp.addCurl(finger, HalfCurl, -1);
    twoFingerUp.addDirection(finger, VerticalDown, -1);
    twoFingerUp.addDirection(finger, HorizontalLeft, -1);
    twoFingerUp.addDirection(finger, HorizontalRight, -1);
    twoFingerUp.addDirection(finger, DiagonalDownRight, -1);
    twoFingerUp.addDirection(finger, DiagonalDownLeft, -1);
}

export default twoFingerUp;
