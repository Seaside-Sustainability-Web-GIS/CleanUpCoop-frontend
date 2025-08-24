import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem} from '@mui/material';
import {useState, useEffect} from 'react';
import {useAuthStore} from '../src/store/useAuthStore';
import useUIStore from '../src/store/useUIStore.js';
import useMapStore from '../src/store/useMapStore.js';
import useAdoptedAreasStore from '../src/store/useAdoptedAreasStore.js';


function AdoptAreaFormModal({open, onClose, selectedPoint}) {
    const [formData, setFormData] = useState({
        "area_name": "",
        "adoptee_name": "",
        "adoption_type": "indefinite",
        "end_date": "",
        "email": "",
        "city": "",
        "state": "",
        "country": "",
        "note": "",
        "location": {
            "type": "Point",
            "coordinates": ["", ""]
        }
    });

    const locationMetadata = useMapStore((state) => state.locationMetadata);
    const { createAdoptedArea } = useAdoptedAreasStore();
    const showSnackbar = useUIStore((state) => state.showSnackbar);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        console.log(selectedPoint)
        if (selectedPoint && locationMetadata && user) {
            setFormData((prev) => ({
                ...prev,
                email: user.email,
                city: locationMetadata.city || "",
                state: locationMetadata.state || "",
                country: locationMetadata.country || "",
                location: {
                    ...prev.location,
                    coordinates: [
                        parseFloat(selectedPoint[0].toFixed(6)),
                        parseFloat(selectedPoint[1].toFixed(6)),
                    ],
                },
            }));
        }
    }, [selectedPoint, locationMetadata, user]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'adoption_type' && value === 'indefinite'
                ? {end_date: ''}
                : {})
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
                },
                end_date: formData.adoption_type === 'indefinite' ? null : formData.end_date,
            };

            const result = await createAdoptedArea(payload);
            
            if (result.success) {
                showSnackbar('Area adopted successfully!', 'success');
                onClose();
            } else {
                showSnackbar(`Error: ${result.error}`, 'error');
            }
        } catch (err) {
            console.error('Adoption error:', err);
            showSnackbar(`Error: ${err.message}`, 'error');
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
                    select
                    name="adoption_type"
                    label="Adoption Type"
                    fullWidth
                    margin="dense"
                    value={formData.adoption_type}
                    onChange={handleChange}
                >
                    <MenuItem value="indefinite">Indefinite</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                </TextField>

                {formData.adoption_type === 'temporary' && (
                    <TextField
                        name="end_date"
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={formData.end_date}
                        onChange={handleChange}
                        sx={{
                            '& input': {
                                padding: '16.5px 14px',
                            },
                            '& label': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                            },
                        }}
                    />
                )}

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
                    value={formData?.city || ''}
                    disabled
                />
                <TextField
                    label="State"
                    fullWidth
                    margin="dense"
                    value={formData?.state || ''}
                    disabled
                />
                <TextField
                    label="Country"
                    fullWidth
                    margin="dense"
                    value={formData?.country || ''}
                    disabled
                />
                <TextField
                    name="lat"
                    label="Latitude"
                    fullWidth
                    margin="dense"
                    value={formData.location.coordinates[1] ?? ""}
                    disabled
                />
                <TextField
                    name="lng"
                    label="Longitude"
                    fullWidth
                    margin="dense"
                    value={formData.location.coordinates[0] ?? ""}
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
