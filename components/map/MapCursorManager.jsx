import { useEffect } from 'react';
import useStore from '../../src/store/useStore';

function MapCursorManager() {
    const isSelecting = useStore((state) => state.isSelecting);

    useEffect(() => {
        const mapContainer = document.querySelector('.leaflet-container');
        if (!mapContainer) return;

        mapContainer.style.cursor = isSelecting ? 'crosshair' : '';

        return () => {
            if (mapContainer) {
                mapContainer.style.cursor = '';
            }
        };
    }, [isSelecting]);

    return null;
}

export default MapCursorManager;
