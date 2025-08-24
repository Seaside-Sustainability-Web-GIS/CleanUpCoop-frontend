import { create } from 'zustand';
import apiClient from '../lib/apiClient.js';

const useAdoptedAreasStore = create((set, get) => ({
    // State
    adoptedAreas: [],
    isLoadingAdoptedAreas: false,
    
    // Actions
    setAdoptedAreas: (areas) => set({ adoptedAreas: areas }),
    
    // API Methods
    fetchAdoptedAreas: async () => {
        set({ isLoadingAdoptedAreas: true });
        try {
            const response = await apiClient.get('/adopted-area-layer/');
            set({ adoptedAreas: response.data });
        } catch (err) {
            console.error("Failed to fetch adopted areas:", err);
        } finally {
            set({ isLoadingAdoptedAreas: false });
        }
    },
    
    createAdoptedArea: async (areaData) => {
        try {
            const response = await apiClient.post('/adopt-area/', areaData);
            // Refresh the list after creating
            await get().fetchAdoptedAreas();
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating adopted area:', error);
            return { success: false, error: error.response?.data || error.message };
        }
    },
    
    updateAdoptedArea: async (areaId, updatedData) => {
        try {
            const response = await apiClient.put(`/adopt-area/${areaId}/`, updatedData);
            // Refresh the list after updating
            await get().fetchAdoptedAreas();
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error updating adopted area:', error);
            return { success: false, error: error.response?.data || error.message };
        }
    },
    
    deleteAdoptedArea: async (areaId) => {
        try {
            await apiClient.delete(`/adopt-area/${areaId}/`);
            // Refresh the list after deleting
            await get().fetchAdoptedAreas();
            return { success: true };
        } catch (error) {
            console.error('Error deleting adopted area:', error);
            return { success: false, error: error.response?.data || error.message };
        }
    },
}));

export default useAdoptedAreasStore;