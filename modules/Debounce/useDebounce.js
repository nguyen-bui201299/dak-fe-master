import { useState, useEffect } from 'react';

function useDebouce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const idTimeout = setTimeout(() => setDebounceValue(value), delay);

        return () => {
            clearTimeout(idTimeout);
        };
        
    }, [value,delay]);

    return debounceValue;
}

export default useDebouce;
