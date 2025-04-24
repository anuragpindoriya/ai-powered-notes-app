'use client';

import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {NoteCard} from '@/components/NoteCard';
import {AddEditNoteDialog} from '@/components/AddEditNoteDialog';
import {Button} from '@/components/ui/button';
import {LogOut, Plus} from 'lucide-react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Note} from '@/types/note';
import {useRouter} from 'next/navigation';
import {useNotes} from '@/hooks/useNotes';
import {useQuery} from '@tanstack/react-query';

export default function NotesPage() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [userInitial, setUserInitial] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    // Check for authenticated session
    useEffect(() => {
        const checkSession = async () => {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            setUserId(session.user.id);
            setUserInitial(session.user.email?.[0].toUpperCase() || 'U');
        };

        checkSession();
    }, [router]);

    // Use the useNotes hook for data operations
    const {getNotes, addNote, deleteNote} = useNotes(userId || '');

    // Query for notes
    const {data: notes = [], isLoading, error} = useQuery({
        queryKey: ['notes', userId],
        queryFn: getNotes,
        enabled: !!userId,
    });

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleAddNote = async (title: string, content: string) => {
        if (!userId) return;

        try {
            await addNote.mutateAsync({
                title,
                content,
                user_id: userId
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleUpdateNote = async (id: string, title: string, content: string) => {
        if (!userId) return;

        try {
            const {error} = await supabase
                .from('notes')
                .update({title, content})
                .eq('id', id);

            if (error) throw error;
            // The query will be automatically invalidated by the addNote mutation
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote.mutateAsync(parseInt(id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    if (isLoading || !userId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header
                className="sticky top-0 z-50 flex items-center justify-between p-4 border-b shadow-sm backdrop-blur border-gray-200 px-6 py-4 bg-white/70">
                <h1 className="text-2xl font-bold tracking-tight text-blue-700">✨ AI Notes</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsDialogOpen(true)} variant={'blue_defualt'}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add Note
                    </Button>
                    <Avatar>
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-5 h-5"/>
                    </Button>
                </div>
            </header>

            <div className="container mx-auto p-4">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {String(error)}
                    </div>
                )}

                {notes.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note: Note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onDelete={handleDeleteNote}
                            onUpdate={handleUpdateNote}
                        />
                    ))}
                </div> : <h1 className={'text-center'}>No Magic word for you so create it</h1>}

                <AddEditNoteDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    note={editingNote || undefined}
                    onSave={editingNote ?
                        (title, content) => handleUpdateNote(editingNote.id, title, content) :
                        handleAddNote
                    }
                />
            </div>
        </div>
    );
}