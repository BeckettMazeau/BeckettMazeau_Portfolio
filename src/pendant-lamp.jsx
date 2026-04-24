

const PendantLamp = () => {
  return (
    <div className="pendant-lamp-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100%', paddingTop: '20px' }}>
      <svg width="200" height="400" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            @keyframes swing {
              0% { transform: rotate(-5deg); }
              50% { transform: rotate(5deg); }
              100% { transform: rotate(-5deg); }
            }
            .swing-arm {
              animation: swing 4s ease-in-out infinite;
              transform-origin: 100px 0px;
            }
          `}
        </style>

        {/* Anchor Point */}
        <rect x="90" y="0" width="20" height="5" fill="#4a4a4a" />

        {/* Swinging Part */}
        <g className="swing-arm">
          {/* Cord */}
          <line x1="100" y1="0" x2="100" y2="150" stroke="#333" strokeWidth="3" />

          {/* Lamp Socket/Connector */}
          <rect x="92" y="150" width="16" height="20" rx="2" fill="#666" />

          {/* Lamp Shade - Industrial Dome */}
          <path d="M40 230 Q40 170 100 170 Q160 170 160 230 L160 250 L40 250 Z" fill="#A9A9A9" stroke="#808080" strokeWidth="2" />

          {/* Rim/Detail */}
          <rect x="35" y="250" width="130" height="8" rx="4" fill="#808080" />

          {/* Light Bulb (Visible from bottom) */}
          <circle cx="100" cy="245" r="15" fill="#FFFBE6" opacity="0.8" />
          <circle cx="100" cy="245" r="25" fill="#FFFBE6" opacity="0.2">
            <animate attributeName="opacity" values="0.2;0.3;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
};
window.PendantLamp = PendantLamp;
