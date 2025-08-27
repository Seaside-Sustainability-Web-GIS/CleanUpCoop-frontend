import { useEffect } from 'react';
import useMapStore from "../../src/store/useMapStore.js";

function MapCursorManager() {
    const isSelecting = useMapStore((state) => state.isSelecting);

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
