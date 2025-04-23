import {useEffect, useState} from "react";
import {summarizeText} from "@/lib/summarize";

interface NoteEditorProps {
    onSubmit: (title: string, content: string) => void;
    initialTitle?: string;
    initialContent?: string;
    apiKey: string;
}

// To get a free API key:
// 1. Go to https://huggingface.co/
// 2. Sign up for a free account
// 3. Go to Settings -> Access Tokens
// 4. Create a new token
// 5. Copy the token and use it as the apiKey prop

export function NoteEditor({onSubmit, initialTitle = '', initialContent = '', apiKey}: NoteEditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent);
    }, [initialTitle, initialContent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(title, content);
        setTitle('');
        setContent('');
    };

    const handleSummarize = async () => {
        if (!content.trim()) return;

        setIsSummarizing(true);
        try {
            const summary = await summarizeText(content, apiKey);
            setContent(summary);
        } catch (error) {
            console.error('Failed to summarize:', error);
            alert('Failed to summarize the text. Please try again.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4 mb-6"
        >
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                rows={4}
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    {initialTitle ? 'Update Note' : 'Add Note'}
                </button>
                <button
                    type="button"
                    onClick={handleSummarize}
                    disabled={isSummarizing || !content.trim()}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSummarizing ? 'Summarizing...' : 'Summarize'}
                </button>
            </div>
        </form>
    );
}