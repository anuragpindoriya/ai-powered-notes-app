interface Note {
    id: number;
    title: string;
    content: string;
}

interface NoteCardProps {
    note: Note;
    onDelete: (id: number) => void;
    onEdit: (note: Note) => void;
}

export function NoteCard({note, onDelete, onEdit}: NoteCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p className="text-gray-600 mt-2">{note.content}</p>
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => onEdit(note)}
                    className="text-blue-500 hover:underline"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(note.id)}
                    className="text-red-500 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}