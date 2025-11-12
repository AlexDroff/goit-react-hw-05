import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import styles from "./App.module.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();
  const perPage = 12;

  // --- useQuery для нотаток
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", { search: debouncedSearch, page, perPage }],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage }),
    staleTime: 5000,
  });

  // --- useMutation для створення нотатки
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  // --- useMutation для видалення нотатки
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleCreateNote = (values: {
    title: string;
    content?: string;
    tag: NoteTag;
  }) => {
    createNoteMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={search} onChange={setSearch} />{" "}
        {/* білий фон у SearchBox */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        )}
        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes</p>}

      {data?.notes?.length ? (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      ) : (
        !isLoading && <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
