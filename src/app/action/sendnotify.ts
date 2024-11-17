import envConfig from "@/config";

export const sendNotification = async (message : string, userIds : any) => {
    const response = await fetch(`${envConfig.NEXT_PUBLIC_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Message: message,
            UserIds: userIds, // Truyền danh sách UserIds
        }),
    });

    if (response.ok) {
        console.log('Notification sent!');
    } else {
        console.error('Failed to send notification');
    }
};