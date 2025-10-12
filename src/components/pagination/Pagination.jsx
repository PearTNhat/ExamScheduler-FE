import { memo } from "react";
import clsx from "clsx"; // Thư viện tiện ích để nối các class name có điều kiện
import { DOTS, usePagination } from "~/hooks/usePagination";

function Pagination({
  siblingCount = 1,
  currentPage,
  totalPageCount,
  onPageChange,
}) {
  const paginationRange = usePagination({
    siblingCount,
    currentPage,
    totalPageCount,
  });
  // Nếu chỉ có 1 trang hoặc không có item nào, không hiển thị pagination
  if (currentPage === 0) {
    return null;
  }
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const lastPage = paginationRange?.[paginationRange?.length - 1];

  return (
    <nav aria-label="Page navigation">
      <ul className="flex items-center justify-center gap-1 md:gap-2 py-4">
        {/* Nút Previous */}
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={onPrevious}
            className={clsx(
              "w-9 h-9 md:w-10 md:h-10 flex justify-center items-center text-gray-500 bg-white border border-gray-300 rounded-full shadow-sm transition-all duration-150",
              "hover:bg-blue-100 hover:text-blue-600",
              {
                "cursor-not-allowed text-gray-400 bg-gray-100 border-gray-200":
                  currentPage === 1,
              }
            )}
            aria-label="Trang trước"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </li>

        {/* Các nút số trang */}
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li key={`dots-${index}`}>
                <span className="w-9 h-9 md:w-10 md:h-10 flex justify-center items-center text-gray-400 bg-white border border-gray-200 rounded-full select-none">
                  ...
                </span>
              </li>
            );
          }
          return (
            <li key={pageNumber}>
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={clsx(
                  "w-9 h-9 md:w-10 md:h-10 flex justify-center items-center font-semibold border border-gray-200 rounded-full transition-all duration-150",
                  {
                    "bg-blue-600 text-white border-blue-600 shadow-md scale-110 z-10":
                      currentPage === pageNumber,
                    "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600":
                      currentPage !== pageNumber,
                  }
                )}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Nút Next */}
        <li>
          <button
            type="button"
            disabled={currentPage === lastPage}
            onClick={onNext}
            className={clsx(
              "w-9 h-9 md:w-10 md:h-10 flex justify-center items-center text-gray-500 bg-white border border-gray-300 rounded-full shadow-sm transition-all duration-150",
              "hover:bg-blue-100 hover:text-blue-600",
              {
                "cursor-not-allowed text-gray-400 bg-gray-100 border-gray-200":
                  currentPage === lastPage,
              }
            )}
            aria-label="Trang sau"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default memo(Pagination);
