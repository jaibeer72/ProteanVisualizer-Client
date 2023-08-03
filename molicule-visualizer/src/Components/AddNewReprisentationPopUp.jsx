import React, { useState, useEffect } from 'react';
import { ApplyableReprisentations } from '../Utils/ReprisentationListHelper';


export default function AddNewReprisentationPopUp({ isOpen, onClose, onSubmit, proteanName }) {
    const [representation, setRepresentation] = useState('');
    const [parameters, setParameters] = useState({});
  
    useEffect(() => {
      if (representation) {
        const initialParameters = {};
        const repParameters = ApplyableReprisentations[representation].parameters;
        for (let key in repParameters) {
          initialParameters[key] = repParameters[key].default || '';
        }
        setParameters(initialParameters);
      }
    }, [representation]);
  
    if (!isOpen) {
      return null;
    }
  
    function handleParameterChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setParameters({
        ...parameters,
        [event.target.name]: value
      });
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      onSubmit(proteanName,representation, parameters);
    }
  
    function renderInputField(key, parameter) {
      switch (parameter.type) {
        case 'boolean':
          return (
            <input
              type="checkbox"
              name={key}
              checked={parameters[key] || false}
              onChange={handleParameterChange}
            />
          );
        case 'number':
          return (
            <input
              type="range"
              name={key}
              min={parameter.min}
              max={parameter.max}
              value={parameters[key] || ''}
              onChange={handleParameterChange}
            />
          );
        case 'hidden':
          return null;
        default:
          return (
            <input
              type="text"
              name={key}
              value={parameters[key] || ''}
              onChange={handleParameterChange}
            />
          );
      }
    }
  
    return (
      <div className="popup">
        <div className="popup-content">
          <span className="close" onClick={onClose}>&times;</span>
          <form onSubmit={handleSubmit}>
            <label>
              Representation:
              <select value={representation} onChange={e => setRepresentation(e.target.value)}>
                <option value="">--Select a representation--</option>
                {Object.keys(ApplyableReprisentations).map(rep => (
                  <option key={rep} value={rep}>{rep}</option>
                ))}
              </select>
            </label>
            {representation && (
              <fieldset>
                <legend>Parameters:</legend>
                {Object.entries(ApplyableReprisentations[representation].parameters).map(([key, parameter]) => (
                  <label key={key}>
                    {key} ({parameter.type}):
                    {renderInputField(key, parameter)}
                  </label>
                ))}
              </fieldset>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
};
