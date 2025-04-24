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

export default function NotesPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userInitial, setUserInitial] = useState<string>('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const {data: {session}} = await supabase.auth.getSession();
                if (!session) {
                    router.push('/login');
                    return;
                }

                setUserInitial(session.user.email?.[0].toUpperCase() || 'U');

                const {data, error} = await supabase
                    .from('notes')
                    .select('*')
                    .order('created_at', {ascending: false});

                if (error) throw error;
                setNotes(data || []);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setError('Failed to fetch notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleAddNote = async (title: string, content: string) => {
        try {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const {data, error} = await supabase
                .from('notes')
                .insert([{title, content, user_id: session.user.id}])
                .select()
                .single();

            if (error) throw error;
            setNotes([data, ...notes]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding note:', error);
            setError('Failed to add note');
        }
    };

    const handleUpdateNote = async (id: string, title: string, content: string) => {
        try {
            const {error} = await supabase
                .from('notes')
                .update({title, content})
                .eq('id', id);

            if (error) throw error;
            setNotes(notes.map(note => note.id === id ? {...note, title, content} : note));
            setEditingNote(null);
        } catch (error) {
            console.error('Error updating note:', error);
            setError('Failed to update note');
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            const {error} = await supabase
                .from('notes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete note');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header
                className="sticky top-0 z-50 flex items-center justify-between p-4 border-b shadow-sm backdrop-blur border-gray-200 px-6 py-4 bg-white/70">
                <h1 className="text-2xl font-bold tracking-tight text-blue-700">✨ AI Notes</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsDialogOpen(true)}>
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
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onDelete={handleDeleteNote}
                            onUpdate={handleUpdateNote}
                        />
                    ))}
                </div>

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