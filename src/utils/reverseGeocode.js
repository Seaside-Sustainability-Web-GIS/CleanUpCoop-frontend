export async function reverseGeocode(lat, lng) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    const address = data.address || {};
    return {
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        country: address.country || ''
    };
}
