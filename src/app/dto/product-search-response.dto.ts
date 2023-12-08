import { Product } from "../models/product.model";

export interface ProductSearchResponse extends Product {
    score?: number;
}