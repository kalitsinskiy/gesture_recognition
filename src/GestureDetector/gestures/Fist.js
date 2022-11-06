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
    HorizontalLeft,
    HorizontalRight,
} = directions;

const fistGesture = new GestureDescription('fist');

// Thumb
fistGesture.addCurl(Thumb, NoCurl, -5);
fistGesture.addCurl(Thumb, HalfCurl, 0.7);
fistGesture.addCurl(Thumb, FullCurl, 1);
fistGesture.addDirection(Thumb, VerticalUp, 1);
fistGesture.addDirection(Thumb, DiagonalUpLeft, 0.9);
fistGesture.addDirection(Thumb, DiagonalUpRight, 0.9);
fistGesture.addDirection(Thumb, HorizontalLeft, -5);
fistGesture.addDirection(Thumb, HorizontalRight, -5);

// Rest
for(let finger of [Index, Middle, Ring, Pinky]){
    fistGesture.addCurl(finger, FullCurl, 1);
    fistGesture.addCurl(finger, NoCurl, -3);
    fistGesture.addCurl(finger, HalfCurl, -2);
    fistGesture.addDirection(finger, VerticalUp, 1);
    fistGesture.addDirection(finger, DiagonalUpLeft, 0.9);
    fistGesture.addDirection(finger, DiagonalUpRight, 0.9);
}

export default fistGesture
