import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
})

const confirmAlert = ({ message, title, confirmText }) => {
    return Swal.fire({
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        confirmButtonColor: '#ee3131'
    })
}
const showAlertSuccess = (message) => {
    Swal.fire({
        title: 'Thành công',
        text: message,
        icon: 'success'
    })
}
const showAlertInfo = (message) => {
    Swal.fire({
        title: 'Thông tin',
        text: message,
        icon: 'info'
    })
}

const showAlertError = (message) => {
    Swal.fire({
        title: 'Lỗi',
        text: message,
        icon: 'error'
    })
}

const showToastSuccess = (message) => {
    Toast.fire({
        icon: 'success',
        title: message
    })
}

/**
 * Hiển thị toast cảnh báo.
 * @param {string} message - Nội dung tin nhắn.
 */
const showToastWarning = (message) => {
    Toast.fire({
        icon: 'warning',
        title: message
    })
}

/**
 * Hiển thị toast lỗi.
 * @param {string} message - Nội dung tin nhắn.
 */
const showToastError = (message) => {
    Toast.fire({
        icon: 'error',
        title: message
    })
}

/**
 * Hiển thị dialog xác nhận.
 * @param {string} message - Nội dung tin nhắn.
 */
const showToastConfirm = (message) => {
    return Swal.fire({
        title: 'Xác nhận',
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => result.isConfirmed);
}

export {
    showAlertInfo,
    showToastSuccess,
    showToastError,
    showToastWarning,
    showAlertError,
    showAlertSuccess,
    confirmAlert, // Đã sửa tên hàm từ confirmAleart -> confirmAlert
    showToastConfirm
}