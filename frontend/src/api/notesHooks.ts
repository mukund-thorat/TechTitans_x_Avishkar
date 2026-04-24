import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi, type NoteCreate, type NoteUpdate } from "./notes";

export const useNotesQuery = () => {
    return useQuery({
        queryKey: ["notes"],
        queryFn: notesApi.getAll,
    });
};

export const useNoteQuery = (id: string) => {
    return useQuery({
        queryKey: ["notes", id],
        queryFn: () => notesApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateNoteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: NoteCreate) => notesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

export const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: NoteUpdate }) => notesApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["notes", variables.id] });
        },
    });
};

export const useGenerateNoteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (url: string) => notesApi.generate(url),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};

export const useDeleteNoteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
};
