import { create } from 'zustand';

const useMapStore = create((set) => ({
    // Map positioning
    defaultCenter: [0, 0],
    mapCenter: [0, 0],
    setMapCenter: (newCenter) => set({ mapCenter: newCenter }),
    
    // Map selection
    selectedPoint: null,
    setSelectedPoint: (coords) => set({ selectedPoint: coords }),
    
    // Map interactions
    isSelecting: false,
    setIsSelecting: (val) => set({ isSelecting: val }),
    
    selectionMode: null,
    setSelectionMode: (mode) => set({ selectionMode: mode }),
    
    selectTarget: null,
    setSelectTarget: (fn) => set({ selectTarget: fn }),
    
    // Location metadata
    locationMetadata: null,
    setLocationMetadata: (data) => set({ locationMetadata: data }),
    
    // Map bounds
    bounds: null,
    setBounds: (bounds) => set({ bounds }),
    
    // User location
    userLocation: null,
    setUserLocation: (location) => {
        set(() => ({ userLocation: location ? [...location] : null })); // Ensure a new array reference
    },
}));

export default useMapStore;