import React, { useState } from 'react'
import { getProteinDetails_Sequence, suggestProteins } from '../Utils/AxiosCallsHelper';

export default function ProteanSearchComponent() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async () => {
        try {
            const proteins = await suggestProteins(query);
            // Separate the protein ID and entity ID from the identifier for each suggestion
            const formattedSuggestions = proteins.map((suggestion) => {
                const [proteinId, entityId] = suggestion.identifier.split('_');
                return {
                    proteinId,
                    entityId,
                };
            });
            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error('Error fetching protein suggestions:', error.message);
        }
    };
    const handleClickSuggestion = async (proteanID , entityID) => {
        
        let result = await getProteinDetails_Sequence(proteanID, entityID);
        console.log(result);

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
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={()=>handleClickSuggestion(suggestion.proteinId,suggestion.entityId)}>
                            {suggestion.proteinId} - {suggestion.entityId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
