// Refactored MapView.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../src/App.css';
import { Box, Button } from '@mui/material';
import { useAuthStore } from "../src/store/useAuthStore.js";
import useMapStore from '../src/store/useMapStore.js';
import useAdoptedAreasStore from '../src/store/useAdoptedAreasStore.js';
import { useTeamStore } from '../src/store/useTeamStore.js';
import CollapsibleTable from './CollapsableTable.jsx';
import MapCursorManager from './map/MapCursorManager.jsx'
import ClickCapture from './map/ClickCapture.jsx';
import HomeButton from './map/HomeButton.jsx';
import GpsButton from './map/GpsButton.jsx';

const gpsLocationIcon = L.divIcon({
    className: 'gps-location-icon',
    iconSize: [16, 16],
    html: `<div class="gps-marker"></div>`,
});

function BoundsUpdater() {
    const map = useMap();
    const bounds = useMapStore(state => state.bounds);

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);

    return null;
}

function MapUpdater() {
    const map = useMap();
    const mapCenter = useMapStore((state) => state.mapCenter);

    useEffect(() => {
        if (mapCenter) {
            map.setView(mapCenter);
        }
    }, [mapCenter]);

    return null;
}

function MapView() {
    const { BaseLayer } = LayersControl;
    const mapCenter = useMapStore((state) => state.mapCenter);
    const userLocation = useMapStore((state) => state.userLocation);
    const isDataLoaded = useMapStore((state) => state.isDataLoaded);
    const { adoptedAreas, fetchAdoptedAreas, updateAdoptedArea, deleteAdoptedArea } = useAdoptedAreasStore();
    const showSnackbar = useUIStore((state) => state.showSnackbar);
    const user = useAuthStore((state) => state.user);
    const { teams, fetchTeams } = useTeamStore();


    const handleEdit = async (area, updatedAreaData) => {
        const result = await updateAdoptedArea(area.id, updatedAreaData);
        showSnackbar(result.success ? 'Area updated successfully' : 'Failed to update area', result.success ? 'success' : 'error');
    };

    const handleDelete = async (area) => {
        if (!window.confirm('Are you sure you want to delete this area?')) return;

        const result = await deleteAdoptedArea(area.id);
        showSnackbar(result.success ? 'Area deleted successfully' : 'Failed to delete area', result.success ? 'success' : 'error');
    };


    const teamIcon = L.divIcon({
        className: 'team-icon',
        iconSize: [16, 16],
        html: `<div class="team-marker"></div>`, // add your CSS for color
    });


    useEffect(() => {
        fetchAdoptedAreas();
        fetchTeams();
    }, []);

    return (
        <Box sx={{ flex: 1, position: 'relative' }}>
            <MapContainer center={mapCenter} zoom={3} style={{ height: '100vh', width: '100%' }}>
                <MapCursorManager />
                <ClickCapture />
                <HomeButton />
                <GpsButton />
                <MapUpdater />
                <BoundsUpdater />

                {userLocation && (
                    <Marker key={userLocation.toString()} position={userLocation} icon={gpsLocationIcon} />
                )}

                <LayersControl style={{ top: '20px', position: 'absolute', zIndex: 1001 }}>
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    </BaseLayer>
                    <BaseLayer name="OpenTopoMap">
                        <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="&copy; OpenTopoMap contributors" />
                    </BaseLayer>
                    <BaseLayer name="ESRI World Imagery">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; ESRI" />
                    </BaseLayer>
                </LayersControl>

                {adoptedAreas.map(area => {
                    const coords = area.location?.coordinates;
                    if (!Array.isArray(coords) || coords.length !== 2) return null;

                    const [lng, lat] = coords;
                    if (typeof lat !== 'number' || typeof lng !== 'number') return null;

                    return (
                        <Marker key={area.id} position={[lat, lng]}>
                            <Popup>
                                <div style={{ fontSize: '12px', lineHeight: '1.1' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{area.area_name}</div>
                                    <div>{area.adoptee_name}</div>
                                    <div>{area.city}, {area.state}, {area.country}</div>
                                    <div>{area.note}</div>
                                    {user?.email === area.email && (
                                        <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            <Button size="small" variant="outlined" onClick={() => console.log('create event')}>
                                                Create Event
                                            </Button>
                                            <Button size="small" variant="outlined" onClick={() => handleEdit(area)}>
                                                Edit Area
                                            </Button>
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(area)}>
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                {teams.map(team => {
                    const coords = team.headquarters?.coordinates;
                    if (!Array.isArray(coords) || coords.length !== 2) return null;

                    const [lng, lat] = coords;
                    if (typeof lat !== 'number' || typeof lng !== 'number') return null;

                    return (
                        <Marker key={`team-${team.id}`} position={[lat, lng]} icon={teamIcon}>
                            <Popup>
                                <div style={{ fontSize: '12px', lineHeight: '1.1' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{team.name}</div>
                                    <div>{team.description}</div>
                                    <div>Leaders: {team.leader_ids.length}</div>
                                    <div>Members: {team.member_ids.length}</div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

            </MapContainer>
            {isDataLoaded && <CollapsibleTable />}
        </Box>
    );
}

export default MapView;
