// src/Ball.js
import React from 'react';

const Ball = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default Ball;
