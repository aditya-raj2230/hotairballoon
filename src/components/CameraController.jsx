// **CameraController.js** - Camera Controller Component
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraController = ({ targetPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(targetPosition[0], targetPosition[1] + 2, targetPosition[2] + 5);
    camera.lookAt(...targetPosition);
  }, [camera, targetPosition]);

  return null;
};

export default CameraController;