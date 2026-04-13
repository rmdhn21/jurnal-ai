// ===== HSE GEO-MAPPER PRO ENGINE (AVENZA STYLE) =====

let mapperMap = null;
let mapperUserMarker = null;
let mapperTrackPolyline = null;
let mapperGuidanceLine = null;
let mapperPathCoordinates = [];
let mapperWaypoints = [];
let mapperWatchId = null;
let mapperIsRecording = false;
let mapperTotalDistance = 0;
let mapperStartTime = null;
let mapperTimerInterval = null;
let mapperTargetWaypoint = null;
let mapperAutoSaveInterval = null;

const LAYERS = {
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }),
    google_earth: L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google'
    }),
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OSM contributors'
    })
};

let currentLayerKey = 'satellite';

/**
 * Initialize the Geo-Mapper PRO
 */
async function initHSEGeoMapper() {
    if (mapperMap) return;

    const mapElement = document.getElementById('hse-geomapper-map');
    if (!mapElement) return;

    // Start at a default view (Sangatta if possible, or Indonesia)
    mapperMap = L.map('hse-geomapper-map', { zoomControl: false }).setView([-6.1754, 106.8272], 5);
    LAYERS[currentLayerKey].addTo(mapperMap);

    // Coordinate HUD Listener
    mapperMap.on('move', updateCoordinateHUD);

    // Initial load
    loadSavedWaypoints();

    // Fix for "Black Screen"
    setTimeout(() => {
        if (mapperMap) mapperMap.invalidateSize();
    }, 500);

    // Start GPS Tracking
    startGPSTracking();
}

/**
 * Force Refresh Map Size
 */
function refreshHSEGeoMapper() {
    if (!mapperMap) {
        initHSEGeoMapper();
        return;
    }
    setTimeout(() => {
        mapperMap.invalidateSize();
    }, 300);
}

/**
 * Custom Zoom Logic
 */
function mapperZoomIn() {
    if (mapperMap) mapperMap.zoomIn();
}

function mapperZoomOut() {
    if (mapperMap) mapperMap.zoomOut();
}

/**
 * Start/Stop GPS Monitoring
 */
function startGPSTracking() {
    if (!navigator.geolocation) {
        alert("GPS tidak didukung di perangkat ini.");
        return;
    }

    if (mapperWatchId) navigator.geolocation.clearWatch(mapperWatchId);

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    const hudAccuracy = document.getElementById('hud-accuracy');
    if (hudAccuracy) hudAccuracy.innerText = "📡 ...";

    mapperWatchId = navigator.geolocation.watchPosition(
        (pos) => updateMapperPosition(pos.coords),
        (err) => handleGPSError(err),
        options
    );
}

function handleGPSError(err) {
    console.warn("GPS Error:", err);
    let msg = "GPS Error";
    
    switch(err.code) {
        case 1: msg = "Izin Lokasi Ditolak."; break;
        case 2: msg = "Posisi Tidak Tersedia."; break;
        case 3: msg = "Waktu Habis."; break;
    }

    const hudAccuracy = document.getElementById('hud-accuracy');
    if (hudAccuracy) hudAccuracy.innerHTML = `<span style="color:#ef4444; font-size: 10px;">${msg}</span>`;
}

/**
 * Update UI and Map with new GPS data
 */
