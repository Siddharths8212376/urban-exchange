import { Product } from "../models/product.model";

export const defaultProduct: Product = {
    _id: '',
    name: '',
    sellerUname: '',
    price: 0,
    description: '',
    modelNo: '',
    category: '',
    seller: '',
    tag: '',
    productImages: [],
    created: new Date(),
    lastUpdated: new Date(),
}