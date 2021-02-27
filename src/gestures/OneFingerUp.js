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

const oneFingerUp = new GestureDescription('one_finger_up');

// Thumb
oneFingerUp.addCurl(Thumb, HalfCurl, 1);
oneFingerUp.addCurl(Thumb, FullCurl, 1);
oneFingerUp.addCurl(Thumb, NoCurl, 1);
oneFingerUp.addDirection(Thumb, VerticalUp, 1);
oneFingerUp.addDirection(Thumb, DiagonalUpRight, 0.5);
oneFingerUp.addDirection(Thumb, DiagonalUpLeft, 0.5);
oneFingerUp.addDirection(Thumb, VerticalDown, -5);
oneFingerUp.addDirection(Thumb, HorizontalLeft, -5);
oneFingerUp.addDirection(Thumb, HorizontalRight, -5);
oneFingerUp.addDirection(Thumb, DiagonalDownRight, -5);
oneFingerUp.addDirection(Thumb, DiagonalDownLeft, -5);

// Index
oneFingerUp.addCurl(Index, NoCurl, 1);
oneFingerUp.addDirection(Index, VerticalUp, 1);
oneFingerUp.addDirection(Index, DiagonalUpRight, 1);
oneFingerUp.addDirection(Index, DiagonalUpLeft, 1);
oneFingerUp.addCurl(Index, FullCurl, -5);
oneFingerUp.addCurl(Index, HalfCurl, -5);
oneFingerUp.addDirection(Index, VerticalDown, -5);
oneFingerUp.addDirection(Index, HorizontalLeft, -5);
oneFingerUp.addDirection(Index, HorizontalRight, -5);
oneFingerUp.addDirection(Index, DiagonalDownRight, -5);
oneFingerUp.addDirection(Index, DiagonalDownLeft, -5);

// Rest
for(let finger of [Middle, Ring, Pinky]){
    oneFingerUp.addCurl(finger, FullCurl, 1);
    oneFingerUp.addDirection(finger, VerticalUp, 1);
    oneFingerUp.addDirection(finger, DiagonalUpLeft, 1);
    oneFingerUp.addDirection(finger, DiagonalUpRight, 1);

    oneFingerUp.addCurl(finger, NoCurl, -5);
    oneFingerUp.addDirection(finger, VerticalDown, -1);
    oneFingerUp.addDirection(finger, HorizontalLeft, -1);
    oneFingerUp.addDirection(finger, HorizontalRight, -1);
    oneFingerUp.addCurl(finger, HalfCurl, -1);
    oneFingerUp.addDirection(finger, DiagonalDownRight, -1);
    oneFingerUp.addDirection(finger, DiagonalDownLeft, -1);
}

export default oneFingerUp;
