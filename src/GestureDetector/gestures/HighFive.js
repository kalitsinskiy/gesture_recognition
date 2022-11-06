import { GestureDescription } from 'fingerpose';

import fingers from '../../utils/fingers';
import curls from '../../utils/curls';
import directions from '../../utils/directions';

const { Thumb, Index, Middle, Ring, Pinky } = fingers;
const { NoCurl, FullCurl, HalfCurl } = curls;
const {
    HorizontalLeft,
    HorizontalRight,
    DiagonalUpLeft,
    DiagonalUpRight,
    VerticalUp,
    VerticalDown,
    DiagonalDownLeft,
    DiagonalDownRight,
} = directions;

const highFiveGesture = new GestureDescription('high_five');

// Thumb
highFiveGesture.addCurl(Thumb, NoCurl, 1);
highFiveGesture.addCurl(Thumb, FullCurl, -5);
highFiveGesture.addCurl(Thumb, HalfCurl, -5);
highFiveGesture.addDirection(Thumb, HorizontalLeft, 0.25);
highFiveGesture.addDirection(Thumb, HorizontalRight, 0.25);
highFiveGesture.addDirection(Thumb, DiagonalUpLeft, 1);
highFiveGesture.addDirection(Thumb, DiagonalUpRight, 1);


// Index
highFiveGesture.addCurl(Index, NoCurl, 1);
highFiveGesture.addCurl(Index, HalfCurl, -5)
highFiveGesture.addCurl(Index, FullCurl, -5)
highFiveGesture.addDirection(Index, VerticalUp, 1);
highFiveGesture.addDirection(Index, DiagonalUpLeft, 1);
highFiveGesture.addDirection(Index, DiagonalUpRight, 1);
highFiveGesture.addDirection(Index, HorizontalLeft, -1);
highFiveGesture.addDirection(Index, HorizontalRight, -1);
highFiveGesture.addDirection(Index, VerticalDown, -1);
highFiveGesture.addDirection(Index, DiagonalDownLeft, -1);
highFiveGesture.addDirection(Index, DiagonalDownRight, -1);

// Rest
for(let finger of [Middle, Ring, Pinky]){
    highFiveGesture.addCurl(finger, NoCurl, 1);
    highFiveGesture.addCurl(finger, FullCurl, -2);
    highFiveGesture.addCurl(finger, HalfCurl, -2);
    highFiveGesture.addDirection(finger, VerticalUp, 1);
    highFiveGesture.addDirection(finger, DiagonalUpLeft, 1);
    highFiveGesture.addDirection(finger, DiagonalUpRight, 1);
    highFiveGesture.addDirection(finger, HorizontalLeft, -1);
    highFiveGesture.addDirection(finger, HorizontalRight, -1);
    highFiveGesture.addDirection(finger, VerticalDown, -1);
    highFiveGesture.addDirection(finger, DiagonalDownLeft, -1);
    highFiveGesture.addDirection(finger, DiagonalDownRight, -1);
}

export default highFiveGesture
