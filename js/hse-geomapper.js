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

    mapperMap = L.map('hse-geomapper-map', { zoomControl: false }).setView([-6.1754, 106.8272], 5);
    LAYERS[currentLayerKey].addTo(mapperMap);

    // Load saved waypoints
    loadSavedWaypoints();

    // Fix for "Black Screen" - Map needs to re-calculate its container size after the subscreen is visible
    setTimeout(() => {
        if (mapperMap) mapperMap.invalidateSize();
    }, 500);

    // Start GPS Tracking automatically when screen is opened
    startGPSTracking();
}

/**
 * Force Refresh Map Size (Called on every navigation)
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
 * Start/Stop GPS Monitoring (Watch)
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

    mapperWatchId = navigator.geolocation.watchPosition(
        (pos) => updateMapperPosition(pos.coords),
        (err) => console.log("GPS Error:", err),
        options
    );
}

/**
 * Update UI and Map with new GPS data
 */
function updateMapperPosition(coords) {
    if (!mapperMap) return;
    const { latitude, longitude, accuracy } = coords;
    const latlng = [latitude, longitude];

    // Update HUD
    const hudAccuracy = document.getElementById('hud-accuracy');
    if (hudAccuracy) hudAccuracy.innerHTML = `${Math.round(accuracy)}<span>m</span>`;

    // Ensure HUD is visible if navigation is active
    const hud = document.getElementById('geomapper-nav-hud');
    if (hud && mapperTargetWaypoint) hud.classList.remove('hidden');

    // Update User Marker
    if (!mapperUserMarker) {
        const userIcon = L.divIcon({
            className: 'mapper-user-icon',
            html: '<div style="background: #3b82f6; width: 14px; height: 14px; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
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
            
            if (dist > 0.003) { // Threshold 3 meters
                mapperTotalDistance += dist;
                mapperPathCoordinates.push(latlng);
                updateMappingUI();
            }
        } else {
            mapperPathCoordinates.push(latlng);
            // Drop Start Marker (Green Dot)
            L.circleMarker(latlng, { radius: 6, color: '#22c55e', fillOpacity: 1, weight: 3 }).addTo(mapperMap);
        }

        if (!mapperTrackPolyline) {
            mapperTrackPolyline = L.polyline(mapperPathCoordinates, { color: '#3b82f6', weight: 6, opacity: 0.9 }).addTo(mapperMap);
        } else {
            mapperTrackPolyline.setLatLngs(mapperPathCoordinates);
        }
    }

    // Navigation Guidance Logic (Avenza Style)
    if (mapperTargetWaypoint) {
        updateNavigationHUD(latitude, longitude);
    }
}

/**
 * Calculate Dist & Bearing for the HUD
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

    // Draw guidance line (As the crow flies)
    if (mapperMap && mapperGuidanceLine) mapperMap.removeLayer(mapperGuidanceLine);
    mapperGuidanceLine = L.polyline([[lat, lng], [target.lat, target.lng]], {
        color: '#ef4444',
        weight: 2,
        dashArray: '5, 10',
        className: 'guidance-line'
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

        // Auto Save Interval
        mapperAutoSaveInterval = setInterval(saveCurrentTrackToLocal, 60000);

        // Timer
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

function stopMappingRecord() {
    clearInterval(mapperTimerInterval);
    clearInterval(mapperAutoSaveInterval);
    mapperIsRecording = false;

    // Show Report Mode (Snapshot)
    const container = document.querySelector('.hse-mapper-container');
    container.classList.add('snapshot-mode');
    
    // Final stats to snapshot overlay
    document.getElementById('snap-dist').innerText = `Jarak: ${mapperTotalDistance.toFixed(2)} km`;
    
    // Log to Analytics
    if (typeof logHSEReport === 'function') logHSEReport('field_survey');

    alert(`Sesi Selesai!\nJarak: ${mapperTotalDistance.toFixed(2)} km\n\nSilakan ambil screenshot untuk laporan.`);
    
    setTimeout(() => {
        container.classList.remove('snapshot-mode');
        resetMappingUI();
    }, 10000);
}

/**
 * Waypoint System
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
    
    // Styled Tooltip (Always Visible like Avenza)
    marker.bindTooltip(name, { 
        permanent: true, 
        direction: 'bottom',
        className: 'waypoint-tooltip'
    }).openTooltip();

    // Click to Navigate to this point
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

/**
 * Persistence
 */
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
    const trackData = {
        path: mapperPathCoordinates,
        distance: mapperTotalDistance,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('hse_current_tracking_backup', JSON.stringify(trackData));
}

/**
 * Tooling
 */
function toggleSatelliteView() {
    if (!mapperMap) return;
    mapperMap.removeLayer(LAYERS[currentLayerKey]);
    currentLayerKey = currentLayerKey === 'satellite' ? 'street' : 'satellite';
    LAYERS[currentLayerKey].addTo(mapperMap);
    document.getElementById('txt-map-layer').innerText = currentLayerKey === 'satellite' ? 'Satellite View' : 'Street View';
}

function centerMapOnUser() {
    if (mapperUserMarker) {
        mapperMap.setView(mapperUserMarker.getLatLng(), 17);
    }
}

function closeWaypointModal() {
    document.getElementById('waypoint-modal').classList.add('hidden');
}

/**
 * Helpers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function updateMappingUI() {
    document.getElementById('snap-dist').innerText = `Jarak: ${mapperTotalDistance.toFixed(2)} km`;
}

function resetMappingUI() {
    if (mapperMap && mapperTrackPolyline) mapperMap.removeLayer(mapperTrackPolyline);
    mapperTrackPolyline = null;
    mapperPathCoordinates = [];
}

// Global exposure
window.initHSEGeoMapper = initHSEGeoMapper;
window.refreshHSEGeoMapper = refreshHSEGeoMapper;
window.toggleMappingRecord = toggleMappingRecord;
window.requestWaypointMark = requestWaypointMark;
window.confirmWaypointMark = confirmWaypointMark;
window.closeWaypointModal = closeWaypointModal;
window.toggleSatelliteView = toggleSatelliteView;
window.centerMapOnUser = centerMapOnUser;
