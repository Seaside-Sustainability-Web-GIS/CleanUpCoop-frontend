import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { useState } from 'react';
import { useTeamStore } from '../src/store/useTeamStore';

const CreateTeamModal = ({ open, onClose }) => {
    const { createTeam, fetchTeams } = useTeamStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        headquarters: {
            type: 'Point',
            coordinates: [-71.0596, 42.3601], // default to Boston
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCoordChange = (e) => {
        const { name, value } = e.target;
        const index = name === 'lng' ? 0 : 1;
        const coords = [...formData.headquarters.coordinates];
        coords[index] = parseFloat(value);
        setFormData((prev) => ({
            ...prev,
            headquarters: { ...prev.headquarters, coordinates: coords },
        }));
    };

    const handleSubmit = async () => {
        try {
            await createTeam(formData);
            await fetchTeams();
            onClose();
        } catch (err) {
            console.error('Team creation failed:', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Team Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={3}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Latitude"
                            name="lat"
                            value={formData.headquarters.coordinates[1]}
                            onChange={handleCoordChange}
                            fullWidth
                        />
                        <TextField
                            label="Longitude"
                            name="lng"
                            value={formData.headquarters.coordinates[0]}
                            onChange={handleCoordChange}
                            fullWidth
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Create Team
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTeamModal;
