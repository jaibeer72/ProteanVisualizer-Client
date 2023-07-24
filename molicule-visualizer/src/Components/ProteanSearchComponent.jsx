import React, { useState } from 'react'
import { suggestProteins } from '../Utils/AxiosCallsHelper';

export default function ProteanSearchComponent() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  
    const handleSearch = async () => {
      try {
        const proteins = await suggestProteins(query);
        setSuggestions(proteins.result_set);
      } catch (error) {
        console.error('Error fetching protein suggestions:', error.message);
      }
    };
    return (
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={handleSearch} // Call handleSearch on each key press
          />
    
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion) => (
                <li key={suggestion.identifier}>
                  {suggestion.identifier}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
