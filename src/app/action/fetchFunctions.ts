export async function fetchMethod(data: object, func: string) {
  try {
    // Tạo object dataPost với tham số data chuyển thành chuỗi JSON
    const dataPost = {
      Json: JSON.stringify(data)  // Chuyển object data thành chuỗi JSON
    };

    // Gọi API với POST request
    const response = await fetch("http://localhost:5097/api/StoredProcedure/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        procedureName: func,  // Tên stored procedure
        inputParameters: dataPost  // Đối tượng chứa JSON string của data
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
    }

    // Lấy dữ liệu JSON trả về từ API
    const jsonData = await response.json();

    // Parse dữ liệu từ `returnMess` nếu nó là chuỗi JSON
    const parsedReturnMess = JSON.parse(jsonData.returnMess);

    return parsedReturnMess;  // Trả về dữ liệu đã parse
  } catch (error) {
    console.error("API call failed: ", error);
    throw error;
  }
}
