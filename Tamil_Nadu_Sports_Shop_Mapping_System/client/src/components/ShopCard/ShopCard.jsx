import React from 'react';
import { FaPhone, FaStar } from 'react-icons/fa';

const ShopCard = ({ shop }) => {
    const { shop_name, address, phone, rating, website, maps_url } = shop;

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-2">
            <h2 className="text-xl font-semibold">{shop_name}</h2>
            <p className="text-gray-600">{address}</p>
            <p className="flex items-center">
                <FaPhone className="mr-1" />
                {phone}
            </p>
            <p className="flex items-center">
                <FaStar className="mr-1 text-yellow-500" />
                {rating ? rating : 'N/A'}
            </p>
            <div className="flex justify-between mt-4">
                <a href={maps_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Open in Google Maps
                </a>
                {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Visit Website
                    </a>
                )}
            </div>
        </div>
    );
};

export default ShopCard;