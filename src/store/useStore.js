import {create} from 'zustand';

const useStore = create((set) => ({
    defaultCenter: [0, 0],
    mapCenter: [0, 0],
    setMapCenter: (newCenter) => set({mapCenter: newCenter}),
    selectedPoint: null,
    setSelectedPoint: (coords) => set({selectedPoint: coords}),
    isSelecting: false,
    setIsSelecting: (val) => set({isSelecting: val}),

    userLocation: null,
    setUserLocation: (location) => {
        set(() => ({userLocation: location ? [...location] : null})); // Ensure a new array reference
    },

    currentView: 'map',
    toggleView: () =>
        set((state) => ({
            currentView: state.currentView === 'map' ? 'dashboard' : 'map',
        })),

    isTableCollapsed: true,
    toggleTable: () => set((state) => ({isTableCollapsed: !state.isTableCollapsed})),

    aboutOpen: false, // State for dialog


    isDataLoaded: false,

    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
    showSnackbar: (message, severity = 'success') =>
        set({
            snackbar: {open: true, message, severity},
        }),
    hideSnackbar: () =>
        set((state) => ({
            snackbar: {...state.snackbar, open: false},
        })),
}));

export default useStore;
