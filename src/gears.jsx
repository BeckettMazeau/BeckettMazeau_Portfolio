// gears.jsx - Dummy component
const Gears = () => {
  return (
    <div className="gears-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            @keyframes spin-cw {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-ccw {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .gear { transform-origin: center; }
            .large { animation: spin-cw 10s linear infinite; fill: #A9A9A9; }
            .medium { animation: spin-ccw 6.66s linear infinite; fill: #C0C0C0; }
            .small { animation: spin-cw 3.33s linear infinite; fill: #D3D3D3; }
          `}
        </style>

        {/* Large Gear */}
        <g className="gear large" style={{ transformOrigin: '100px 100px' }}>
          <circle cx="100" cy="100" r="40" stroke="#808080" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect key={deg} x="95" y="50" width="10" height="20" rx="2" fill="#808080" transform={`rotate(${deg} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="15" fill="white" />
        </g>

        {/* Medium Gear */}
        <g className="gear medium" style={{ transformOrigin: '165px 100px' }}>
          <circle cx="165" cy="100" r="25" stroke="#808080" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <rect key={deg} x="160" y="70" width="10" height="15" rx="2" fill="#808080" transform={`rotate(${deg} 165 100)`} />
          ))}
          <circle cx="165" cy="100" r="10" fill="white" />
        </g>

        {/* Small Gear */}
        <g className="gear small" style={{ transformOrigin: '135px 45px' }}>
          <circle cx="135" cy="45" r="15" stroke="#808080" strokeWidth="2" />
          {[0, 90, 180, 270].map((deg) => (
            <rect key={deg} x="132" y="25" width="6" height="10" rx="1" fill="#808080" transform={`rotate(${deg} 135 45)`} />
          ))}
          <circle cx="135" cy="45" r="5" fill="white" />
        </g>
      </svg>
    </div>
  );
};
window.Gears = Gears;
