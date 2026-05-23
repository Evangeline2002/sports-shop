import React, { createContext, useState, useContext, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    app_title: "Tamil Nadu Sports Shop Mapping System",
    app_subtitle: "Google Maps & Directory for Sports Retailers",
    dashboard: "Dashboard",
    map_view: "Map View",
    districts: "Districts",
    analytics: "Analytics",
    upload_excel: "Upload Excel/CSV",
    settings: "Settings",
    login: "Login",
    logout: "Logout",
    admin_portal: "Admin Portal",
    admin_login: "Admin Login",
    email: "Email Address",
    password: "Password",
    submit_login: "Sign In as Admin",
    login_error: "Invalid email or password",
    total_shops: "Total Sports Shops",
    active_districts: "Active Districts",
    recent_shops: "Recently Added Shops",
    active_markers: "Active Map Markers",
    excel_uploads: "Excel Uploads",
    search_queries: "Search Queries Run",
    search_placeholder: "Search shop name, address, or district...",
    search_districts: "Search 38 Districts...",
    district_filter: "District Filter",
    rating_filter: "Rating Filter",
    nearby_shops: "Show Shops Nearby",
    all_districts: "All Districts",
    all_ratings: "All Ratings",
    rating_up: "Stars & Up",
    actions: "Actions",
    add_shop: "Add New Shop",
    edit_shop: "Edit Shop",
    delete_shop: "Delete Shop",
    bulk_import: "Bulk Import",
    bulk_delete: "Bulk Delete",
    shop_name: "Shop Name",
    address: "Address",
    phone: "Phone Number",
    rating: "Rating",
    website: "Website URL",
    maps_url: "Google Maps Link",
    latitude: "Latitude",
    longitude: "Longitude",
    created_at: "Created At",
    updated_at: "Updated At",
    save: "Save Changes",
    cancel: "Cancel",
    confirm_delete: "Are you sure you want to delete this shop?",
    success_add: "Shop added successfully!",
    success_edit: "Shop updated successfully!",
    success_delete: "Shop deleted successfully!",
    no_shops: "No sports shops found matching your criteria.",
    upload_file: "Drag and drop your Excel or CSV file here, or click to browse",
    select_file: "Select Spreadsheet",
    export_excel: "Export to Excel",
    download_district_data: "Download District Data",
    google_maps_collect: "Collect Google Maps Data",
    fetch_query: "Google Places API Query",
    start_fetching: "Start Data Collection",
    fetching_status: "Collection Status",
    db_status: "Database Status",
    firebase_connected: "Connected to Firebase Firestore",
    local_storage: "Using LocalStorage Fallback",
    pwa_ready: "App ready for offline use!",
    gps_locate: "Locate Me",
    layer_streets: "Streets Layer",
    layer_satellite: "Satellite Layer",
    layer_heatmap: "Heatmap View",
    layer_cluster: "Cluster Markers",
    shop_image: "Upload Shop Image",
    details: "Details",
    directions: "Get Directions",
    open_maps: "Open in Google Maps",
    nearby_distance: "Within {dist} km of current location",
    gps_unavailable: "GPS Location is unavailable or blocked.",
    duplicate_detected: "Duplicate shop detected and skipped",
    required_fields: "Please fill in all required fields",
    invalid_coords: "Invalid Latitude (-90 to 90) or Longitude (-180 to 180)",
    invalid_phone: "Please enter a valid phone number",
    language: "Language / மொழி",
    chart_shop_distribution: "District-wise Shop Distribution",
    chart_ratings: "Rating Analytics",
    chart_growth: "Monthly Shop Registration Growth",
    chart_most_active: "Most Active Districts (By Shop Count)",
    english: "English",
    tamil: "தமிழ்",
    district_list: "Tamil Nadu Districts"
  },
  ta: {
    app_title: "தமிழ்நாடு விளையாட்டு உபகரணங்கள் கடை வரைபட அமைப்பு",
    app_subtitle: "விளையாட்டு சில்லறை விற்பனையாளர்களுக்கான கூகிள் மேப்ஸ் & கோப்பகம்",
    dashboard: "டாஷ்போர்டு",
    map_view: "வரைபடக் காட்சி",
    districts: "மாவட்டங்கள்",
    analytics: "புள்ளிவிவரங்கள்",
    upload_excel: "எக்செல்/சிஎஸ்வி பதிவேற்றம்",
    settings: "அமைப்புகள்",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    admin_portal: "நிர்வாகி தளம்",
    admin_login: "நிர்வாகி உள்நுழைவு",
    email: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    submit_login: "நிர்வாகியாக உள்நுழைக",
    login_error: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
    total_shops: "மொத்த விளையாட்டு கடைகள்",
    active_districts: "செயலில் உள்ள மாவட்டங்கள்",
    recent_shops: "சமீபத்தில் சேர்க்கப்பட்ட கடைகள்",
    active_markers: "செயலில் உள்ள வரைபடக் குறிப்பான்கள்",
    excel_uploads: "எக்செல் பதிவேற்றங்கள்",
    search_queries: "தேடப்பட்ட வார்த்தைகளின் எண்ணிக்கை",
    search_placeholder: "கடை பெயர், முகவரி அல்லது மாவட்டத்தை தேடவும்...",
    search_districts: "38 மாவட்டங்களை தேடவும்...",
    district_filter: "மாவட்ட வடிகட்டி",
    rating_filter: "மதிப்பீடு வடிகட்டி",
    nearby_shops: "அருகிலுள்ள கடைகளைக் காட்டு",
    all_districts: "அனைத்து மாவட்டங்கள்",
    all_ratings: "அனைத்து மதிப்பீடுகள்",
    rating_up: "நட்சத்திரங்கள் மற்றும் அதற்கு மேல்",
    actions: "செயல்கள்",
    add_shop: "புதிய கடை சேர்",
    edit_shop: "கடை திருத்து",
    delete_shop: "கடையை நீக்கு",
    bulk_import: "மொத்தமாக இறக்குமதி செய்",
    bulk_delete: "மொத்தமாக நீக்கு",
    shop_name: "கடையின் பெயர்",
    address: "முகவரி",
    phone: "தொலைபேசி எண்",
    rating: "மதிப்பீடு",
    website: "வலைத்தள முகவரி",
    maps_url: "கூகிள் மேப்ஸ் இணைப்பு",
    latitude: "அட்சரேகை (Latitude)",
    longitude: "தீர்க்கரேகை (Longitude)",
    created_at: "உருவாக்கப்பட்ட தேதி",
    updated_at: "புதுப்பிக்கப்பட்ட தேதி",
    save: "மாற்றங்களைச் சேமி",
    cancel: "ரத்து செய்",
    confirm_delete: "இந்த கடையை நீக்க உறுதியாக உள்ளீர்களா?",
    success_add: "கடை வெற்றிகரமாக சேர்க்கப்பட்டது!",
    success_edit: "கடை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    success_delete: "கடை வெற்றிகரமாக நீக்கப்பட்டது!",
    no_shops: "உங்கள் தேடலுக்கு ஏற்ற விளையாட்டு கடைகள் எதுவும் இல்லை.",
    upload_file: "உங்கள் எக்செல் அல்லது சிஎஸ்வி கோப்பை இங்கே இழுத்து போடவும், அல்லது தேட கிளிக் செய்யவும்",
    select_file: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    export_excel: "எக்செல்-க்கு ஏற்றுமதி செய்",
    download_district_data: "மாவட்டத் தரவைப் பதிவிறக்கு",
    google_maps_collect: "கூகிள் வரைபடத் தரவைச் சேகரி",
    fetch_query: "கூகிள் பிளேசஸ் ஏபிஐ கேள்வி",
    start_fetching: "தரவு சேகரிப்பைத் தொடங்கு",
    fetching_status: "சேகரிப்பு நிலை",
    db_status: "தரவுத்தள நிலை",
    firebase_connected: "Firebase Firestore உடன் இணைக்கப்பட்டுள்ளது",
    local_storage: "உள்ளூர் சேமிப்பகம் (LocalStorage) பயன்படுத்தப்படுகிறது",
    pwa_ready: "ஆஃப்லைன் பயன்பாட்டிற்கு ஆப் தயாராக உள்ளது!",
    gps_locate: "என் இருப்பிடம்",
    layer_streets: "தெருக்கள் வரைபடம்",
    layer_satellite: "செயற்கைக்கோள் வரைபடம்",
    layer_heatmap: "அடர்த்தி வரைபடம் (Heatmap)",
    layer_cluster: "குழு குறிப்பான்கள்",
    shop_image: "கடை புகைப்படத்தை பதிவேற்றவும்",
    details: "விவரங்கள்",
    directions: "திசைகளைப் பெறுக",
    open_maps: "கூகிள் மேப்ஸில் திறக்கவும்",
    nearby_distance: "தற்போதைய இருப்பிடத்திலிருந்து {dist} கி.மீ க்குள்",
    gps_unavailable: "ஜி.பி.எஸ் இருப்பிடம் கிடைக்கவில்லை அல்லது தடுக்கப்பட்டுள்ளது.",
    duplicate_detected: "ஒரே மாதிரியான கடை கண்டறியப்பட்டு தவிர்க்கப்பட்டது",
    required_fields: "தேவையான அனைத்து புலங்களையும் நிரப்பவும்",
    invalid_coords: "தவறான அட்சரேகை (-90 முதல் 90) அல்லது தீர்க்கரேகை (-180 முதல் 180)",
    invalid_phone: "சரியான தொலைபேசி எண்ணை உள்ளிடவும்",
    language: "Language / மொழி",
    chart_shop_distribution: "மாவட்ட வாரியாக கடைகளின் விநியோகம்",
    chart_ratings: "மதிப்பீடு புள்ளிவிவரங்கள்",
    chart_growth: "மாதாந்திர கடை பதிவுகளின் வளர்ச்சி",
    chart_most_active: "மிகவும் செயலில் உள்ள மாவட்டங்கள் (கடை எண்ணிக்கையின் அடிப்படையில்)",
    english: "English",
    tamil: "தமிழ்",
    district_list: "தமிழ்நாடு மாவட்டங்கள்"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  const t = (key, params = {}) => {
    let text = translations[language][key] || translations["en"][key] || key;
    // Replace parameters if any, e.g., {dist}
    Object.keys(params).forEach(p => {
      text = text.replace(`{${p}}`, params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
