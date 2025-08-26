import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useEffect, useState} from 'react';
import {useTeamStore} from '../src/store/useTeamStore';
import {useAuthStore} from '../src/store/useAuthStore';
import TeamCard from './TeamCard';
import CreateTeamModal from './CreateTeamModal';
import useMapStore from "../src/store/useMapStore.js";
import useUIStore from "../src/store/useUIStore.js";
import PropTypes from "prop-types";


const TeamsDashboardModal = ({open, onClose}) => {
    const {teams, fetchTeams, joinTeam, leaveTeam, myTeamIds} = useTeamStore();
    const [searchText, setSearchText] = useState('');
    const {isAuthenticated, setAuthOpen} = useAuthStore();
    const setIsSelecting = useMapStore((state) => state.setIsSelecting);
    const showSnackbar = useUIStore((state) => state.showSnackbar);
    const setSelectTarget = useMapStore((state) => state.setSelectTarget);
    const setCreateTeamModalOpen = useTeamStore((s) => s.setCreateTeamModalOpen);
    const createTeamModalOpen = useTeamStore((s) => s.createTeamModalOpen); // Get the actual state

    // Fetch teams when the modal is opened
    useEffect(() => {
        if (open) {
            fetchTeams().catch((err) => {
                console.error('Error fetching teams:', err);
            });
        }
    }, [open]);

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const myTeams = filteredTeams.filter((t) => myTeamIds.includes(t.id));
    const nearbyTeams = filteredTeams.filter((t) => !myTeamIds.includes(t.id));
    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
                <DialogTitle>Explore Teams</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{mb: 3}}>
                        <TextField
                            fullWidth
                            label="Search for teams by name or location..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Box>

                    {isAuthenticated ? (
                        <>
                            <Typography variant="h6" sx={{mb: 1}}>My Teams</Typography>
                            <Grid container spacing={2} sx={{mb: 4}}>
                                {myTeams.length > 0 ? myTeams.map((team) => (
                                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={team.id}>
                                        <TeamCard team={team} joined onLeave={() => leaveTeam(team.id)}/>
                                    </Grid>
                                )) : (
                                    <Typography variant="body2" sx={{ml: 2}}>
                                        You haven&#39;t joined any teams yet.
                                    </Typography>
                                )}
                            </Grid>
                        </>
                    ) : (
                        <Typography variant="body2" sx={{ml: 2, mb: 4}}>
                            Log in to see your teams.
                        </Typography>
                    )}

                    <Typography variant="h6" sx={{mb: 1}}>Teams in Your Area</Typography>
                    <Grid container spacing={2} sx={{mb: 4}}>
                        {nearbyTeams.map((team) => (
                            <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={team.id}>
                                <TeamCard team={team} onJoin={() => joinTeam(team.id)}/>
                            </Grid>
                        ))}
                    </Grid>

                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isAuthenticated}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    setAuthOpen(true);
                                    return;
                                }

                                setIsSelecting(true);
                                showSnackbar('Click on the map to select the team headquarters.', 'info', {autoHideDuration: null});

                                // Set callback for selecting location
                                const selectTargetCallback = (lat, lng, locationInfo) => {
                                    useMapStore.getState().setSelectedPoint([lng, lat]);
                                    useMapStore.getState().setLocationMetadata(locationInfo);
                                    setCreateTeamModalOpen(true);
                                };

                                setSelectTarget(selectTargetCallback);
                                onClose(); // Close the current modal
                            }}
                        >
                            Create a Team
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* CreateTeamModal using store state */}
            <CreateTeamModal
                open={createTeamModalOpen}
                onClose={() => setCreateTeamModalOpen(false)}
            />
        </>
    );
};

TeamsDashboardModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TeamsDashboardModal;