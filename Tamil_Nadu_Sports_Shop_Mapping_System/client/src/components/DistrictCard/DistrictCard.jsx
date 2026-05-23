import React from 'react';

const DistrictCard = ({ district, shopCount, onSelect }) => {
    return (
        <div 
            className="bg-white shadow-md rounded-lg p-4 m-2 cursor-pointer hover:shadow-lg transition-shadow duration-300" 
            onClick={() => onSelect(district)}
        >
            <h2 className="text-xl font-semibold text-gray-800">{district}</h2>
            <p className="text-gray-600">Number of Sports Shops: {shopCount}</p>
        </div>
    );
};

export default DistrictCard;