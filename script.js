document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = L.markerClusterGroup();
    map.addLayer(markers);

    async function fetchFlightData() {
        try {
            const response = await axios.get('https://opensky-network.org/api/states/all');
            const flights = response.data.states;

            markers.clearLayers(); // Clear existing markers before adding new ones

            flights.forEach(flight => {
                // Check if the flight is within India
                if (flight[5] >= 68.7 && flight[5] <= 97.25 && flight[6] >= 8.4 && flight[6] <= 37.6) {
                    const marker = L.marker([flight[6], flight[5]]);
                    marker.bindPopup(`
                        <b>Flight:</b> ${flight[1]}<br>
                        <b>From:</b> ${flight[2]}<br>
                        <b>To:</b> ${flight[3]}<br>
                        <b>Altitude:</b> ${flight[13]} m<br>
                        <b>Speed:</b> ${flight[9]} m/s
                    `);
                    markers.addLayer(marker);
                }
            });
        } catch (error) {
            console.error('Error fetching flight data:', error);
        }
    }

    fetchFlightData();
    setInterval(fetchFlightData, 60000); // Update flight data every minute
});
