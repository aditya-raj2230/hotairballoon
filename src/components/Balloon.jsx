

import React from 'react';

const Balloon = ({ position, layer }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={layer === 2 ? 'red' : 'orange'} />
    </mesh>
  );
};

export default Balloon;