function updateMapperPosition(coords) {
    if (!mapperMap) return;
    const { latitude, longitude, accuracy } = coords;
    const latlng = [latitude, longitude];

    // Update HUD Accuracy
    const hudAccuracy = document.getElementById('hud-accuracy');
    if (hudAccuracy) hudAccuracy.innerHTML = `${Math.round(accuracy)}<span>m</span>`;

    // Ensure HUD is visible if navigation is active
    const hud = document.getElementById('geomapper-nav-hud');
    if (hud && mapperTargetWaypoint) hud.classList.remove('hidden');

    // Update User Marker
    if (!mapperUserMarker) {
        const userIcon = L.divIcon({
            className: 'mapper-user-icon',
            html: `
                <div class="user-pulse" style="
                    background: rgba(0, 242, 255, 0.4); 
                    width: 30px; height: 30px; 
                    border-radius: 50%; 
                    position: absolute; 
                    top: -8px; left: -8px;
                    animation: pulse-ring 2s infinite;
                "></div>
                <div style="background: #00f2ff; width: 14px; height: 14px; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); position: relative;"></div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
        mapperUserMarker = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 }).addTo(mapperMap);
        mapperMap.setView(latlng, 17);
    } else {
        mapperUserMarker.setLatLng(latlng);
    }

    // Recording Logic
    if (mapperIsRecording) {
        if (mapperPathCoordinates.length > 0) {
            const last = mapperPathCoordinates[mapperPathCoordinates.length - 1];
            const dist = calculateDistance(last[0], last[1], latitude, longitude);
            
            if (dist > 0.003) { // 3m Threshold
                mapperTotalDistance += dist;
                mapperPathCoordinates.push(latlng);
                updateMappingUI();
            }
        } else {
            mapperPathCoordinates.push(latlng);
            L.circleMarker(latlng, { radius: 6, color: '#22c55e', fillOpacity: 1, weight: 3 }).addTo(mapperMap);
        }

        if (!mapperTrackPolyline) {
            mapperTrackPolyline = L.polyline(mapperPathCoordinates, { 
                color: '#00f2ff', 
                weight: 6, 
                opacity: 0.9,
                lineJoin: 'round'
            }).addTo(mapperMap);
        } else {
            mapperTrackPolyline.setLatLngs(mapperPathCoordinates);
        }
    }

    // Navigation Guidance
    if (mapperTargetWaypoint) {
        updateNavigationHUD(latitude, longitude);
    }
}

/**
 * Update Coordinate HUD
 */
function updateCoordinateHUD() {
    if (!mapperMap) return;
    const center = mapperMap.getCenter();
    const hud = document.getElementById('mapper-coord-hud');
    if (hud) hud.innerText = `${center.lat.toFixed(6)}°, ${center.lng.toFixed(6)}°`;
}

/**
 * Search Location (Nominatim API)
 */
async function searchLocation() {
    const input = document.getElementById('mapper-search-input');
    const query = input.value.trim();
    if (!query) return;

    const btn = input.nextElementSibling;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        // Bias towards Sangatta/East Kalimantan if possible
        const bbox = '117.155,-0.02,117.8,0.7'; // Crude box for Sangatta region
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${bbox}&bounded=0`);
        const data = await response.json();

        if (data.length > 0) {
            const res = data[0];
            const latlng = [parseFloat(res.lat), parseFloat(res.lon)];
            mapperMap.setView(latlng, 16);
            
            // Add temp search marker
            const searchMarker = L.marker(latlng).addTo(mapperMap)
                .bindPopup(res.display_name).openPopup();
            
            setTimeout(() => mapperMap.removeLayer(searchMarker), 10000);
        } else {
            alert("Lokasi tidak ditemukan.");
        }
    } catch (e) {
        alert("Gagal melakukan pencarian. Periksa koneksi internet.");
    } finally {
        btn.innerHTML = '<i class="fas fa-search"></i>';
    }
}

/**
 * Navigation HUD
 */
function updateNavigationHUD(lat, lng) {
    const target = mapperTargetWaypoint.getLatLng();
    const dist = calculateDistance(lat, lng, target.lat, target.lng);
    const bearing = calculateBearing(lat, lng, target.lat, target.lng);

    const distEl = document.getElementById('hud-dist-target');
    const bearingEl = document.getElementById('hud-bearing');
    const nameEl = document.getElementById('hud-target-name');

    if (distEl) {
        if (dist >= 1) distEl.innerHTML = `${dist.toFixed(2)}<span>km</span>`;
        else distEl.innerHTML = `${Math.round(dist * 1000)}<span>m</span>`;
    }
    
    if (bearingEl) bearingEl.innerHTML = `${Math.round(bearing)}<span>°</span>`;
    if (nameEl) nameEl.innerText = mapperTargetWaypoint.options.title || "Target";

    if (mapperMap && mapperGuidanceLine) mapperMap.removeLayer(mapperGuidanceLine);
    mapperGuidanceLine = L.polyline([[lat, lng], [target.lat, target.lng]], {
        color: '#ef4444',
        weight: 2,
        dashArray: '5, 10'
    }).addTo(mapperMap);
}

/**
 * Start/Stop Recording
 */
function toggleMappingRecord() {
    const btn = document.getElementById('btn-map-record');
    const txt = document.getElementById('txt-map-record');
    const icon = btn.querySelector('i');

    if (!mapperIsRecording) {
        mapperIsRecording = true;
        mapperTotalDistance = 0;
        mapperStartTime = Date.now();
        mapperPathCoordinates = [];
        
        btn.classList.add('active');
        txt.innerText = "Selesai (Save)";
        icon.className = "fas fa-stop";

        mapperAutoSaveInterval = setInterval(saveCurrentTrackToLocal, 60000);

        mapperTimerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - mapperStartTime) / 1000);
            const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const s = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('snap-time').innerText = `Waktu: ${m}:${s}`;
        }, 1000);

    } else {
        stopMappingRecord();
    }
}

