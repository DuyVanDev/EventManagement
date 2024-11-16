import moment from 'moment';


export function CalculateTimeAgo(fromTimestamp) {
    try {
        // Chuyển đổi mốc thời gian đầu vào sang định dạng moment.
        const fromDate = moment(fromTimestamp);
        const toDate = moment(); // Sử dụng thời gian hiện tại.

        // Kiểm tra nếu ngày tháng không hợp lệ.
        if (!fromDate.isValid()) {
            throw new Error('Ngày tháng không hợp lệ');
        }

        // Tính toán khoảng thời gian giữa hai mốc thời gian (đơn vị là giây).
        const timeDifference = toDate.diff(fromDate, 'second');

        // Kiểm tra và trả về kết quả dựa trên khoảng thời gian tính được.
        if (timeDifference < 60) {
            return `${timeDifference} giây trước`;
        } else if (timeDifference < 3600) {
            const minutes = Math.floor(timeDifference / 60);
            return `${minutes} phút trước`;
        } else if (timeDifference < 86400) {
            const hours = Math.floor(timeDifference / 3600);
            return `${hours} giờ trước`;
        } else if (timeDifference < 2592000) {
            const days = Math.floor(timeDifference / 86400);
            return `${days} ngày trước`;
        } else if (timeDifference < 31536000) {
            const months = Math.floor(timeDifference / 2592000);
            return `${months} tháng trước`;
        } else {
            const years = Math.floor(timeDifference / 31536000);
            return `${years} năm trước`;
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
        return null;
    }
}

// Ví dụ sử dụng:

