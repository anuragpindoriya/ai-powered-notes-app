'use client';

import {useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {AddEditNoteDialog} from '@/components/AddEditNoteDialog';
import {Note} from '@/types/note';
import {Pencil, Trash2} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string, content: string) => void;
}

export function NoteCard({note, onDelete, onUpdate}: NoteCardProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleSave = (title: string, content: string) => {
        onUpdate(note.id, title, content);
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <Card className={'flex justify-between'}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{note.title}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground">{note.content}</p>

                </CardContent>
                <CardFooter>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="inline-flex items-center gap-1"
                        >
                            <Pencil className="h-4 w-4"/>
                            Edit
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="inline-flex items-center gap-1"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete your note titled <strong>{note.title}</strong>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(note.id)}
                                        className="bg-red-600 text-white hover:bg-red-800"
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardFooter>
            </Card>

            <AddEditNoteDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                note={note}
                onSave={handleSave}
            />
        </>
    );
}
