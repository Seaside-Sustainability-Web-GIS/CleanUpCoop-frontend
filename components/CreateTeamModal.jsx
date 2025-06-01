import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';
import {useEffect, useState, useRef} from 'react';
import { useAuthStore } from '../src/store/useAuthStore';
import { useTeamStore } from '../src/store/useTeamStore';
import useStore from '../src/store/useStore';

const apiEndpoint = 'http://localhost:8000/api';

function CreateTeamModal({ open, onClose }) {
    const sessionToken = useAuthStore((state) => state.sessionToken);
    const { fetchTeams } = useTeamStore();
    const setSelectTarget = useStore((s) => s.setSelectTarget);
    const setIsSelecting = useStore((s) => s.setIsSelecting);
    const showSnackbar = useStore((s) => s.showSnackbar);
    const setCreateTeamModalOpen = useStore((s) => s.setCreateTeamModalOpen);
    const selectedPoint = useStore((state) => state.selectedPoint);
    const locationMetadata = useStore((state) => state.locationMetadata);

    // Refs for uncontrolled inputs
    const nameRef = useRef();
    const descriptionRef = useRef();

    // Only keep location-related state (since it's updated programmatically)
    const [locationData, setLocationData] = useState({
        headquarters: {
            type: 'Point',
            coordinates: selectedPoint || ['', ''],
        },
        city: locationMetadata?.city || '',
        state: locationMetadata?.state || '',
        country: locationMetadata?.country || '',
    });

    const handleSelectTeamLocation = () => {
        setIsSelecting(true);
        showSnackbar('Click on the map to select the team headquarters.', 'info', { autoHideDuration: null });

        const selectTargetCallback = (lat, lng, locationInfo) => {
            // Update store with new location data
            useStore.getState().setSelectedPoint([lng, lat]);
            useStore.getState().setLocationMetadata(locationInfo);

            // Update local state to reflect the new location
            setLocationData({
                headquarters: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                city: locationInfo.city,
                state: locationInfo.state,
                country: locationInfo.country
            });

            setCreateTeamModalOpen(true);
        };

        setSelectTarget(selectTargetCallback);
    };

    const handleSubmit = async () => {
        // Build form data only when submitting
        const formData = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            city: locationData.city,
            state: locationData.state,
            country: locationData.country,
            headquarters: locationData.headquarters // Send full GeoJSON object
        };

        try {
            const response = await fetch(`${apiEndpoint}/teams/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Token': sessionToken
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submission failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            showSnackbar(result.message || 'Team created successfully!', 'success');
            await fetchTeams();
            onClose();
        } catch (err) {
            console.error('Team creation error:', err);
            alert(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        if (open) {
            setLocationData({
                headquarters: {
                    type: 'Point',
                    coordinates: selectedPoint || ['', ''],
                },
                city: locationMetadata?.city || '',
                state: locationMetadata?.state || '',
                country: locationMetadata?.country || '',
            });
        }
    }, [open, selectedPoint, locationMetadata]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create a Team</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={nameRef}
                    label="Team Name"
                    fullWidth
                    margin="dense"
                />
                <TextField
                    inputRef={descriptionRef}
                    label="Team Description"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                />
                <TextField
                    label="City"
                    fullWidth
                    margin="dense"
                    value={locationData.city || ''}
                    onChange={() => {}} // Prevent React warning for controlled input
                    disabled
                />
                <TextField
                    label="State"
                    fullWidth
                    margin="dense"
                    value={locationData.state || ''}
                    onChange={() => {}} // Prevent React warning for controlled input
                    disabled
                />
                <TextField
                    label="Country"
                    fullWidth
                    margin="dense"
                    value={locationData.country || ''}
                    onChange={() => {}} // Prevent React warning for controlled input
                    disabled
                />
                <TextField
                    label="Latitude"
                    fullWidth
                    margin="dense"
                    value={locationData?.headquarters?.coordinates?.[1] ?? ''}
                    onChange={() => {}} // Prevent React warning for controlled input
                    disabled
                />
                <TextField
                    label="Longitude"
                    fullWidth
                    margin="dense"
                    value={locationData?.headquarters?.coordinates?.[0] ?? ''}
                    onChange={() => {}} // Prevent React warning for controlled input
                    disabled
                />
                <Button
                    onClick={handleSelectTeamLocation}
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="outlined"
                >
                    Re-select Team Location
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Create Team
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateTeamModal;