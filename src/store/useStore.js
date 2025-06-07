import {create} from 'zustand';

const apiEndpoint = 'http://localhost:8000/api';

const useStore = create((set) => ({
    adoptModalOpen: false,
    setAdoptModalOpen: (val) => set({ adoptModalOpen: val }),
    selectionMode: null,
    setSelectionMode: (mode) => set({ selectionMode: mode }),
    createTeamModalOpen: false,
    setCreateTeamModalOpen: (val) => set({ createTeamModalOpen: val }),
    selectTarget: null,
    setSelectTarget: (fn) => set({ selectTarget: fn }),
    defaultCenter: [0, 0],
    mapCenter: [0, 0],
    setMapCenter: (newCenter) => set({mapCenter: newCenter}),
    selectedPoint: null,
    setSelectedPoint: (coords) => set({selectedPoint: coords}),
    isSelecting: false,
    setIsSelecting: (val) => set({isSelecting: val}),
    locationMetadata: null,
    setLocationMetadata: (data) => set({locationMetadata: data}),
    bounds: null,
    setBounds: (bounds) => set({bounds}),

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

    adoptedAreas: [],
    setAdoptedAreas: (areas) => set({adoptedAreas: areas}),
    isLoadingAdoptedAreas: false,

    teams: [],
    setTeams: (teams) => set({ teams }),


    fetchAdoptedAreas: async () => {
        set({isLoadingAdoptedAreas: true});
        try {
            const res = await fetch(`${apiEndpoint}/adopted-area-layer/`);
            const data = await res.json();
            set({adoptedAreas: data});
        } catch (err) {
            console.error("Failed to fetch adopted areas:", err);
        } finally {
            set({isLoadingAdoptedAreas: false});
        }
    },

}));

export default useStore;
