'use client';
import {signOut} from '@/utils/authHelpers';
import {useRouter} from 'next/navigation';

export const Header = () => {
    const router = useRouter();
    return (
        <header className="p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold">AI Notes</h1>
            <button onClick={() => {
                signOut();
                router.push('/');
            }} className="text-sm">Logout
            </button>
        </header>
    );
};