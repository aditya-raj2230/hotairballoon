import React from "react";

const MiniMap = ({ balloonPosition, trackPoints }) => {
  const mapSize = 200; // Size of the mini-map in pixels
  const scale = 1 / 10; // Adjust to scale the track to fit the mini-map

  // Normalize positions to fit inside the mini-map bounds
  const normalizePoint = ([x, y, z]) => [
    (x * scale) + mapSize / 2,
    mapSize - ((z * scale) + mapSize / 2),
  ];

  const normalizedTrack = trackPoints.map(normalizePoint);
  const normalizedBalloon = normalizePoint(balloonPosition);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        width: `${mapSize}px`,
        height: `${mapSize}px`,
        border: "2px solid white",
        backgroundColor: "#111",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <svg
        width={mapSize}
        height={mapSize}
        style={{ display: "block", margin: "auto" }}
      >
        {/* Render track */}
        <polyline
          points={normalizedTrack.map(([x, z]) => `${x},${z}`).join(" ")}
          stroke="blue"
          strokeWidth="2"
          fill="none"
        />
        {/* Render balloon */}
        <circle
          cx={normalizedBalloon[0]}
          cy={normalizedBalloon[1]}
          r="5"
          fill="red"
        />
      </svg>
    </div>
  );
};

export default MiniMap;
