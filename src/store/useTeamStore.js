import {create} from 'zustand';
import {useAuthStore} from './useAuthStore';
import apiClient from '../lib/apiClient.js';

export const useTeamStore = create((set, get) => ({
    teams: [],
    myTeamIds: [],

    fetchTeams: async () => {
        try {
            const res = await apiClient.get('/teams', {
                headers: {
                    'Accept': 'application/json',
                },
            });
            const teamList = await res.data

            console.log("Teams API response:", teamList); // confirm it's an array
            const currentUser = useAuthStore.getState().user;

            const myIds = currentUser
                ? teamList
                    .filter(t => Array.isArray(t.member_ids) && t.member_ids.includes(currentUser.id))
                    .map(t => t.id)
                : [];

            set({
                teams: Array.isArray(teamList) ? teamList : [],
                myTeamIds: myIds,
            });
        } catch (err) {
            console.error('Failed to fetch teams:', err);
        }
    },

    joinTeam: async (teamId) => {
        try {
            await apiClient.post(`/teams/${teamId}/join`);
            await get().fetchTeams();
        } catch (err) {
            console.error("Failed to join team:", err);
        }
    },

    leaveTeam: async (teamId) => {
        try {
            await apiClient.post(`/teams/${teamId}/leave`);
            await get().fetchTeams();
        } catch (err) {
            console.error("Failed to leave team:", err);
        }
    }
}));
