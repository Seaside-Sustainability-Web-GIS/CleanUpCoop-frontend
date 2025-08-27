import { create } from 'zustand';

const useUIStore = create((set) => ({
    // Modal states
    adoptModalOpen: false,
    setAdoptModalOpen: (val) => set({ adoptModalOpen: val }),

    aboutOpen: false,
    setAboutOpen: (val) => set({ aboutOpen: val }),
    
    // View states
    currentView: 'map',
    toggleView: () =>
        set((state) => ({
            currentView: state.currentView === 'map' ? 'dashboard' : 'map',
        })),
    
    // Table state
    isTableCollapsed: true,
    toggleTable: () => set((state) => ({ isTableCollapsed: !state.isTableCollapsed })),
    
    // Snackbar state
    snackbar: {
        open: false,
        message: '',
        severity: 'success',
    },
    showSnackbar: (message, severity = 'success') =>
        set({
            snackbar: { open: true, message, severity },
        }),
    hideSnackbar: () =>
        set((state) => ({
            snackbar: { ...state.snackbar, open: false },
        })),
}));

export default useUIStore;