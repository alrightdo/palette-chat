import React from 'react';

const ProjectPage = ({ projectId }: { projectId: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-0 h-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Project Page</h1>
      <p className="text-lg mb-6">Viewing project with ID: {projectId}</p>
    </div>
  );
};

export default ProjectPage;