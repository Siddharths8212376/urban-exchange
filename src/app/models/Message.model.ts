export interface Message {
    sender: string | undefined;
    messageText: string;
    receiver: string | undefined;
    postedTime: Date;
}