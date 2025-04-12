import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';
import useStore from '../src/store/useStore';
import {useAuthStore} from '../src/store/useAuthStore';

const apiEndpoint = 'http://localhost:8000/api'

function AdoptAreaFormModal({open, onClose, selectedPoint}) {
    const [formData, setFormData] = useState({
        "area_name": "",
        "adoptee_name": "",
        "email": "",
        "city": "",
        "state": "",
        "country": "",
        "note": "",
        "lat": "",
        "lng": ""
    });

    const locationMetadata = useStore((state) => state.locationMetadata);
    const fetchAdoptedAreas = useStore((state) => state.fetchAdoptedAreas);
    const showSnackbar = useStore((state) => state.showSnackbar);
    const user = useAuthStore((state) => state.user);
    const sessionToken = useAuthStore((state) => state.sessionToken);

    useEffect(() => {
        if (selectedPoint && locationMetadata && user) {
            setFormData((prev) => ({
                ...prev,
                email: user.email,
                city: locationMetadata.city || "",
                state: locationMetadata.state || "",
                country: locationMetadata.country || "",
                lat: selectedPoint[1].toFixed(6),
                lng: selectedPoint[0].toFixed(6),
            }));
        }
    }, [selectedPoint, locationMetadata, user]);


    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${apiEndpoint}/adopt-area/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Token': sessionToken,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submission failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            showSnackbar(result.message || 'Area adopted successfully!', 'success');

            await fetchAdoptedAreas();
            onClose();
        } catch (err) {
            console.error('Adoption error:', err);
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adopt this Area</DialogTitle>
            <DialogContent>
                <TextField
                    name="area_name"
                    label="Area Name"
                    fullWidth
                    margin="dense"
                    value={formData.area_name}
                    onChange={handleChange}
                />

                <TextField
                    name="adoptee_name"
                    label="Adoptee Name"
                    fullWidth
                    margin="dense"
                    value={formData.adoptee_name}
                    onChange={handleChange}
                />

                <TextField
                    label="Email Address"
                    fullWidth
                    margin="dense"
                    value={user?.email || ''}
                    disabled
                />
                <TextField
                    label="City"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.city || ''}
                    disabled
                />
                <TextField
                    label="State"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.state || ''}
                    disabled
                />
                <TextField
                    label="Country"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.country || ''}
                    disabled
                />
                <TextField
                    name="lat"
                    label="Latitude"
                    fullWidth
                    margin="dense"
                    value={formData.lat}
                    disabled
                />
                <TextField
                    name="lng"
                    label="Longitude"
                    fullWidth
                    margin="dense"
                    value={formData.lng}
                    disabled
                />
                <TextField
                    name="note"
                    label="Notes"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                    value={formData.note}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="success">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdoptAreaFormModal;
