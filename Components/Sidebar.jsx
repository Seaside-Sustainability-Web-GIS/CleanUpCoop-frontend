import {useEffect, useState} from 'react';
import {
    Typography,
    Button,
    Paper,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    OutlinedInput, InputAdornment
} from '@mui/material';
import {ChevronLeft, ChevronRight, Clear, Room} from '@mui/icons-material';
import {useAuthStore} from "../src/store/useAuthStore.js";
import useStore from '../src/store/useStore';
import PropTypes from "prop-types";
import AdoptAreaFormModal from "./AdoptAreaFormModal.jsx";
import {Snackbar, Alert} from '@mui/material';


function Sidebar({setMapCenter}) {
    const {isAuthenticated, setAuthOpen} = useAuthStore();
    const [searchText, setSearchText] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const setIsSelecting = useStore((state) => state.setIsSelecting);
    const [adoptModalOpen, setAdoptModalOpen] = useState(false);
    const selectedPoint = useStore((state) => state.selectedPoint);
    const showSnackbar = useStore((state) => state.showSnackbar);
    const hideSnackbar = useStore((state) => state.hideSnackbar);

    const handleAdoptSubmit = async (formData) => {
        try {
            const response = await fetch('/api/adopt-area/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth header here if needed
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Submission failed');

            const result = await response.json();
            console.log('Success:', result);
            alert('Adoption submitted!');
        } catch (err) {
            console.error(err);
            alert('Error submitting adoption.');
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
    };

    const handleSearch = async () => {
        if (!searchText.trim()) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    searchText
                )}`
            );
            const results = await response.json();
            if (results.length > 0) {
                const {lat, lon} = results[0];
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert('Location not found.');
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    useEffect(() => {
        if (selectedPoint) {
            setAdoptModalOpen(true);
        }
    }, [selectedPoint]);

    return (
        <Box sx={{display: 'flex', height: '100%'}}>
            <Paper
                sx={{
                    width: isCollapsed ? '50px' : '300px',
                    transition: 'width 0.3s',
                    padding: isCollapsed ? 1 : 2,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <IconButton
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    sx={{alignSelf: 'flex-end', marginBottom: 2}}
                >
                    {isCollapsed ? <ChevronRight/> : <ChevronLeft/>}
                </IconButton>

                {!isCollapsed && (
                    <Box sx={{width: '100%'}}>
                        <Box>
                            <Typography variant="h6">Go to Location</Typography>
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch();
                                }}
                            >
                                <FormControl fullWidth size="small" sx={{marginBottom: 1}}>
                                    <InputLabel htmlFor="location-input">Type Location...</InputLabel>
                                    <OutlinedInput
                                        id="location-input"
                                        label="Type Location..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        endAdornment={
                                            searchText && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setSearchText('')}
                                                        edge="end"
                                                        aria-label="clear input"
                                                    >
                                                        <Clear fontSize="small"/>
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }
                                    />
                                </FormControl>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Go
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => setSearchText('')}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                                <Box sx={{marginTop: 2}}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        startIcon={<Room/>}
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                setAuthOpen(true);
                                                return;
                                            }
                                            setIsSelecting(true);
                                            showSnackbar('Click on the map to select the area you want to adopt.', 'info', { autoHideDuration: null });
                                        }}
                                        sx={{
                                            marginTop: 1,
                                            fontWeight: 'bold',
                                            paddingY: 1.2,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Adopt an Area
                                    </Button>
                                </Box>
                                <Typography variant="h6" sx={{mt: 2}}>Query Data</Typography>
                                <Box
                                    onSubmit={handleFormSubmit}
                                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                                >
                                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Submit
                                        </Button>
                                        <Button type="reset" variant="contained" color="secondary">
                                            Reset
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
                <AdoptAreaFormModal
                    open={adoptModalOpen}
                    onClose={() => setAdoptModalOpen(false)}
                    onSubmit={handleAdoptSubmit}
                    selectedPoint={selectedPoint}
                />
            </Paper>
        </Box>
    );
}

Sidebar.propTypes = {
    setMapCenter: PropTypes.func.isRequired,
    setAuthOpen: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};

export default Sidebar;
