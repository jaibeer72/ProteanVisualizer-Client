import React, {useState} from 'react';

function SequenceAlignment({ sequenceAlignment, onResidueClick = () => {} }) {
  // Parse the sequence alignment to extract the aligned sequences
  const lines = sequenceAlignment.split('\n');
  const seq1 = lines[0];
  const alignmentLine = lines[1];
  const seq2 = lines[2];

  const alignment = [];
  let residueCounter = 0;
  for (let i = 0; i < Math.max(seq1.length, seq2.length); i++) {
    const residue1 = seq1[i] || '-';
    const residue2 = seq2[i] || '-';
    const match = alignmentLine[i] || ' ';
    if (residue1 !== '-' && residue1 !== ' ') {
      residueCounter++;
    }
    alignment.push([residue1, match, residue2, residueCounter]);
  }

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={{ overflow: 'auto', maxHeight: '200px', maxWidth: '400px', whiteSpace: 'pre' , fontFamily: 'Courier, monospace'}}>
      <div style={{ color: 'green' }}>
        {alignment.map(([residue, , , residueIndex], i)  => (
          <span 
            key={i} 
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onResidueClick(residueIndex)}
            style={{ backgroundColor: i === hoveredIndex ? '#eee' : 'transparent' }}
            >
            {residue}
          </span>
        ))}
      </div>
      <div>
        {alignment.map(([, match], i) => (
        <span 
          key={i}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ backgroundColor: i === hoveredIndex ? '#eee' : 'transparent' }}
          >
          {match}
          </span>))}
      </div>
      <div style={{ color: 'red' }}>
        {alignment.map(([, , residue, residueIndex], i)  => (
          <span 
          key={i} 
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onResidueClick(residueIndex)}
          style={{ backgroundColor: i === hoveredIndex ? '#eee' : 'transparent' }}
          >
            {residue}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SequenceAlignment;
