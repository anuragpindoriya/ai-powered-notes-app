'use client';
import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {NoteEditor} from '@/components/NoteEditor';
import {NoteCard} from '@/components/NoteCard';
import {useQuery} from '@tanstack/react-query';
import {Card, CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {useRouter} from 'next/navigation';

// Maximum number of notes per user
const MAX_NOTES_PER_USER = 100;

export default function NotesPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {data: {session}, error: authError} = await supabase.auth.getSession();
                
                if (authError) throw authError;
                
                const user = session?.user;
                if (user) {
                    setUserId(user.id);
                    setIsAuthenticated(true);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Auth error:', error);
                setError('Authentication failed. Please try again.');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const fetchNotes = async () => {
        if (!userId) throw new Error('User ID not available');
        
        const {data, error, count} = await supabase
            .from('notes')
            .select('*', {count: 'exact'})
            .eq('user_id', userId)
            .order('created_at', {ascending: false});

        if (error) throw error;
        if (count && count > MAX_NOTES_PER_USER) {
            throw new Error('Maximum note limit reached');
        }
        return data;
    };

    const {data: notes = [], refetch, error: fetchError} = useQuery({
        queryKey: ['notes', userId],
        queryFn: fetchNotes,
        enabled: !!userId,
        retry: 1,
        staleTime: 30000, // 30 seconds
    });

    const handleAdd = async (title: string, content: string) => {
        if (!userId) {
            setError('User ID is not set');
            return;
        }

        try {
            // Input validation
            if (!title.trim() || !content.trim()) {
                setError('Title and content are required');
                return;
            }

            if (title.length > 100) {
                setError('Title is too long');
                return;
            }

            if (content.length > 10000) {
                setError('Content is too long');
                return;
            }

            if (editingNote) {
                const {error} = await supabase
                    .from('notes')
                    .update({title, content})
                    .eq('id', editingNote.id)
                    .eq('user_id', userId); // Ensure user owns the note

                if (error) throw error;
                setEditingNote(null);
            } else {
                const {error} = await supabase
                    .from('notes')
                    .insert([{title, content, user_id: userId}]);

                if (error) throw error;
            }
            setError(null);
            refetch();
        } catch (error) {
            console.error('Error saving note:', error);
            setError('Failed to save note. Please try again.');
        }
    };

    const handleEdit = (note: { id: number; title: string; content: string }) => {
        setEditingNote(note);
        setError(null);
    };

    const handleDelete = async (id: number) => {
        try {
            const {error} = await supabase
                .from('notes')
                .delete()
                .eq('id', id)
                .eq('user_id', userId); // Ensure user owns the note

            if (error) throw error;
            setError(null);
            refetch();
        } catch (error) {
            console.error('Error deleting note:', error);
            setError('Failed to delete note. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto p-4">
                    <Card className="mb-6">
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-4 w-1/2" />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <NoteEditor
                            onSubmit={handleAdd}
                            initialTitle={editingNote?.title || ''}
                            initialContent={editingNote?.content || ''}
                            apiKey={process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || ''}
                        />
                    </CardContent>
                </Card>
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