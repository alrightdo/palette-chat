import React from 'react';
import { useParams } from 'next/navigation';
import { db, useProfile } from '@/db';
import { id, tx } from '@instantdb/react';

const HomePage = () => {
    const params = useParams();
    const slug = params.slug as string[] || [];
    const { profile } = useProfile();

    const handleCreateProject = () => {
        if (!profile) return;
        const projectName = prompt('Enter your project name:');
        if (projectName) {
            const projectId = id();
            db.transact([
                tx.project[projectId].update({
                    name: projectName,
                    created_at: new Date().getTime()
                }),
                tx.project[projectId].link({profile: profile.id})
            ]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to Palette Chat!</h1>
            <button 
                className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleCreateProject}
            >
                Create Project
            </button>
        </div>
    );
};

export default HomePage;