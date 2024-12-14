import React from 'react';
import { Line } from '@react-three/drei';

const Track = () => {
  const scale = 10; // Scaling factor for the map size

  // Define control points for the F1-style track on the XZ plane
  const controlPoints = [
    [0, 0, 0],
    [10, 0, 20],
    [30, 0, 40],
    [50, 0, 20],
    [70, 0, -10],
    [90, 0, -30],
    [70, 0, -50],
    [50, 0, -30],
    [30, 0, -10],
    [10, 0, 0], // Close the track
  ].map(([x, y, z]) => [x * scale, y, z * scale]);

  return (
    <Line
      points={controlPoints} // Define the track using control points
      color="blue" // Line color
      lineWidth={2} // Line width
      curveType="catmullrom" // Smooth curve
      closed // Connect the first and last points to close the track
    />
  );
};

export default Track;
