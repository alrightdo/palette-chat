'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import HomePage from './HomePage';
import ProjectPage from './ProjectPage';
import ChannelPage from './ChannelPage';

const Page = () => {
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  let content;
  if (!slug || slug.length === 0 || (slug.length === 1 && slug[0] === 'home')) {
    content = <HomePage />;
  } else if (slug.length === 2 && slug[0] === 'p') {
    content = <ProjectPage projectId={slug[1]} />;
  } else if (slug.length === 2 && slug[0] === 'c') {
    content = <ChannelPage channelId={slug[1]} />;
  } else {
    // Handle 404 or redirect to home
    content = <HomePage />;
  }

  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="flex flex-1">
        <SideBar />
        <div className="flex flex-col flex-1">
          <AppBar />
          <main className="flex-1 min-h-0 p-0">{content}</main>
        </div>
      </div>
    </div>
  );
};

const NavBar = () => (
  <nav className="w-10 h-screen bg-gray-100 flex-shrink-0">
    {/* Nav content */}
  </nav>
);

const SideBar = () => (
  <aside className="w-[240px] h-screen bg-gray-200 flex-shrink-0">
    {/* Sidebar content */}
  </aside>
);

const AppBar = () => (
  <header className="h-10 w-full bg-gray-300 flex-shrink-0">
    {/* App bar content */}
  </header>
);

export default Page;