'use client';
import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import {NoteEditor} from '@/components/NoteEditor';
import {NoteCard} from '@/components/NoteCard';
import {useQuery} from '@tanstack/react-query';
import {Card, CardContent} from "@/components/ui/card";

export default function NotesPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState<{ id: number; title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(false);

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

    console.log(notes);

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

    return (<>
            {/*<div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">*/}
            {/* Header */}
            {/*<header*/}
            {/*    className="sticky top-0 z-50 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white/70">*/}
            {/*    <h1 className="text-2xl font-bold text-gray-800">AI Notes</h1>*/}
            {/*    <div className="flex items-center gap-4">*/}
            {/*        <Avatar>*/}
            {/*            <AvatarFallback>N</AvatarFallback>*/}
            {/*        </Avatar>*/}
            {/*        <Button variant="ghost">Logout</Button>*/}
            {/*    </div>*/}
            {/*</header>*/}

            {/* Note Input Section */}
            {/*<main className="p-6 max-w-4xl mx-auto">*/}
            {/*    <Card className="mb-6">*/}
            {/*        <CardContent className="p-6 space-y-4">*/}
            {/*            <Input placeholder="Title" className="text-lg"/>*/}
            {/*            <Textarea placeholder="Content" rows={6}/>*/}
            {/*            <div className="flex gap-4">*/}
            {/*                <Button>Add Note</Button>*/}
            {/*                <Button*/}
            {/*                    variant="secondary"*/}
            {/*                    onClick={() => setLoading(true)}*/}
            {/*                >*/}
            {/*                    {loading ? <Skeleton className="w-5 h-5 rounded-full"/> : "Summarize"}*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}

            {/*    /!* Notes Grid *!/*/}
            {/*    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">*/}
            {/*        {[1, 2, 3].map((note, i) => (*/}
            {/*            <Card key={i} className="hover:shadow-lg transition-shadow">*/}
            {/*                <CardContent className="p-4 space-y-2">*/}
            {/*                    <div className="flex items-center justify-between">*/}
            {/*                        <h2 className="text-lg font-semibold">Note Title</h2>*/}
            {/*                        <span className="text-sm text-gray-400">4/23/2025</span>*/}
            {/*                    </div>*/}
            {/*                    <p className="text-sm text-gray-600 line-clamp-3">*/}
            {/*                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.*/}
            {/*                    </p>*/}
            {/*                    <div className="flex gap-4 text-sm pt-2">*/}
            {/*                        <Button variant="link" className="p-0 text-blue-600">Edit</Button>*/}
            {/*                        <Button variant="link" className="p-0 text-red-500">Delete</Button>*/}
            {/*                    </div>*/}
            {/*                </CardContent>*/}
            {/*            </Card>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</main>*/}
            {/*</div>*/}
            <div className="min-h-screen bg-gray-100">
                {/*<Header/>*/}
                <div className="container mx-auto p-4">
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
        </>
    );
}