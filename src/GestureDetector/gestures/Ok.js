import { GestureDescription } from 'fingerpose';

import fingers from '../../utils/fingers';
import curls from '../../utils/curls';
import directions from '../../utils/directions';

const { Thumb, Index, Middle, Ring, Pinky } = fingers;
const { NoCurl, FullCurl, HalfCurl } = curls;
const { DiagonalUpLeft, DiagonalUpRight, VerticalUp } = directions;
const okGesture = new GestureDescription('ok');

// Thumb
okGesture.addCurl(Thumb, HalfCurl, 1.5)
okGesture.addCurl(Thumb, NoCurl, 1.5)
okGesture.addDirection(Thumb, DiagonalUpLeft, 1.5);
okGesture.addDirection(Thumb, DiagonalUpRight, 1.5);

// Index
okGesture.addCurl(Index, HalfCurl, 1.5)
okGesture.addCurl(Index, NoCurl, -5)
okGesture.addCurl(Index, FullCurl, 0.5)
// okGesture.addDirection(Index, VerticalDown, 1.5);
okGesture.addDirection(Index, DiagonalUpLeft, 1.5);
okGesture.addDirection(Index, DiagonalUpRight, 1.5);

// Middle
okGesture.addCurl(Middle, NoCurl, 0.66);
okGesture.addCurl(Middle, FullCurl, -1);
okGesture.addDirection(Middle, VerticalUp, 0.66);

// Ring
okGesture.addCurl(Ring, NoCurl, 0.66);
okGesture.addCurl(Ring, FullCurl, -1);
okGesture.addDirection(Ring, VerticalUp, 0.66);
okGesture.addDirection(Ring, DiagonalUpLeft, 0.5);
okGesture.addDirection(Ring, DiagonalUpRight, 0.5);

// Pinky
okGesture.addCurl(Pinky, NoCurl, 0.66)
okGesture.addCurl(Pinky, FullCurl, -1);
okGesture.addDirection(Pinky, VerticalUp, 0.66);
okGesture.addDirection(Pinky, DiagonalUpLeft, 0.66);
okGesture.addDirection(Pinky, DiagonalUpRight, 0.66);

export default okGesture




