'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { init } from '@instantdb/react';
import HomePage from './HomePage';
import ProjectPage from './ProjectPage';
import ChannelPage from './ChannelPage';
import { useRouter } from 'next/navigation';

const APP_ID = 'b624ebb3-5c3d-4416-87f2-24005d41aeb5';
type Schema = {
    "channel": {
        "name": string,
    },
    "post": {
        "file_id": string,
        "message": string,
        "created_at": string,
        "mux_id": string,
    },
    "project": {
        "name": string,
    },
    "user": {
        "name": string,
    },
}

const db = init<Schema>({ appId: APP_ID });

const Page = () => {
  const { isLoading, user, error } = db.useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Uh oh! {error.message}</div>;
  if (!user) return <Login />;

  let content;
  if (!slug || slug.length === 0 || (slug.length === 1 && slug[0] === 'home')) {
    content = <HomePage />;
  } else if (slug.length === 2 && slug[0] === 'p') {
    content = <ProjectPage projectId={slug[1]} />;
  } else if (slug.length === 2 && slug[0] === 'c') {
    content = <ChannelPage channelId={slug[1]} />;
  } else {
    content = null;
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

function Login() {
  const [sentEmail, setSentEmail] = useState('');
  return (
    <div className="flex justify-center items-center h-screen">
      {!sentEmail ? (
        <Email setSentEmail={setSentEmail} />
      ) : (
        <MagicCode sentEmail={sentEmail} />
      )}
    </div>
  );
}

function Email({ setSentEmail }: { setSentEmail: (email: string) => void }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSentEmail(email);
    db.auth.sendMagicCode({ email }).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setSentEmail('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen font-sans">
      <h2 className="text-gray-800 mb-5 text-xl">Let's log you in!</h2>
      <div>
        <input
          className="p-2 mb-4 border border-gray-300 rounded-md w-72"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
          Send Code
        </button>
      </div>
    </form>
  );
}

function MagicCode({ sentEmail }: { sentEmail: string }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
      alert('Uh oh :' + err.body?.message);
      setCode('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen font-sans">
      <h2 className="text-gray-800 mb-5 text-xl">
        Okay, we sent you an email! What was the code?
      </h2>
      <div>
        <input
          className="p-2 mb-4 border border-gray-300 rounded-md w-72"
          type="text"
          placeholder="123456..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
        Verify
      </button>
    </form>
  );
}

export default Page;