import envConfig from "@/config";

export const sendNotification = async ({message , userIds , eventId } : {message : string, userIds : any, eventId : number}) => {
    const response = await fetch(`${envConfig.NEXT_PUBLIC_BASE_URL}/notifications/sendNotification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            userIds: userIds, // Truyền danh sách UserIds
            eventId: eventId, // Truyền danh sách UserIds
        }),
    });

    if (response.ok) {
        console.log('Notification sent!');
    } else {
        console.error('Failed to send notification');
    }
};