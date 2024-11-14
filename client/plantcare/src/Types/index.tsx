export type userTypes={
    id?: string;
    email: string;
    name: string;
    password: string;
    profilePhoto?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    plants?: PlantType[];
    reminders?: careReminderTypes[];
    careReminder?: careReminderTypes;
    posts?: postTypes[];
    comments?: commentTypes[];
    rooms?: roomTypes[];
    sentMessages?: messageType[];
    receivedMssages?: messageType[];
    messages?: messageType[];
    healthLogs?: plantHealthLogTypes[];
    user?: any;
   
};

export type PlantType = {
    id?: string;
    name: string;
    species?: string;
    wateringFrequency?: string;
    lastWatered?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    user?: userTypes;
}

export type careReminderTypes = {
    id: string; 
    reminderDate: Date;
    plantId: number;
    reminderType: string;
    nextReminder: Date;
    createdAt:Date;
    updatedAt: Date;
    description: string;
    user: userTypes;
    plant: PlantType;
}

export type commentTypes = {
    id: number;
    content: string;
    createdAt: Date;
    author: userTypes;
    post?: postTypes;
}

export type postTypes = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: userTypes;
    comments: commentTypes;
}

export type messageTypes = {
    id: number;
    content: string;
    createdAt: Date;
    sender: userTypes;
    recipient: userTypes;
    user: userTypes;
    masageuser: userTypes;
    room: roomTypes;

}
export type roomTypes={

    id: number;
    name: string;
    description?: string;
    creator: userTypes;
    users: userTypes[];
    posts: postTypes[];
    messages: messageType[];
}

export type messageType = {
    id: number;
    content: string;
    createdAt: Date;
    sender: userTypes;
    recipient: userTypes;
    user: userTypes;
    masageuser:userTypes;
    room: roomTypes;
}

export type feedbackTypes = {
    id: number;
    message: string;
    healthLog: plantHealthLogTypes;
}

export type plantHealthLogTypes = {
    id: string
    leafColor?: string;
    growthProgress?: string;
    moistureLevel?: string;
    pestPresence?: string;
    otherNotes?: string;
    observationDate: Date;
    plant:PlantType | null;
    user: userTypes | null;
    feedbacks:feedbackTypes[];
}



