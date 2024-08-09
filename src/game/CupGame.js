// src/CupGame.js
import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Cup from './Cup';
import Ball from './Ball';
import { useSpring } from 'react-spring/three';

const CupGame = () => {
  const [shuffling, setShuffling] = useState(false);
  const [selectedCup, setSelectedCup] = useState(null);
  const [ballPosition, setBallPosition] = useState(Math.floor(Math.random() * 3));
  const animsRef = useRef(null);

  const cups = [
    { position: [-1.5, 0, 0], depth: 0 },
    { position: [0, 0, 0], depth: 0 },
    { position: [1.5, 0, 0], depth: 0 },
  ];

  const shuffleCups = () => {
    setShuffling(true);
    setBallPosition(Math.floor(Math.random() * 3));

    animsRef.current = setInterval(() => {
      const [first, second] = shuffleArray([0, 1, 2]);
      const newCups = [...cups];

      // Animate cups swapping
      newCups[first] = { ...newCups[first], depth: 1 };
      newCups[second] = { ...newCups[second], depth: 0 };

      const cupFirst = {
        x: newCups[second].position[0],
        scale: 1.25,
        depth: 1,
      };
      const cupSecond = {
        x: newCups[first].position[0],
        scale: 1,
        depth: 0,
      };

      setTimeout(() => {
        newCups[first].position[0] = cupFirst.x;
        newCups[second].position[0] = cupSecond.x;
      }, 200);

      setShuffling(false);
      clearInterval(animsRef.current);
    }, 800);
  };

  const shuffleArray = (array) => {
    const [first, second] = array.sort(() => Math.random() - 0.5);
    return [first, second];
  };

  return (
    <div>
      <h1>3D Cup Guess Game</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} />
        <Environment preset="sunset" />

        {cups.map((cup, index) => (
          <Cup key={index} {...cup} animateProps={shuffling ? { x: cup.position[0], scale: 1.25 } : { x: cup.position[0], scale: 1 }} />
        ))}

        {selectedCup !== null && selectedCup === ballPosition && (
          <Ball position={[selectedCup * 1.5 - 1.5, 0.3, 0]} />
        )}

        <OrbitControls />
      </Canvas>
      <button onClick={shuffleCups} disabled={shuffling}>
        Shuffle Cups
      </button>
    </div>
  );
};

export default CupGame;
