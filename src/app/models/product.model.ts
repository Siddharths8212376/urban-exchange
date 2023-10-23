export interface Product {
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
}