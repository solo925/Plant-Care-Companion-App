export interface userTypes{
    id?: string;
    email?: string;
    name?: string;
    password?: string;
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
    recipient?: userTypes;
   
};

export interface PlantType {
    id?: string;
    name?: string;
    species?: string;
    imageUrl?: string;
    description?:string;
    wateringFrequency?: string;
    lastWatered?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    user?: userTypes;
}
export interface careReminderTypes{
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

export interface commentTypes{
    id: number;
    content: string;
    createdAt: Date;
    author: userTypes;
    post?: postTypes;
    image?: string;
}

export interface postTypes{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: userTypes;
    comments: commentTypes;
    likes?: number;
    imageUrl?: any;
}

export interface roomTypes{
    id?: number;
    name?: string;
    description?: string;
    creator?: userTypes;
    users?: userTypes[];
    posts?: postTypes[];
    messages?: messageType[];
}

export interface messageType{
    id?: number;
    content?: string;
    image?: string;
    createdAt?: Date;
    sender?: userTypes |null | undefined;
    recipient?: userTypes;
    user?: userTypes;
    masageuser?:userTypes;
    room?: roomTypes[];
    replyTo?: string | undefined |null;
}
export interface feedbackTypes{
    id: number;
    message: string;
    healthLog: plantHealthLogTypes;
}

export interface plantHealthLogTypes{
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



