import React from "react";
import "./Table.css";

function buildPageList(current, total, delta = 2) {
  if (!total || total <= 0) return [];
  if (total === 1) return [1];

  const pages = new Set();
  pages.add(1);
  pages.add(total);

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
}

const Table = ({
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const pages = buildPageList(currentPage, safeTotalPages);

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="table-spinner"></div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                onClick={row._rowonClick || undefined}
                style={
                  row._rowonClick
                    ? { cursor: "pointer" }
                    : undefined
                }
                className={row._rowonClick ? "clickable-row" : ""}
              >
                {columns.map((col) => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#888",
                  fontSize: "15px",
                }}
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {safeTotalPages > 0 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Prev
          </button>

          {pages.map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 4px",
                  fontSize: "14px",
                  color: "#888",
                  letterSpacing: "2px",
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`page-number ${currentPage === page ? "active" : ""}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="page-btn"
            disabled={currentPage === safeTotalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;