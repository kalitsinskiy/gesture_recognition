import { GestureDescription } from 'fingerpose';

import fingers from '../../utils/fingers';
import curls from '../../utils/curls';
import directions from '../../utils/directions';

const { Thumb, Index, Middle, Ring, Pinky } = fingers;
const { NoCurl, FullCurl, HalfCurl } = curls;
const {
    DiagonalUpLeft,
    DiagonalUpRight,
    VerticalUp,
    VerticalDown,
    HorizontalLeft,
    HorizontalRight,
    DiagonalDownLeft,
    DiagonalDownRight,
} = directions;

const rightGesture = new GestureDescription('right');

// Thumb
rightGesture.addCurl(Thumb, NoCurl, 1);
rightGesture.addCurl(Thumb, HalfCurl, -5);
rightGesture.addCurl(Thumb, FullCurl, -5);
rightGesture.addDirection(Thumb, DiagonalUpLeft, 0.7);
rightGesture.addDirection(Thumb, HorizontalLeft, 1);
rightGesture.addDirection(Thumb, DiagonalDownLeft, 0.7);

rightGesture.addDirection(Thumb, VerticalUp, -5);
rightGesture.addDirection(Thumb, VerticalDown, -5);
rightGesture.addDirection(Thumb, DiagonalUpRight, -5);
rightGesture.addDirection(Thumb, HorizontalRight, -5);
rightGesture.addDirection(Thumb, DiagonalDownRight, -5);

// Rest
for(let finger of [Index, Middle, Ring, Pinky]){
    rightGesture.addCurl(finger, FullCurl, 1);
    rightGesture.addCurl(finger, NoCurl, -3);
    rightGesture.addCurl(finger, HalfCurl, -2);
    rightGesture.addDirection(finger, VerticalUp, 1);
    rightGesture.addDirection(finger, DiagonalUpLeft, 0.9);
    rightGesture.addDirection(finger, DiagonalUpRight, 0.9);
}

export default rightGesture
