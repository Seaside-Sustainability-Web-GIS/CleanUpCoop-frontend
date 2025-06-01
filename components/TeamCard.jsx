import {Card, CardContent, Typography, Button, Box} from '@mui/material';

const TeamCard = ({ team, joined = false, onJoin, onLeave }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
                <Typography fontWeight="bold">{team.name}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {team.description || 'No description available.'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Members: {Array.isArray(team.member_ids) ? team.member_ids.length : 0} |
                    Leaders: {Array.isArray(team.leader_ids) ? team.leader_ids.length : 0}
                </Typography>


                <Box sx={{ mt: 2 }}>
                    {joined ? (
                        <Button variant="outlined" color="secondary" onClick={onLeave}>
                            Leave Team
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={onJoin}>
                            Join Team
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default TeamCard;
