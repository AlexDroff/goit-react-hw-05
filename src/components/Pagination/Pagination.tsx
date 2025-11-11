import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={"←"}
      nextLabel={"→"}
      breakLabel={"..."}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      forcePage={page - 1}
      onPageChange={(selected) => onPageChange(selected.selected + 1)}
      containerClassName={styles.pagination}
      pageClassName={styles.page}
      pageLinkClassName={styles.pageLink}
      activeClassName={styles.active}
      previousClassName={`${styles.page} ${page === 1 ? styles.disabled : ""}`}
      nextClassName={`${styles.page} ${
        page === totalPages ? styles.disabled : ""
      }`}
      breakClassName={styles.page}
    />
  );
};

export default Pagination;
