import * as XLSX from "xlsx";
import { districts } from "../data/districts";

export const excelService = {
  // Parse Excel/CSV file using SheetJS
  parseFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert sheet to JSON array
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          
          // Normalise columns to match database schema
          const normalisedShops = rawRows.map((row) => {
            const keys = Object.keys(row);
            const shop = {
              shop_name: "",
              address: "",
              phone: "",
              latitude: null,
              longitude: null,
              district: "",
              website: "",
              rating: 4.0
            };

            // Map various common header names
            keys.forEach((key) => {
              const val = row[key];
              const normKey = key.toLowerCase().trim().replace(/[\s_-]/g, "");

              if (normKey === "shopname" || normKey === "name" || normKey === "storename") {
                shop.shop_name = val;
              } else if (normKey === "address" || normKey === "location" || normKey === "fulladdress") {
                shop.address = val;
              } else if (normKey === "phone" || normKey === "phonenumber" || normKey === "contact") {
                shop.phone = val.toString();
              } else if (normKey === "latitude" || normKey === "lat") {
                shop.latitude = parseFloat(val) || null;
              } else if (normKey === "longitude" || normKey === "lng" || normKey === "lon") {
                shop.longitude = parseFloat(val) || null;
              } else if (normKey === "district" || normKey === "city") {
                shop.district = val;
              } else if (normKey === "website" || normKey === "url" || normKey === "site") {
                shop.website = val;
              } else if (normKey === "rating" || normKey === "stars") {
                shop.rating = parseFloat(val) || 4.0;
              }
            });

            return shop;
          }).filter(shop => shop.shop_name && shop.shop_name.trim() !== ""); // Filter out empty rows

          resolve(normalisedShops);
        } catch (error) {
          reject(new Error("Failed to parse file. Ensure it is a valid Excel or CSV sheet."));
        }
      };

      reader.onerror = () => {
        reject(new Error("File reading error."));
      };

      reader.readAsBinaryString(file);
    });
  },

  // Export JSON shops data to Excel
  exportToExcel: (shops, fileName = "TamilNadu_SportsShops_Data") => {
    // Format JSON array to readable worksheet headers
    const dataToExport = shops.map((s, index) => ({
      "S.No": index + 1,
      "Shop Name": s.shop_name,
      "District": s.district,
      "Full Address": s.address,
      "Phone Number": s.phone,
      "Rating": s.rating,
      "Website": s.website,
      "Latitude": s.latitude,
      "Longitude": s.longitude,
      "Google Maps URL": s.maps_url,
      "Date Added": s.created_at ? new Date(s.created_at).toLocaleDateString() : ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sports Shops");

    // Adjust column widths automatically
    const maxColumnWidths = [];
    dataToExport.forEach((row) => {
      Object.keys(row).forEach((key, colIndex) => {
        const val = row[key] ? row[key].toString() : "";
        const len = Math.max(val.length, key.length);
        maxColumnWidths[colIndex] = Math.max(maxColumnWidths[colIndex] || 10, len);
      });
    });
    
    worksheet["!cols"] = maxColumnWidths.map(w => ({ w: Math.min(w + 2, 50) })); // Cap at width 50

    // Download file
    XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
  },

  // Download Sample Template for Excel Imports
  downloadTemplate: () => {
    // Include a couple of examples and all district centers to help bulk imports
    const examples = [
      {
        "Shop Name": "Example Chennai Sports Shop",
        "District": "Chennai",
        "Address": "10, NSC Bose Road, George Town, Chennai, Tamil Nadu 600001",
        "Phone": "+91 44 2538 9999",
        "Latitude": 13.0912,
        "Longitude": 80.2825,
        "Website": "https://chennaisports.example.com",
        "Rating": 4.5
      },
      {
        "Shop Name": "Example Kovai Cricket Center",
        "District": "Coimbatore",
        "Address": "402, DB Road, RS Puram, Coimbatore, Tamil Nadu 641002",
        "Phone": "+91 422 254 1111",
        "Latitude": 11.0125,
        "Longitude": 76.9492,
        "Website": "",
        "Rating": 4.2
      }
    ];

    // Add district center rows for all 38 districts
    const districtRows = districts.map((d) => ({
      "Shop Name": `${d.name} - District Center`,
      "District": d.name,
      "Address": `${d.name} District`,
      "Phone": "",
      "Latitude": d.lat,
      "Longitude": d.lng,
      "Website": "",
      "Rating": 4.0
    }));

    const templateData = [...examples, ...districtRows];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Import Template");
    XLSX.writeFile(workbook, "TN_SportsShops_ImportTemplate.xlsx");
  }
};
