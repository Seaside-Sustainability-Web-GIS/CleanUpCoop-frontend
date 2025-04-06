import { useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    LayersControl,
    useMap,
    Marker,
    useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../src/App.css';
import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import useStore from '../src/store/useStore';
import CollapsibleTable from './CollapsableTable.jsx';

const gpsLocationIcon = L.divIcon({
    className: 'gps-location-icon',
    iconSize: [16, 16],
    html: `<div class="gps-marker"></div>`,
});

function ClickCapture() {
  const isSelecting = useStore((state) => state.isSelecting);
  const setSelectedPoint = useStore((state) => state.setSelectedPoint);
  const setIsSelecting = useStore((state) => state.setIsSelecting);

  useMapEvents({
    click(e) {
      if (!isSelecting) return;

      const { lat, lng } = e.latlng;
      setSelectedPoint([lat, lng]);
      setIsSelecting(false);
      alert(`Location selected at [${lat.toFixed(5)}, ${lng.toFixed(5)}]`);
    },
  });

  return null;
}
function MapCursorManager() {
  const isSelecting = useStore((state) => state.isSelecting);

  useEffect(() => {
    const mapContainer = document.querySelector('.leaflet-container');

    if (!mapContainer) return;

    if (isSelecting) {
      mapContainer.style.cursor = 'crosshair';
    } else {
      mapContainer.style.cursor = '';
    }

    return () => {
      mapContainer.style.cursor = '';
    };
  }, [isSelecting]);

  return null;
}

function HomeButton() {
    const map = useMap();
    const defaultCenter = useStore((state) => state.defaultCenter);

    const handleHomeClick = () => {
        map.setView(defaultCenter, 11);
    };

    return (
        <IconButton
            onClick={handleHomeClick}
            sx={{
                position: 'absolute',
                top: 85,
                left: 9,
                zIndex: 1000,
                width: '36px',
                height: '36px',
                padding: '4px',
                backgroundColor: 'white',
                border: 'grey 1px solid',
                '&:hover': {
                    backgroundColor: '#f0f0f0',
                },
            }}
        >
            <HomeIcon />
        </IconButton>
    );
}

function GpsButton() {
    const map = useMap();
    const setUserLocation = useStore((state) => state.setUserLocation);

    const handleGpsClick = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 14);
                    setUserLocation([latitude, longitude]);
                },
                (error) => {
                    console.error('Error fetching GPS location:', error);
                    alert('Unable to retrieve your location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    return (
        <IconButton
            onClick={handleGpsClick}
            sx={{
                position: 'absolute',
                top: 130,
                left: 9,
                zIndex: 1000,
                width: '36px',
                height: '36px',
                padding: '4px',
                backgroundColor: 'white',
                border: 'grey 1px solid',
                '&:hover': {
                    backgroundColor: '#f0f0f0',
                },
            }}
        >
            <GpsFixedIcon />
        </IconButton>
    );
}

function MapUpdater() {
    const map = useMap();
    const mapCenter = useStore((state) => state.mapCenter);

    useEffect(() => {
        if (mapCenter) {
            map.setView(mapCenter);
        }
    }, [mapCenter]);

    return null;
}

function MapView() {
    const { BaseLayer } = LayersControl;
    const mapCenter = useStore((state) => state.mapCenter);
    const userLocation = useStore((state) => state.userLocation);
    const isDataLoaded = useStore((state) => state.isDataLoaded);


    useEffect(() => {
          }, [userLocation]);

    return (
        <Box sx={{ flex: 1, position: 'relative' }}>
            <MapContainer
                center={mapCenter}
                zoom={3}
                style={{ height: '100%', width: '100%' }}
            >
                 <MapCursorManager />
                <HomeButton />
                <GpsButton />
                <MapUpdater />
                {userLocation && (
                    <Marker key={userLocation.toString()} position={userLocation} icon={gpsLocationIcon} />
                )}
                <ClickCapture onLocationSelected={(coords) => console.log('User clicked:', coords)} />
                {/* Layers Control */}
                <LayersControl
                    style={{
                        top: '20px',
                        position: 'absolute',
                        zIndex: 1001,
                    }}
                >
                    {/* Base Layers */}
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                    </BaseLayer>
                    <BaseLayer name="OpenTopoMap">
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenTopoMap contributors"
                        />
                    </BaseLayer>
                    <BaseLayer name="ESRI World Imagery">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution="&copy; ESRI"
                        />
                    </BaseLayer>
                </LayersControl>
            </MapContainer>
            {/* Render CollapsibleTable only if data is loaded */}
            {isDataLoaded && <CollapsibleTable />}
        </Box>
    );
}

export default MapView;
