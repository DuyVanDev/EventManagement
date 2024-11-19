export function GeneratePassword(length : number) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"; // Dãy ký tự có thể dùng trong mật khẩu
    let password = "";
    
    // Chạy vòng lặp để tạo mật khẩu với độ dài yêu cầu
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length); // Lấy chỉ số ngẫu nhiên trong charset
      password += charset[randomIndex]; // Thêm ký tự vào mật khẩu
    }
    
    return password;
  }