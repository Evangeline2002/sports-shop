/**
 * Import Script: TamilNadu_38District_Sports_Shops_38Sheets.xlsx
 * Run: node scripts/importExcel.js
 * Output: src/data/sportsShops.js (replaces existing mock data with real Excel data)
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Path Setup ----
// Try new filename first, fallback to old filename
let EXCEL_FILE = path.join(__dirname, '..', 'TamilNadu_38District_Sports_Shops_38Sheets.xlsx');
if (!fs.existsSync(EXCEL_FILE)) {
    EXCEL_FILE = path.join(__dirname, '..', 'TamilNadu_SportsShop_data.xlsx');
}
if (!fs.existsSync(EXCEL_FILE)) {
    EXCEL_FILE = path.join(__dirname, '..', 'TamilNadu_SportsShop_data.xls');
}
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'sportsShops.js');

// ---- District coordinates fallback (in case Excel rows don't have lat/lng) ----
const DISTRICT_COORDS = {
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Madurai': { lat: 9.9252, lng: 78.1198 },
    'Salem': { lat: 11.6643, lng: 78.1460 },
    'Erode': { lat: 11.3410, lng: 77.7172 },
    'Dindigul': { lat: 10.3673, lng: 77.9803 },
    'Tiruppur': { lat: 11.1085, lng: 77.3411 },
    'Tirunelveli': { lat: 8.7139, lng: 77.7567 },
    'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'Trichy': { lat: 10.7905, lng: 78.7047 },
    'Thanjavur': { lat: 10.7870, lng: 79.1378 },
    'Vellore': { lat: 12.9165, lng: 79.1325 },
    'Karur': { lat: 10.9504, lng: 78.0833 },
    'Namakkal': { lat: 11.2189, lng: 78.1674 },
    'Dharmapuri': { lat: 12.1211, lng: 78.1582 },
    'Krishnagiri': { lat: 12.5186, lng: 78.2138 },
    'Cuddalore': { lat: 11.7480, lng: 79.7714 },
    'Villupuram': { lat: 11.9401, lng: 79.4861 },
    'Viluppuram': { lat: 11.9401, lng: 79.4861 },
    'Kancheepuram': { lat: 12.8342, lng: 79.7036 },
    'Kanchipuram': { lat: 12.8342, lng: 79.7036 },
    'Tiruvallur': { lat: 13.1438, lng: 79.9079 },
    'Ramanathapuram': { lat: 9.3639, lng: 78.8395 },
    'Sivagangai': { lat: 9.8433, lng: 78.4809 },
    'Pudukkottai': { lat: 10.3797, lng: 78.8208 },
    'Pudukottai': { lat: 10.3797, lng: 78.8208 },
    'Ariyalur': { lat: 11.1396, lng: 79.0747 },
    'Perambalur': { lat: 11.2335, lng: 78.8789 },
    'Tenkasi': { lat: 8.9591, lng: 77.3151 },
    'Nilgiris': { lat: 11.4102, lng: 76.6950 },
    'Kanyakumari': { lat: 8.0883, lng: 77.5385 },
    'Ranipet': { lat: 12.9272, lng: 79.3327 },
    'Chengalpattu': { lat: 12.6841, lng: 79.9836 },
    'Tirupathur': { lat: 12.4933, lng: 78.5678 },
    'Mayiladuthurai': { lat: 11.1018, lng: 79.6522 },
    'Tiruvarur': { lat: 10.7661, lng: 79.6344 },
    'Theni': { lat: 10.0104, lng: 77.4768 },
    'Virudhunagar': { lat: 9.5680, lng: 77.9624 },
    'Thoothukudi': { lat: 8.7642, lng: 78.1348 },
    'Nagapattinam': { lat: 10.7672, lng: 79.8449 },
    'Kallakurichi': { lat: 11.7374, lng: 78.9628 },
    'Tiruvannamalai': { lat: 12.2274, lng: 79.0747 },
    'Tiruvarur': { lat: 10.7661, lng: 79.6344 },
};

// ---- Helper: normalise a header name ----
function normaliseKey(raw) {
    return String(raw).toLowerCase().trim().replace(/[\s\-\/]+/g, '_');
}

// ---- Helper: try many possible column name variants ----
function pick(row, ...candidates) {
    for (const c of candidates) {
        if (row[c] !== undefined && row[c] !== null && row[c] !== '') return row[c];
    }
    return null;
}

// ---- Helper: add small jitter so stacked markers don't hide each other ----
function jitter(val, range = 0.002) {
    return val + (Math.random() - 0.5) * range;
}

// ---- Parse number safely ----
function safeNum(v) {
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
}

// ============================================================
console.log('📂  Reading Excel file…');
const workbook = XLSX.readFile(EXCEL_FILE);
console.log(`📋  Sheets found (${workbook.SheetNames.length}):`, workbook.SheetNames.join(', '));

const allShops = [];
let globalId = 1;

for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    // Convert to JSON – raw values, first row = header
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    if (rows.length === 0) {
        console.warn(`  ⚠️  Sheet "${sheetName}" is empty – skipped.`);
        continue;
    }

    // Normalise all keys in every row
    const normalisedRows = rows.map(row => {
        const obj = {};
        for (const key of Object.keys(row)) {
            obj[normaliseKey(key)] = row[key];
        }
        return obj;
    });

    // Detect district name from sheet name
    const districtFromSheet = sheetName.trim();

    let count = 0;
    for (const row of normalisedRows) {
        // --- Shop Name ---
        const shopName = pick(row,
            'shop_name', 'shopname', 'name', 'store_name', 'storename',
            'shop', 'business_name', 'business'
        );
        if (!shopName) continue; // skip blank rows

        // --- District ---
        const district = pick(row,
            'district', 'dist', 'district_name', 'city', 'location'
        ) || districtFromSheet;

        // --- Address ---
        const address = pick(row,
            'address', 'full_address', 'shop_address', 'addr', 'location',
            'place', 'street', 'full_location'
        ) || '';

        // --- Phone ---
        const phone = String(pick(row,
            'phone', 'phone_number', 'mobile', 'contact', 'contact_number',
            'mobile_number', 'telephone', 'tel', 'ph_no'
        ) || '').trim();

        // --- Latitude / Longitude ---
        let latitude = safeNum(pick(row, 'latitude', 'lat', 'lat.', 'y', 'y_coord'));
        let longitude = safeNum(pick(row, 'longitude', 'lng', 'long', 'lon', 'x', 'x_coord'));

        // Fallback to district centroid (with slight jitter)
        const districtKey = district.trim();
        const coords = DISTRICT_COORDS[districtKey];
        if (!latitude || !longitude) {
            if (coords) {
                latitude = jitter(coords.lat);
                longitude = jitter(coords.lng);
            } else {
                // Generic Tamil Nadu centre
                latitude = jitter(10.7905);
                longitude = jitter(78.7047);
            }
        }

        // --- Rating ---
        const rawRating = pick(row, 'rating', 'ratings', 'stars', 'score', 'review_score');
        const rating = rawRating ? Math.min(5, Math.max(1, parseFloat(rawRating) || 4.0)) : 4.0;

        // --- Optional fields ---
        const website = pick(row, 'website', 'web', 'url', 'link', 'website_url') || '';
        const mapsUrl = pick(row, 'maps_url', 'google_maps', 'maps', 'map_link', 'map_url') || '';
        const category = pick(row, 'category', 'type', 'shop_type', 'sport_type', 'sports_type') || 'General';
        const email = pick(row, 'email', 'email_id', 'mail') || '';
        const pincode = pick(row, 'pincode', 'pin', 'pin_code', 'postal_code', 'zip') || '';

        allShops.push({
            id: globalId++,
            district: districtKey,
            shop_name: String(shopName).trim(),
            address: String(address).trim(),
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
            phone: phone,
            rating: parseFloat(rating.toFixed(1)),
            category: String(category).trim(),
            email: String(email).trim(),
            pincode: String(pincode).trim(),
            website: String(website).trim(),
            maps_url: String(mapsUrl).trim(),
            created_at: new Date().toISOString(),
        });
        count++;
    }

    console.log(`  ✅  Sheet "${sheetName}" → ${count} shops imported.`);
}

console.log(`\n🏪  Total shops imported: ${allShops.length}`);

// ---- Write to src/data/sportsShops.js ----
const jsContent =
    `// Auto-generated from TamilNadu_38District_Sports_Shops_38Sheets.xlsx
// Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
// Total records: ${allShops.length}

const sportsShops = ${JSON.stringify(allShops, null, 2)};

export default sportsShops;
`;

fs.writeFileSync(OUTPUT_FILE, jsContent, 'utf8');
console.log(`\n✅  Written to: ${OUTPUT_FILE}`);
console.log('🎉  Done! Reload the app to see all shops on the map.');
