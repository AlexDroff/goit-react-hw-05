import type { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: { title: string; content?: string; tag: NoteTag }) => void;
  onClose: () => void;
}

const NoteForm: FC<NoteFormProps> = ({ onSubmit, onClose }) => {
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title cannot exceed 50 characters")
      .required("Please provide a title"),
    content: Yup.string().max(500, "Content cannot exceed 500 characters"),
    tag: Yup.mixed<NoteTag>()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
      .required("Please select a tag"),
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as NoteTag }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className={styles.input}
            />
            <ErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={6}
              className={styles.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage
              name="tag"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
