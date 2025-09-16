
import React from 'react';

interface TestimonialCardProps {
    image: string;
    alt: string;
    quote: string;
    name: string;
    location: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ image, alt, quote, name, location }) => {
    return (
        <div className="bg-[#2A1A5E] p-8 rounded-xl border border-[#4A3F7A]/50 shadow-2xl shadow-black/30 flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center mb-6">
                <img src={image} alt={alt} className="w-20 h-20 rounded-full object-cover border-3 border-[#DAFF00] shadow-lg" />
                <div className="ml-6">
                    <p className="font-bold text-white text-xl">{name}</p>
                    <p className="text-purple-300 text-base">{location}</p>
                </div>
            </div>
            <div className="flex-grow">
                <p className="text-purple-200/90 leading-relaxed italic text-lg">"{quote}"</p>
            </div>
            <div className="mt-6 text-yellow-400 text-xl">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
            </div>
        </div>
    );
};
