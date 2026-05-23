import React, { useState, useEffect, useRef } from "react";
import MapContainer from "../components/MapContainer";
import ShopFormModal from "../components/ShopFormModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useShops } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { districts } from "../data/districts";
import {
  BiMapPin,
  BiPhone,
  BiStore,
  BiX,
  BiPlus,
  BiChevronDown,
  BiNavigation,
  BiSearch,
  BiFilterAlt,
  BiGridAlt,
  BiMap,
  BiListUl,
  BiCurrentLocation,
  BiTrendingUp,
  BiStar,
  BiChart,
  BiCheckCircle,
} from "react-icons/bi";

const MapPage = () => {
  const {
    filteredShops,
    shops,
    loading,
    selectedShop,
    setSelectedShop,
    selectedDistrict,
    setSelectedDistrict,
    searchQuery,
    setSearchQuery,
    addShop,
    updateShop,
    deleteShop,
    logSearch,
    districtStats,
    toggleVisited,
    visitedCount,
  } = useShops();

  const { isAdmin } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileView, setMobileView] = useState("map"); // 'map' | 'list'
  const [showDistrictAnalysis, setShowDistrictAnalysis] = useState(false);
  const listRef = useRef(null);

  // Debounced search logging
  useEffect(() => {
    const timer = setTimeout(() => logSearch(searchQuery), 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayShops = filteredShops;

  // Count completed based on visited status
  const completedCount = visitedCount;

  const handleSaveShop = async (shopData) => {
    const res = editingShop
      ? await updateShop(editingShop.id, shopData)
      : await addShop(shopData);
    if (res.success) setModalOpen(false);
    else alert("Operation failed: " + res.error);
  };

  const handleViewOnMap = (shop) => {
    setSelectedShop(shop);
    setMobileView("map");
  };

  const handleCall = (phone) => {
    if (phone) window.open(`tel:${phone}`);
  };

  const handleDeleteClick = async (shop) => {
    if (window.confirm("Delete this venue?")) {
      const res = await deleteShop(shop.id);
      if (!res.success) alert("Delete failed: " + res.error);
    }
  };

  // Get top districts by count
  const topDistricts = districtStats
    ? [...districtStats].sort((a, b) => b.count - a.count).slice(0, 8)
    : [];

  return (
    <div className="mappage-root">
      {/* ─── FLOATING HEADER BAR ─── */}
      <header className="mappage-header">
        <div className="mappage-header-left">
          <div className="mappage-logo">
            <BiMap className="mappage-logo-icon" />
          </div>
          <div className="mappage-brand">
            <span className="mappage-brand-title">TN Sports GIS</span>
          </div>
        </div>
        <div className="mappage-header-right">
          {isAdmin && (
            <button
              className="mappage-header-btn mappage-header-btn-primary"
              onClick={() => {
                setEditingShop(null);
                setModalOpen(true);
              }}
            >
              <BiPlus /> Add Venue
            </button>
          )}
        </div>
      </header>

      {/* ─── MAP PANE ─── */}
      <div className={`mappage-map ${mobileView !== "map" ? "mappage-hidden-mobile" : ""}`}>
        <MapContainer />
      </div>

      {/* ─── FLOATING STATS BAR ─── */}
      <div className="mappage-stats-bar">
        <div className="mappage-stat-item">
          <BiStore className="mappage-stat-icon" />
          <span>SERVER RECORDS: <strong>{shops.length}</strong></span>
        </div>
        <div className="mappage-stat-divider" />
        <div className="mappage-stat-item">
          <BiTrendingUp className="mappage-stat-icon mappage-stat-icon-green" />
          <span>COMPLETED: <strong>{completedCount}</strong></span>
        </div>
        <div className="mappage-stat-spacer" />
        <div className="mappage-stat-item mappage-stat-port">
          PORT: <strong>5500</strong>
        </div>
      </div>

      {/* ─── SHOP LIST PANEL ─── */}
      <aside
        className={`mappage-panel ${panelOpen ? "mappage-panel-open" : "mappage-panel-closed"} ${mobileView !== "list" ? "mappage-hidden-mobile" : ""
          }`}
      >
        {/* Search Bar */}
        <div className="mappage-panel-search-wrap">
          <BiSearch className="mappage-panel-search-icon" />
          <input
            type="text"
            className="mappage-panel-search-input"
            placeholder="Search name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="mappage-panel-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <BiX />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="mappage-filter-row">
          <div className="mappage-filter-select-wrap">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="mappage-filter-select"
            >
              <option value="">ALL DISTRICTS</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <BiFilterAlt className="mappage-filter-icon" />
          </div>
        </div>

        {/* Results Count */}
        <div className="mappage-results-count">
          RESULTS: <strong>{displayShops.length}</strong>
          {selectedDistrict && (
            <button
              className="mappage-clear-filter"
              onClick={() => setSelectedDistrict("")}
            >
              <BiX /> Clear Filter
            </button>
          )}
        </div>

        {/* Venue list */}
        <div className="mappage-venue-list" ref={listRef}>
          {loading ? (
            <div className="mappage-empty">
              <LoadingSpinner size="medium" />
            </div>
          ) : displayShops.length === 0 ? (
            <div className="mappage-empty">
              <BiStore style={{ fontSize: 42, color: "#334155" }} />
              <p>No shops found for your search.</p>
            </div>
          ) : (
            displayShops.map((shop, index) => {
              const isActive = selectedShop?.id === shop.id;
              const name = shop.shop_name || shop.name || "Unknown";
              const hasPhone = shop.phone && shop.phone.trim() !== "";
              const statusLabel = hasPhone ? "VERIFIED" : "PENDING";
              const statusClass = hasPhone ? "mappage-status-verified" : "mappage-status-pending";

              return (
                <div
                  key={shop.id}
                  className={`mappage-card ${isActive ? "mappage-card-active" : ""}`}
                  onClick={() => handleViewOnMap(shop)}
                  style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
                >
                  {/* Card Top Row */}
                  <div className="mappage-card-top">
                    <span className="mappage-card-badge">
                      {shop.category || "GENERAL"}
                    </span>
                    <span className={`mappage-card-status ${shop.visited ? "mappage-status-verified" : "mappage-status-pending"}`}>
                      {shop.visited ? "VISITED" : "PENDING"}
                    </span>
                  </div>

                  {/* Shop Name */}
                  <h4 className="mappage-card-name">{name}</h4>

                  {/* Address */}
                  {shop.address && (
                    <p className="mappage-card-addr">
                      <BiMapPin className="mappage-card-addr-icon" />
                      <span>{shop.address}</span>
                    </p>
                  )}

                  {/* Phone */}
                  <p className="mappage-card-phone">
                    <BiPhone className="mappage-card-phone-icon" />
                    <span>{hasPhone ? shop.phone : "N/A"}</span>
                  </p>

                  {/* Action Buttons */}
                  <div className="mappage-card-actions">
                    <button
                      className="mappage-btn mappage-btn-locate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOnMap(shop);
                      }}
                    >
                      <BiCurrentLocation /> Locate
                    </button>
                    <button
                      className={`mappage-btn ${shop.visited ? "mappage-btn-visited" : "mappage-btn-mark"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisited(shop.id);
                      }}
                    >
                      {shop.visited ? <BiCheckCircle /> : <BiStar />} {shop.visited ? "Visited" : "Mark"}
                    </button>
                    {isAdmin && (
                      <button
                        className="mappage-btn mappage-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(shop);
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* District Analysis Section */}
        <div className="mappage-district-analysis">
          <button
            className="mappage-district-analysis-toggle"
            onClick={() => setShowDistrictAnalysis(!showDistrictAnalysis)}
          >
            <span className="mappage-district-analysis-title">
              <BiChart /> DISTRICT ANALYSIS
            </span>
            <BiChevronDown
              className={`mappage-district-analysis-chevron ${showDistrictAnalysis ? "mappage-chevron-open" : ""
                }`}
            />
          </button>
          {showDistrictAnalysis && (
            <div className="mappage-district-bars">
              {topDistricts.map((d) => (
                <div
                  key={d.id}
                  className="mappage-district-bar-item"
                  onClick={() => setSelectedDistrict(d.id)}
                >
                  <div className="mappage-district-bar-label">
                    <span>{d.name}</span>
                    <span className="mappage-district-bar-count">{d.count}</span>
                  </div>
                  <div className="mappage-district-bar-track">
                    <div
                      className="mappage-district-bar-fill"
                      style={{
                        width: `${Math.min((d.count / (topDistricts[0]?.count || 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <div className="mappage-mobile-tabs">
        <button
          className={`mappage-mobile-tab ${mobileView === "map" ? "active" : ""}`}
          onClick={() => setMobileView("map")}
        >
          <BiMap />
          <span>Map</span>
        </button>
        <button
          className={`mappage-mobile-tab ${mobileView === "list" ? "active" : ""}`}
          onClick={() => setMobileView("list")}
        >
          <BiListUl />
          <span>List</span>
        </button>
      </div>

      {/* CRUD Modal */}
      <ShopFormModal
        isOpen={modalOpen}
        shop={editingShop}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveShop}
      />
    </div>
  );
};

export default MapPage;
