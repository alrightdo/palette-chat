import React from 'react';

interface Profile {
    name?: string;
    color?: string;
}

interface ProfileAvatarProps {
    profile: Profile | null;
    isLoading: boolean;
    onClick?: () => void;  // Add this line
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile, isLoading, onClick }) => {  // Add onClick here
    if (isLoading) {
        return <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>;
    }

    if (profile) {
        return (
            <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"  // Add cursor-pointer
                style={{ backgroundColor: profile.color || '#gray-300' }}
                onClick={onClick}  // Add this line
            >
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
        );
    }

    return (
        <div 
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"  // Add cursor-pointer
            onClick={onClick}  // Add this line
        >
            <span className="text-gray-500 text-xs">?</span>
        </div>
    );
};

export default ProfileAvatar;