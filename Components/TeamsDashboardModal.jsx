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

const TeamsDashboardModal = ({open, onClose}) => {
    const {teams, fetchTeams, joinTeam, leaveTeam, myTeamIds} = useTeamStore();
    const [searchText, setSearchText] = useState('');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const {isAuthenticated, setAuthOpen} = useAuthStore();


    useEffect(() => {
        if (open) fetchTeams();
    }, [open]);

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const myTeams = filteredTeams.filter((t) => myTeamIds.includes(t.id));
    const nearbyTeams = filteredTeams.filter((t) => !myTeamIds.includes(t.id));

    return (
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
                                <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
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
                        <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
                            <TeamCard team={team} onJoin={() => joinTeam(team.id)}/>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isAuthenticated}
                        onClick={() => setCreateModalOpen(true)}
                    >
                        Create a Team
                    </Button>
                    <CreateTeamModal open={createModalOpen} onClose={() => setCreateModalOpen(false)}/>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TeamsDashboardModal;
