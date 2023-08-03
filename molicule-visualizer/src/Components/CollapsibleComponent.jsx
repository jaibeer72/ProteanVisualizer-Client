import React, { useState } from 'react';

function CollapsibleComponent({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      <button onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <div style={{ display: isCollapsed ? 'none' : 'block' }}>
        {children}
      </div>
    </div>
  );
}

export default CollapsibleComponent;