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

const leftGesture = new GestureDescription('left');

// Thumb
leftGesture.addCurl(Thumb, NoCurl, 1);
leftGesture.addCurl(Thumb, HalfCurl, -5);
leftGesture.addCurl(Thumb, FullCurl, -5);
leftGesture.addDirection(Thumb, DiagonalUpRight, 0.7);
leftGesture.addDirection(Thumb, HorizontalRight, 1);
leftGesture.addDirection(Thumb, DiagonalDownRight, 0.7);

leftGesture.addDirection(Thumb, VerticalUp, -5);
leftGesture.addDirection(Thumb, VerticalDown, -5);
leftGesture.addDirection(Thumb, DiagonalUpLeft, -5);
leftGesture.addDirection(Thumb, HorizontalLeft, -5);
leftGesture.addDirection(Thumb, DiagonalDownLeft, -5);

// Rest
for(let finger of [Index, Middle, Ring, Pinky]){
    leftGesture.addCurl(finger, FullCurl, 1);
    leftGesture.addCurl(finger, NoCurl, -3);
    leftGesture.addCurl(finger, HalfCurl, -2);
    leftGesture.addDirection(finger, VerticalUp, 1);
    leftGesture.addDirection(finger, DiagonalUpLeft, 0.9);
    leftGesture.addDirection(finger, DiagonalUpRight, 0.9);
}

export default leftGesture
