// Helper function to get require() for audio files
// Since require() needs static paths, we create a mapping
export const getRequireForAudio = (category: string, filename: string): { require: number } | undefined => {
    try {
        // Map category and filename to require() calls
        // This is a workaround since require() doesn't support dynamic paths
        const audioMap: Record<string, Record<string, () => number>> = {
            '1': {
                '75': () => require('../../assets/audio/athkar/1/75.mp3'),
                '76': () => require('../../assets/audio/athkar/1/76.mp3'),
                '77': () => require('../../assets/audio/athkar/1/77.mp3'),
                '78': () => require('../../assets/audio/athkar/1/78.mp3'),
                '79': () => require('../../assets/audio/athkar/1/79.mp3'),
                '80': () => require('../../assets/audio/athkar/1/80.mp3'),
                '81': () => require('../../assets/audio/athkar/1/81.mp3'),
                '82': () => require('../../assets/audio/athkar/1/82.mp3'),
                '83': () => require('../../assets/audio/athkar/1/83.mp3'),
                '84': () => require('../../assets/audio/athkar/1/84.mp3'),
                '85': () => require('../../assets/audio/athkar/1/85.mp3'),
                '86': () => require('../../assets/audio/athkar/1/86.mp3'),
                '87': () => require('../../assets/audio/athkar/1/87.mp3'),
                '88': () => require('../../assets/audio/athkar/1/88.mp3'),
                '89': () => require('../../assets/audio/athkar/1/89.mp3'),
                '90': () => require('../../assets/audio/athkar/1/90.mp3'),
                '91': () => require('../../assets/audio/athkar/1/91.mp3'),
                '92': () => require('../../assets/audio/athkar/1/92.mp3'),
                '93': () => require('../../assets/audio/athkar/1/93.mp3'),
                '94': () => require('../../assets/audio/athkar/1/94.mp3'),
                '95': () => require('../../assets/audio/athkar/1/95.mp3'),
                '96': () => require('../../assets/audio/athkar/1/96.mp3'),
                '97': () => require('../../assets/audio/athkar/1/97.mp3'),
                '98': () => require('../../assets/audio/athkar/1/98.mp3'),
            },
            '2': {
                '99': () => require('../../assets/audio/athkar/2/99.mp3'),
                '100': () => require('../../assets/audio/athkar/2/100.mp3'),
                '101': () => require('../../assets/audio/athkar/2/101.mp3'),
                '102': () => require('../../assets/audio/athkar/2/102.mp3'),
                '103': () => require('../../assets/audio/athkar/2/103.mp3'),
                '104': () => require('../../assets/audio/athkar/2/104.mp3'),
                '105': () => require('../../assets/audio/athkar/2/105.mp3'),
                '106': () => require('../../assets/audio/athkar/2/106.mp3'),
                '107': () => require('../../assets/audio/athkar/2/107.mp3'),
                '108': () => require('../../assets/audio/athkar/2/108.mp3'),
                '109': () => require('../../assets/audio/athkar/2/109.mp3'),
                '110': () => require('../../assets/audio/athkar/2/110.mp3'),
                '111': () => require('../../assets/audio/athkar/2/111.mp3'),
            },
            '11': {
                '1': () => require('../../assets/audio/athkar/11/1.mp3'),
            },
        };
        
        const categoryMap = audioMap[category];
        if (categoryMap) {
            const fileRequire = categoryMap[filename];
            if (fileRequire) {
                return { require: fileRequire() };
            }
        }
        
        return undefined;
    } catch (error) {
        console.error('Error in getRequireForAudio:', error);
        return undefined;
    }
};

// Helper function to get audio source for Expo Audio
// For local assets, we need to use require() which returns a number (module ID)
// Since require() doesn't work with dynamic paths, we create a mapping function
export const getAudioSource = (
    audioPath?: string, 
    category?: string, 
    filename?: string
): { uri?: string; require?: number } | undefined => {
    if (!audioPath) return undefined;
    
    // If it's already a URL (http/https), return as URI
    if (audioPath.startsWith('http://') || audioPath.startsWith('https://')) {
        return { uri: audioPath };
    }
    
    // For local assets with @assets/ prefix, we need to use require()
    if (audioPath.startsWith('@assets/')) {
        // Extract category and filename from path like @assets/audio/athkar/1/75.mp3
        const pathMatch = audioPath.match(/@assets\/audio\/athkar\/(\d+)\/(\d+)\.mp3/);
        if (pathMatch) {
            const cat = pathMatch[1];
            const file = pathMatch[2];
            
            try {
                // Since require() doesn't work with variables, we use a mapping function
                return getRequireForAudio(cat, file);
            } catch (error) {
                console.error('Error loading audio asset:', error);
                return undefined;
            }
        }
    }
    
    // Fallback: use provided category and filename
    if (category && filename) {
        return getRequireForAudio(category, filename);
    }
    
    return { uri: audioPath };
};

