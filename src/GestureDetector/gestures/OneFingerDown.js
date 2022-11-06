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

const oneFingerDown = new GestureDescription('one_finger_down');

// Thumb
oneFingerDown.addCurl(Thumb, HalfCurl, 1);
oneFingerDown.addCurl(Thumb, FullCurl, 1);
oneFingerDown.addCurl(Thumb, NoCurl, 1);
oneFingerDown.addDirection(Thumb, VerticalDown, 1);
oneFingerDown.addDirection(Thumb, DiagonalDownRight, 0.5);
oneFingerDown.addDirection(Thumb, DiagonalDownLeft, 0.5);
oneFingerDown.addDirection(Thumb, VerticalUp, -5);
oneFingerDown.addDirection(Thumb, HorizontalLeft, -5);
oneFingerDown.addDirection(Thumb, HorizontalRight, -5);
oneFingerDown.addDirection(Thumb, DiagonalUpLeft, -5);
oneFingerDown.addDirection(Thumb, DiagonalDownRight, -5);

// Index
oneFingerDown.addCurl(Index, NoCurl, 1);
oneFingerDown.addCurl(Index, FullCurl, -5);
oneFingerDown.addCurl(Index, HalfCurl, -5);
oneFingerDown.addDirection(Index, VerticalDown, 1);
oneFingerDown.addDirection(Index, DiagonalDownRight, 1);
oneFingerDown.addDirection(Index, DiagonalDownLeft, 1);
oneFingerDown.addDirection(Index, VerticalUp, -5);
oneFingerDown.addDirection(Index, DiagonalUpLeft, -5);
oneFingerDown.addDirection(Index, DiagonalUpRight, -5);
oneFingerDown.addDirection(Index, HorizontalLeft, -5);
oneFingerDown.addDirection(Index, HorizontalRight, -5);

// Rest
for(let finger of [Middle, Ring, Pinky]){
    oneFingerDown.addCurl(finger, FullCurl, 1);
    oneFingerDown.addCurl(finger, NoCurl, -5);
    oneFingerDown.addCurl(finger, HalfCurl, -1);

    oneFingerDown.addDirection(finger, VerticalDown, 1);
    oneFingerDown.addDirection(finger, DiagonalDownRight, 1);
    oneFingerDown.addDirection(finger, DiagonalDownLeft, 1);
    oneFingerDown.addDirection(finger, VerticalUp, -1);
    oneFingerDown.addDirection(finger, DiagonalUpLeft, -1);
    oneFingerDown.addDirection(finger, DiagonalUpRight, -1);
    oneFingerDown.addDirection(finger, HorizontalLeft, -1);
    oneFingerDown.addDirection(finger, HorizontalRight, -1);
}

export default oneFingerDown;
