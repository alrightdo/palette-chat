'use client';

import React from 'react';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Palette Chat!</h1>
            <p className="text-lg mb-6">We're glad to have you here. Explore and enjoy your stay! 🎨</p>
            <button 
                className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={() => alert('Thanks for visiting ✨!')}
            >
                Click Me
            </button>
        </div>
    );
};

export default HomePage;