async function stopMappingRecord() {
    clearInterval(mapperTimerInterval);
    clearInterval(mapperAutoSaveInterval);
    mapperIsRecording = false;

    // Save to History
    const durationSec = Math.floor((Date.now() - mapperStartTime) / 1000);
    const m = Math.floor(durationSec / 60).toString().padStart(2, '0');
    const s = (durationSec % 60).toString().padStart(2, '0');

    const routeData = {
        path: mapperPathCoordinates,
        distance: mapperTotalDistance,
        duration: `${m}:${s}`,
        timestamp: new Date().toISOString()
    };
    
    if (typeof saveHSERoute === 'function') {
        await saveHSERoute(routeData);
    }

    // Show Report Mode
    const container = document.querySelector('.hse-mapper-container');
    container.classList.add('snapshot-mode');
    
    document.getElementById('snap-dist').innerText = `Jarak: ${mapperTotalDistance.toFixed(2)} km`;
    
    if (typeof logHSEReport === 'function') logHSEReport('field_survey');

    alert(`Sesi Selesai!\nJarak: ${mapperTotalDistance.toFixed(2)} km\n\nRute telah disimpan ke History.`);
    
    setTimeout(() => {
        container.classList.remove('snapshot-mode');
        resetMappingUI();
    }, 15000);
}

/**
 * Export to KML
 */
