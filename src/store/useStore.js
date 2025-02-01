import { create } from 'zustand';

const useStore = create((set) => ({
    defaultCenter: [38.64, -90.3], // Default map center
    mapCenter: [38.64, -90.3], // Default map center
    setMapCenter: (newCenter) => set({ mapCenter: newCenter }),

   userLocation: null,
    setUserLocation: (location) => {
        console.log("Updating userLocation in Zustand:", location);
        set(() => ({ userLocation: location ? [...location] : null })); // Ensure a new array reference
    },

    isTableCollapsed: true,
    toggleTable: () => set((state) => ({ isTableCollapsed: !state.isTableCollapsed })),

    aboutOpen: false, // State for dialog
    openAbout: () => set({ aboutOpen: true }),
    closeAbout: () => set({ aboutOpen: false }),
}));

export default useStore;
