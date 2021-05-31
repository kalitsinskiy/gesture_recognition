// Points for fingers
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

const fingerColor = 'plum';

const fingerBonePoint = {
    size: 5,
    color: 'gold',
}

// Infinity Gauntlet Style
const style = {
    0: { color: "yellow", size: 15 },
    1: fingerBonePoint,
    2: { color: "green", size: 10 },
    3: fingerBonePoint,
    4: fingerBonePoint,
    5: { color: "purple", size: 10 },
    6: fingerBonePoint,
    7: fingerBonePoint,
    8: fingerBonePoint,
    9: { color: "blue", size: 10 },
    10: fingerBonePoint,
    11: fingerBonePoint,
    12: fingerBonePoint,
    13: { color: "red", size: 10 },
    14: fingerBonePoint,
    15: fingerBonePoint,
    16: fingerBonePoint,
    17: { color: "orange", size: 10 },
    18: fingerBonePoint,
    19: fingerBonePoint,
    20: fingerBonePoint,
};

const staticHeight = 340;

// Drawing function
const drawHand = (predictions, ctx) => {
    const ctxHeight = ctx?.canvas?.height;

    // Check if we have predictions
    if (predictions.length > 0) {
        // Loop through each prediction
        predictions.forEach((prediction) => {
            // Grab landmarks
            const landmarks = prediction.landmarks;

            // Loop through fingers
            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                //  Loop through pairs of joints
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                    // Get pairs of joints
                    const firstJointIndex = fingerJoints[finger][k];
                    const secondJointIndex = fingerJoints[finger][k + 1];

                    // Draw path
                    ctx.beginPath();
                    ctx.moveTo(
                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1]
                    );
                    ctx.lineTo(
                        landmarks[secondJointIndex][0],
                        landmarks[secondJointIndex][1]
                    );
                    ctx.strokeStyle = fingerColor;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }

            // Loop through landmarks and draw em
            for (let i = 0; i < landmarks.length; i++) {
                // Get x point
                const x = landmarks[i][0];
                // Get y point
                const y = landmarks[i][1];
                // Start drawing
                ctx.beginPath();
                const size = style[i]["size"];
                const responsiveSize = ctxHeight ? (ctxHeight / staticHeight) * size : size
                ctx.arc(x, y, responsiveSize, 0, 3 * Math.PI);

                // Set line color
                ctx.fillStyle = style[i]["color"];
                ctx.fill();
            }
        });
    }
};

export default drawHand;
