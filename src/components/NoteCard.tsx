import {Pencil, Trash2} from "lucide-react";
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

interface Note {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface NoteCardProps {
    note: Note;
    onDelete: (id: number) => void;
    onEdit: (note: Note) => void;
}

export function NoteCard({note, onDelete, onEdit}: NoteCardProps) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-800">{note.title}</h3>
                    <span className="text-sm text-zinc-500">
          {new Date(note.created_at).toLocaleDateString()}
                    </span>
                </div>

                <p className="mt-2 text-zinc-600 line-clamp-4">{note.content}</p>
            </div>


            <div className="mt-4 flex gap-4 text-sm">
                <button
                    onClick={() => onEdit(note)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <Pencil className="h-4 w-4"/> Edit
                </button>

                {/*<button*/}
                {/*    onClick={() => onDelete(note.id)}*/}
                {/*    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"*/}
                {/*>*/}
                {/*    <Trash2 className="h-4 w-4"/> Delete*/}
                {/*</button>*/}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="inline-flex items-center gap-1 text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4"/> Delete
                        </button>
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
                            <AlertDialogAction onClick={() => onDelete(note.id)}
                                               className={' bg-red-600 text-white hover:bg-red-800'}>
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
