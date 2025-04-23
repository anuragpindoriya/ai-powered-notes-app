'use client';
import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {Header} from '@/components/Header';
import {NoteEditor} from '@/components/NoteEditor';
import {NoteCard} from '@/components/NoteCard';
import {useQuery} from '@tanstack/react-query';

export default function NotesPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string } | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const session = await supabase.auth.getSession();
            const user = session.data.session?.user;
            if (user) {
                setUserId(user.id);
            }
        };
        fetchUserId();
    }, []);

    const fetchNotes = async () => {
        if (!userId) throw new Error('User ID not available');
        const {data, error} = await supabase.from('notes').select('*').eq('user_id', userId);
        if (error) throw error;
        return data;
    };

    const {data: notes = [], refetch} = useQuery({
        queryKey: ['notes', userId],
        queryFn: fetchNotes,
        enabled: !!userId,
    });

    const handleAdd = async (title: string, content: string) => {
        if (!userId) {
            console.error('User ID is not set');
            return;
        }
        if (editingNote) {
            // Update the note if editing
            await supabase.from('notes').update({title, content}).eq('id', editingNote.id);
            setEditingNote(null);
        } else {
            // Add a new note
            await supabase.from('notes').insert([{title, content, user_id: userId}]);
        }
        refetch();
    };

    const handleEdit = (note: { id: number; title: string; content: string }) => {
        setEditingNote(note);
    };

    const handleDelete = async (id: number) => {
        await supabase.from('notes').delete().eq('id', id);
        refetch();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header/>
            <div className="container mx-auto p-4">
                <NoteEditor
                    onSubmit={handleAdd}
                    initialTitle={editingNote?.title || ''}
                    initialContent={editingNote?.content || ''}
                    apiKey={process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ''}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}