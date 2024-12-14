






// **Clouds.js** - Clouds Component
import React from 'react';

const Clouds = ({ currentLayer, windDirection, balloonPosition }) => {
  const cloudLayerY = currentLayer * -0.5;

  return (
    <group>
      <mesh position={[balloonPosition[0] + windDirection.x, cloudLayerY, balloonPosition[2] + windDirection.z]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="white" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

export default Clouds;