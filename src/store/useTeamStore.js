import {create} from "zustand";
import axios from "axios";

export const useTeamStore = create((set) => ({
    teams: [],
    myTeamIds: [],

    fetchTeams: async () => {
        const res = await axios.get("/api/teams/");
        set({
            teams: res.data,
            myTeamIds: res.data
                .filter((t) => t.member_ids.includes(currentUserId)) // replace with actual user ID logic
                .map((t) => t.id),
        });
    },

    joinTeam: async (teamId) => {
        await axios.post(`/api/teams/${teamId}/join`);
        await get().fetchTeams();
    },
}));