function exportPathToKML() {
    if (mapperPathCoordinates.length < 2) {
        alert("Tidak ada jalur rute untuk di-export.");
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `HSE_Route_${timestamp}.kml`;

    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>HSE Field Route</name>
    <Style id="cyanLine">
      <LineStyle><color>fff2ff00</color><width>6</width></LineStyle>
    </Style>
    <Placemark>
      <name>Track Path</name>
      <styleUrl>#cyanLine</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
${mapperPathCoordinates.map(p => `${p[1]},${p[0]},0`).join(' ')}
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * History UI
 */
async function toggleMapperHistory() {
    const overlay = document.getElementById('mapper-history-overlay');
    overlay.classList.toggle('hidden');
    if (!overlay.classList.contains('hidden')) {
        await renderMapperHistory();
    }
}

async function renderMapperHistory() {
    const list = document.getElementById('mapper-history-list');
    list.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">Memuat riwayat...</div>';

    const routes = await getHSERoutes();
    if (routes.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">Belum ada riwayat rute.</div>';
        return;
    }

    list.innerHTML = routes.map(r => `
        <div class="history-item" onclick="viewRouteOnMap('${r.id}')">
            <div class="history-info">
                <div class="history-name">${new Date(r.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                <div class="history-meta">${r.distance.toFixed(2)} km | ${r.duration} menit</div>
            </div>
            <button onclick="event.stopPropagation(); deleteHistoryRoute('${r.id}')" style="background:transparent; border:none; color:#ef4444; padding:5px;"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}

async function viewRouteOnMap(id) {
    const routes = await getHSERoutes();
    const route = routes.find(r => r.id === id);
    if (!route) return;

    resetMappingUI();
    const poly = L.polyline(route.path, { color: '#00f2ff', weight: 6, opacity: 0.9 }).addTo(mapperMap);
    mapperMap.fitBounds(poly.getBounds());
    toggleMapperHistory();
    alert(`Melihat rute: ${route.distance.toFixed(2)} km`);
}

async function deleteHistoryRoute(id) {
    if (confirm("Hapus riwayat rute ini?")) {
        await deleteHSERoute(id);
        renderMapperHistory();
    }
}

/**
 * Waypoints
 */
let tempWaypointLatLng = null;

function requestWaypointMark() {
    if (!mapperUserMarker) {
        alert("Harap tunggu sinyal GPS...");
        return;
    }
    tempWaypointLatLng = mapperUserMarker.getLatLng();
    const modal = document.getElementById('waypoint-modal');
    const input = document.getElementById('waypoint-name-input');
    input.value = "";
    modal.classList.remove('hidden');
    input.focus();
}

function confirmWaypointMark() {
    const name = document.getElementById('waypoint-name-input').value.trim() || `Point ${mapperWaypoints.length + 1}`;
    addWaypointMarker(tempWaypointLatLng.lat, tempWaypointLatLng.lng, name);
    saveWaypoints();
    closeWaypointModal();
}

function addWaypointMarker(lat, lng, name) {
    const marker = L.marker([lat, lng], { title: name }).addTo(mapperMap);
    marker.bindTooltip(name, { permanent: true, direction: 'bottom', className: 'waypoint-tooltip' }).openTooltip();
    marker.on('click', () => {
        if (confirm(`Mulai navigasi ke ${name}?`)) {
            mapperTargetWaypoint = marker;
            document.getElementById('geomapper-nav-hud').classList.remove('hidden');
        } else {
            mapperTargetWaypoint = null;
            document.getElementById('geomapper-nav-hud').classList.add('hidden');
            if (mapperMap && mapperGuidanceLine) mapperMap.removeLayer(mapperGuidanceLine);
        }
    });
    mapperWaypoints.push({ lat, lng, name, marker });
}

function saveWaypoints() {
    const simplified = mapperWaypoints.map(w => ({ lat: w.lat, lng: w.lng, name: w.name }));
    localStorage.setItem('hse_waypoints', JSON.stringify(simplified));
}

function loadSavedWaypoints() {
    try {
        const saved = JSON.parse(localStorage.getItem('hse_waypoints') || '[]');
        saved.forEach(w => addWaypointMarker(w.lat, w.lng, w.name));
    } catch (e) {}
}

function saveCurrentTrackToLocal() {
    const trackData = { path: mapperPathCoordinates, distance: mapperTotalDistance, timestamp: new Date().toISOString() };
    localStorage.setItem('hse_current_tracking_backup', JSON.stringify(trackData));
}

/**
 * Tools
 */
function toggleSatelliteView() {
    if (!mapperMap) return;
    mapperMap.removeLayer(LAYERS[currentLayerKey]);
    const keys = Object.keys(LAYERS);
    let idx = keys.indexOf(currentLayerKey);
    currentLayerKey = keys[(idx + 1) % keys.length];
    LAYERS[currentLayerKey].addTo(mapperMap);
    
    const labelMapping = { satellite: 'Esri Satellite', google_earth: 'Google Earth', street: 'Street View' };
    document.getElementById('txt-map-layer').innerText = labelMapping[currentLayerKey];
}

function centerMapOnUser() {
    if (mapperUserMarker) mapperMap.setView(mapperUserMarker.getLatLng(), 17);
}

function closeWaypointModal() { document.getElementById('waypoint-modal').classList.add('hidden'); }

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180; const φ2 = lat2 * Math.PI / 180; const Δλ = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2); const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function updateMappingUI() { document.getElementById('snap-dist').innerText = `Jarak: ${mapperTotalDistance.toFixed(2)} km`; }

function resetMappingUI() {
    if (mapperMap && mapperTrackPolyline) mapperMap.removeLayer(mapperTrackPolyline);
    if (mapperMap && mapperGuidanceLine) mapperMap.removeLayer(mapperGuidanceLine);
    mapperTrackPolyline = null;
    mapperPathCoordinates = [];
}

// Global exposure
window.initHSEGeoMapper = initHSEGeoMapper;
window.refreshHSEGeoMapper = refreshHSEGeoMapper;
window.mapperZoomIn = mapperZoomIn;
window.mapperZoomOut = mapperZoomOut;
window.searchLocation = searchLocation;
window.toggleMappingRecord = toggleMappingRecord;
window.requestWaypointMark = requestWaypointMark;
window.confirmWaypointMark = confirmWaypointMark;
window.closeWaypointModal = closeWaypointModal;
window.toggleSatelliteView = toggleSatelliteView;
window.centerMapOnUser = centerMapOnUser;
window.toggleMapperHistory = toggleMapperHistory;
window.exportPathToKML = exportPathToKML;
window.viewRouteOnMap = viewRouteOnMap;
window.deleteHistoryRoute = deleteHistoryRoute;
