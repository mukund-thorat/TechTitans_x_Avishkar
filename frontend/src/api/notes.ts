import { api } from "./client";

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    tags: string | null;
    createdAt: string;
}

export interface NoteCreate {
    title: string;
    content: string;
    tags?: string;
}

export interface NoteUpdate {
    title?: string;
    content?: string;
    tags?: string;
}

export const notesApi = {
    getAll: () => api.get<Note[]>("/notes/"),
    getById: (id: string) => api.get<Note>(`/notes/${id}`),
    create: (data: NoteCreate) => api.post<Note>("/notes/", data),
    update: (id: string, data: NoteUpdate) => api.patch<Note>(`/notes/${id}`, data),
    generate: (url: string) => api.post<Note>("/notes/generate", { url }),
    delete: (id: string) => api.delete<{ message: string }>(`/notes/${id}`),
};
