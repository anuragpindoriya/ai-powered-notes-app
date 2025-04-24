'use client';

import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Note} from '@/types/note';
import axios from 'axios';

interface AddEditNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note?: Note;
    onSave: (title: string, content: string) => void;
}

export function AddEditNoteDialog({open, onOpenChange, note, onSave}: AddEditNoteDialogProps) {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(title, content);
    };

    const handleSummarize = async () => {
        if (!content.trim()) return;

        setIsSummarizing(true);
        try {
            const response = await axios.post('/api/summarize', {text: content});

            setContent(response?.data?.summary);
        } catch (error) {
            console.error('Failed to summarize:', error);
            alert('Failed to summarize the text. Please try again.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{note ? 'Edit Note' : 'Add Note'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                            Content
                        </label>
                        {isSummarizing ? (
                            <Skeleton className="h-24 w-full rounded-lg"/>
                        ) : (
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter note content"
                                required
                                className="min-h-[100px]"
                            />
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleSummarize}
                            disabled={isSummarizing || !content}
                        >
                            {isSummarizing ? 'Summarizing...' : 'Summarize'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {note ? 'Update' : 'Add'} Note
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
