import {useMutation, useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/lib/supabase';

export const useNotes = (userId: string) => {
    const queryClient = useQueryClient();

    const getNotes = async () => {
        const {data, error} = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', {ascending: false});
        if (error) throw error;
        return data;
    };


    const addNote = useMutation({
        mutationFn: async (note: { title: string; content: string; user_id: string }) => {
            const {data, error} = await supabase.from('notes').insert([note]);
            if (error) throw error;
            return data;
        },
        // @ts-ignore
        onSuccess: () => queryClient.invalidateQueries(['notes']),
    });

    const deleteNote = useMutation({
        mutationFn: async (id: number) => {
            const {error} = await supabase.from('notes').delete().eq('id', id);
            if (error) throw error;
        },
        // @ts-ignore
        onSuccess: () => queryClient.invalidateQueries(['notes']),
    });

    return {getNotes, addNote, deleteNote};
};
