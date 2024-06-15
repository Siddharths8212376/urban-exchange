import { Message } from "./Message.model";
import { User } from "./user.model";

export interface Chat {
    _id: string;
    buyer: string;
    buyerInfo: User;
    sellerInfo: User;
    seller: string;
    messages: Message[];
    unread: number;
    unreadBy: string;
    prodId: string;
    partner: User;
    lastMessage: string;
}