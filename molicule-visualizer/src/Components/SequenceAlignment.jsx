import React from 'react';

function SequenceAlignment({ sequenceAlignment, onResidueClick = () => {} }) {
  // Parse the sequence alignment to extract the aligned sequences
  const lines = sequenceAlignment.split('\n');
  const seq1 = lines[0];
  const alignmentLine = lines[1];
  const seq2 = lines[2];

  const alignment = [];
  for (let i = 0; i < Math.max(seq1.length, seq2.length); i++) {
    const residue1 = seq1[i] || '-';
    const residue2 = seq2[i] || '-';
    const match = alignmentLine[i] || ' ';
    alignment.push([residue1, match, residue2]);
  }

  return (
    <div style={{ overflow: 'auto', maxHeight: '200px', maxWidth: '400px', whiteSpace: 'pre' , fontFamily: 'Courier, monospace'}}>
      <div style={{ color: 'green' }}>
        {alignment.map(([residue], i) => (
          <span key={i} onClick={() => onResidueClick(i + 1)}>
            {residue}
          </span>
        ))}
      </div>
      <div>
        {alignment.map(([, match], i) => <span key={i}>{match}</span>)}
      </div>
      <div style={{ color: 'red' }}>
        {alignment.map(([, , residue], i) => (
          <span key={i} onClick={() => onResidueClick(i + 1)}>
            {residue}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SequenceAlignment;
