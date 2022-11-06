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

const cornerGesture = new GestureDescription('corner_gesture');

// Thumb
cornerGesture.addCurl(Thumb, NoCurl, 1);
cornerGesture.addCurl(Thumb, HalfCurl, 0.7);
cornerGesture.addCurl(Thumb, FullCurl, -5);
cornerGesture.addDirection(Thumb, HorizontalLeft, 1);
cornerGesture.addDirection(Thumb, HorizontalRight, 1);
cornerGesture.addDirection(Thumb, DiagonalUpRight, 0.7);
cornerGesture.addDirection(Thumb, DiagonalUpLeft, 0.7);
cornerGesture.addDirection(Thumb, VerticalDown, -5);
cornerGesture.addDirection(Thumb, VerticalUp, -5);
cornerGesture.addDirection(Thumb, DiagonalDownRight, -5);
cornerGesture.addDirection(Thumb, DiagonalDownLeft, -5);

// Index
cornerGesture.addCurl(Index, NoCurl, 1);
cornerGesture.addDirection(Index, VerticalUp, 1);
cornerGesture.addDirection(Index, DiagonalUpRight, 1);
cornerGesture.addDirection(Index, DiagonalUpLeft, 1);
cornerGesture.addCurl(Index, FullCurl, -5);
cornerGesture.addCurl(Index, HalfCurl, -5);
cornerGesture.addDirection(Index, VerticalDown, -5);
cornerGesture.addDirection(Index, HorizontalLeft, -5);
cornerGesture.addDirection(Index, HorizontalRight, -5);
cornerGesture.addDirection(Index, DiagonalDownRight, -5);
cornerGesture.addDirection(Index, DiagonalDownLeft, -5);

// Rest
for(let finger of [Middle, Ring, Pinky]){
    cornerGesture.addCurl(finger, FullCurl, 1);
    cornerGesture.addDirection(finger, VerticalUp, 1);
    cornerGesture.addDirection(finger, DiagonalUpLeft, 1);
    cornerGesture.addDirection(finger, DiagonalUpRight, 1);

    cornerGesture.addCurl(finger, NoCurl, -5);
    cornerGesture.addDirection(finger, VerticalDown, -1);
    cornerGesture.addDirection(finger, HorizontalLeft, -1);
    cornerGesture.addDirection(finger, HorizontalRight, -1);
    cornerGesture.addCurl(finger, HalfCurl, -1);
    cornerGesture.addDirection(finger, DiagonalDownRight, -1);
    cornerGesture.addDirection(finger, DiagonalDownLeft, -1);
}

export default cornerGesture;
