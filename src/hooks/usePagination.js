import { useMemo } from "react"
const DOTS = '...'
const usePagination = ({ siblingCount = 1, currentPage, totalPageCount }) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5 // 6 - 1  = 5
    if (totalPageCount <= totalPageNumbers) {
      return range(1, totalPageCount)
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1) // tinhs toan con trai va phai khi hien thi 2 dots
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)
    const shouldShowLeftDots = currentPage - siblingCount > 2 // [1,..,3,4] current = 4
    const shouldShowRightDots = currentPage + siblingCount < totalPageCount - 2 // [1,2,3,4,5,6,...,8] current = 2

    // sử dụng trả về số page khi không cần hiển thị 2 dots
    // tổng cộng là 5 do  1 dots đẻ hiển thị rồi
    const items = 3 + 2 * siblingCount
    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [1, DOTS, ...range(totalPageCount - items + 1, totalPageCount)]
    }
    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [...range(1, items), DOTS, totalPageCount]
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPageCount]
    }
  }, [siblingCount, currentPage, totalPageCount])
  return paginationRange
}

// first, last, current, sibling, 2 dots  => 6    // sibling    ...4,5,6...  sibling =  4, 5
const range = (from, to) => {
  const length = to - from + 1
  return Array.from({ length }, (_, idx) => idx + from)
}
export { usePagination, DOTS }