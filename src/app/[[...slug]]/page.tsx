'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import HomePage from './HomePage';
import ProjectPage from './ProjectPage';
import ChannelPage from './ChannelPage';
import { useRouter } from 'next/navigation';
import { db, ProfileProvider, useProfile } from '@/db';
import ProfileAvatar from '@/components/ProfileAvatar';
import { id, tx } from '@instantdb/react';

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
        <ProfileProvider>
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
        </ProfileProvider>
    );
};

const NavBar = () => {
    const { profile, isLoading: profileLoading } = useProfile();
    const { data, isLoading: projectsLoading } = db.useQuery(profile ? {
        project: {
            $: {
                where: {
                    "profile.id": profile.id
                }
            },
        },
    } : null );

    const handleAvatarClick = () => {
        const newName = prompt("Please enter your name:", profile.name);
        if (newName && newName !== profile.name) {
            db.transact([tx.profile[profile.id].update({name: newName})])
        }
    };

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
        <nav className="w-60 h-screen bg-gray-100 flex-shrink-0 flex flex-col justify-between items-center p-4">
            <div className="flex-grow w-full overflow-y-auto">
                <h2 className="text-lg font-semibold mb-2">Your Projects</h2>
                {projectsLoading ? (
                    <p>Loading projects...</p>
                ) : (
                    <ul className="mb-4">
                        {data?.project.map((project) => (
                            <li key={project.id} className="mb-2">
                                <a href={`/p/${project.id}`} className="text-blue-600 hover:underline">
                                    {project.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                <button 
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={handleCreateProject}
                >
                    Add Project
                </button>
            </div>
            <div className="mb-4">
                <ProfileAvatar 
                    profile={profile} 
                    isLoading={profileLoading} 
                    onClick={handleAvatarClick}
                />
            </div>
        </nav>
    );
};

const SideBar = () => {
    const params = useParams();
    const router = useRouter();
    const projectId = params.slug?.[1];
    const { profile } = useProfile();

    const { data, isLoading } = db.useQuery(projectId ? {
        channel: {
            $: {
                where: {
                    "project.id": projectId
                }
            },
        },
    } : null);

    const handleCreateChannel = () => {
        if (!profile || !projectId) return;
        const channelName = prompt('Enter your channel name:');
        if (channelName) {
            const channelId = id();
            db.transact([
                tx.channel[channelId].update({
                    name: channelName,
                }),
                tx.channel[channelId].link({project: projectId})
            ]).then(() => {
                router.push(`/c/${channelId}`);
            });
        }
    };

    return (
        <aside className="w-60 h-screen bg-gray-200 flex-shrink-0 flex flex-col p-4">
            <h2 className="text-lg font-semibold mb-2">Channels</h2>
            {isLoading ? (
                <p>Loading channels...</p>
            ) : (
                <ul className="mb-4 flex-grow overflow-y-auto">
                    {data?.channel.map((channel) => (
                        <li key={channel.id} className="mb-2">
                            <a href={`/c/${channel.id}`} className="text-blue-600 hover:underline">
                                {channel.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            <button 
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleCreateChannel}
            >
                Add Channel
            </button>
        </aside>
    );
};

const AppBar = () => {
    const { profile, isLoading } = useProfile();

    if (isLoading) return <div>Loading profile...</div>;
    if (!profile) return <div>No profile found</div>;

    return (
        <header className="h-10 w-full bg-gray-300 flex-shrink-0">
        </header>
    );
};

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