import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import Track  from './Trach';
import Map from './Map';

const Balloon = ({ position, layer, updatePosition }) => {
  const balloonRef = useRef();

  const getWindDirection = () => {
    switch (layer) {
      case 4:
        return new THREE.Vector3(-0.01, 0, 0); // West
      case 3:
        return new THREE.Vector3(0.01, 0, 0); // East
      case 2:
        return new THREE.Vector3(0, 0, -0.01); // South
      case 1:
        return new THREE.Vector3(0, 0, 0.01); // North
      case 0:
      default:
        return new THREE.Vector3(0, 0, 0); // No wind
    }
  };

  useFrame(() => {
    if (balloonRef.current) {
      const windDirection = getWindDirection();
      const newPosition = new THREE.Vector3(
        position[0] + windDirection.x,
        THREE.MathUtils.lerp(balloonRef.current.position.y, position[1], 0.1),
        position[2] + windDirection.z
      );

      balloonRef.current.position.copy(newPosition);
      updatePosition(newPosition.toArray());
    }
  });

  return (
    <mesh ref={balloonRef}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const CameraController = ({ targetPosition }) => {
  const { camera } = useThree();
  useFrame(() => {
    const targetY = Math.floor(-targetPosition[1] / 0.5) * 0.5;
    camera.position.set(targetPosition[0], targetY + 0.5, targetPosition[2] + 5);
    camera.lookAt(targetPosition[0], targetY, targetPosition[2]);
  });
  return null;
};

const Clouds = ({ currentLayer, windDirection }) => {
  const cloudRefs = useRef([]);
  const layerHeight = 0.5;

  useEffect(() => {
    // Initialize random positions for clouds
    cloudRefs.current.forEach((cloud) => {
      cloud.position.set(
        Math.random() * 10 - 5,
        Math.random() * 5 - 2.5,
        Math.random() * 10 - 5
      );
    });
  }, []);

  useFrame(() => {
    cloudRefs.current.forEach((cloud, index) => {
      const layer = Math.floor(index / 10); // Assume 10 clouds per layer
      if (layer === currentLayer) {
        if (currentLayer === 4 || currentLayer === 3) {
          // Move clouds horizontally (West/East)
          cloud.position.x += windDirection.x;
        } else if (currentLayer === 2 || currentLayer === 1) {
          // Move clouds along Z-axis (South/North)
          cloud.position.z += windDirection.z;
        }
      }
    });
  });

  return (
    <group>
      {new Array(50).fill(0).map((_, index) => (
        <mesh
          key={index}
          ref={(el) => (cloudRefs.current[index] = el)}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color="white"
            opacity={0.8}
            transparent
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const HotaitBalloon = () => {
  const layerHeight = 0.5;
  const [position, setPosition] = useState([0, -layerHeight * 2, 0]);
  const [currentLayer, setCurrentLayer] = useState(2);
  const [currentTime, setCurrentTime] = useState(0);
  const [balloonPosition, setBalloonPosition] = useState([0, 0, 0]);

  const trackPoints = []; // Static track points
  const segments = 100;
  const scale = 10;

  // Generate static zig-zag track
  for (let i = 0; i <= segments; i++) {
    const x = i * scale;
    const z = (i % 2 === 0 ? 1 : -1) * scale;
    trackPoints.push([x, 0, z]);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => prevTime + 0.1); // Increment time to simulate movement
    }, 100); // Update every 100ms for smoother animation

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const moveUp = () => setPosition(([x, y, z]) => [x, Math.min(y + 0.1, 0), z]);
  const moveDown = () =>
    setPosition(([x, y, z]) => [x, Math.max(y - 0.1, -layerHeight * 4), z]);

  const handleLayerChange = (posY) => {
    const newLayer = Math.round(-posY / layerHeight);
    if (newLayer !== currentLayer) {
      setCurrentLayer(newLayer);
    }
  };

  useEffect(() => {
    handleLayerChange(position[1]);
  }, [position]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') moveUp();
      if (event.key === 'ArrowDown') moveDown();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getWindDirection = () => {
    switch (currentLayer) {
      case 4:
        return new THREE.Vector3(-0.01, 0, 0); // West
      case 3:
        return new THREE.Vector3(0.01, 0, 0); // East
      case 2:
        return new THREE.Vector3(0, 0, -0.01); // South
      case 1:
        return new THREE.Vector3(0, 0, 0.01); // North
      case 0:
      default:
        return new THREE.Vector3(0, 0, 0); // No wind
    }
  };

  const windDirection = getWindDirection();

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#000',
      }}
    >
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Balloon position={position} layer={currentLayer} updatePosition={setPosition} />
        <CameraController targetPosition={position} />
        <Clouds currentLayer={currentLayer} windDirection={windDirection} />
        <Track />
      </Canvas>
      <Map balloonPosition={balloonPosition} trackPoints={trackPoints} />

      {/* Mini-map displaying the track and balloon */}
      <Map balloonPosition={balloonPosition} trackPoints={trackPoints} />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          textAlign: 'center',
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p>Current Layer: {currentLayer}</p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <button onClick={moveUp} style={{ margin: '5px', padding: '10px' }}>
          Move Up
        </button>
        <button onClick={moveDown} style={{ margin: '5px', padding: '10px' }}>
          Move Down
        </button>
      </div>
    </div>
  );
};

export default HotaitBalloon;
