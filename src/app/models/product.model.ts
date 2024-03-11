export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    note?: string;
    modelNo: string;
    category: string;
    seller: string;
    boughtBy?: string;
    tag: string;
    productImages: string[];
    address?: {
        location: {
            type: string;
            coordinates: number[];
        },
        state: string;
        pin: string;
        meta: {
            postalLocation: string;
            district: string;
            province: string;
            state: string;
        }[];
    };
    created: Date;
    lastUpdated: Date;
    sellerUname: string;
}