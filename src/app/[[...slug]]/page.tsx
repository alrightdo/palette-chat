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
  if (!slug || slug.length === 0) {
    content = <HomePage />;
  } else if (slug.length === 1) {
    content = <ProjectPage projectId={slug[0]} />;
  } else if (slug.length === 2) {
    content = <ChannelPage channelId={slug[1]} />;
  }

  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.mainContent}>
        <SideBar />
        <div style={styles.rightContent}>
          <AppBar />
          <main style={styles.content}>{content}</main>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: '20px',
  },
};

const NavBar = () => (
  <nav style={{ width: '40px', height: '100vh', backgroundColor: '#f0f0f0', flexShrink: 0 }}>
    {/* Nav content */}
  </nav>
);

const SideBar = () => (
  <aside style={{ width: '240px', height: '100vh', backgroundColor: '#e0e0e0', flexShrink: 0 }}>
    {/* Sidebar content */}
  </aside>
);

const AppBar = () => (
  <header style={{ height: '40px', width: '100%', backgroundColor: '#d0d0d0', flexShrink: 0 }}>
    {/* App bar content */}
  </header>
);

export default Page;