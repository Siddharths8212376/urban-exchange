import { Product } from "./product.model";

export interface User {
    email: string;
    idToken: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
    provider?: string;
    _id?: string;
    productsListed?: Product[];
    productsPurchased?: Product[];
    wishlist?: Product[],
    chatList?: any[],
    lastLogin?: Date;
    lastActive?: Date;
}