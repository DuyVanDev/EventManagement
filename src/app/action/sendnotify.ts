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


export const sendMail = async ({toEmail , subject , body } : {toEmail : string, subject : string, body : string}) => {
    const response = await fetch(`${envConfig.NEXT_PUBLIC_BASE_URL}/Email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            toEmail: toEmail,
            subject: subject, // Truyền danh sách UserIds
            body: body, // Truyền danh sách UserIds
        }),
    });

    if (response.ok) {
        console.log('Notification sent!');
    } else {
        console.error('Failed to send notification');
    }
};


