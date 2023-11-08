import { Product } from "../models/product.model";
import { DefaultResponse } from "./default-response.dto";

export interface ProductResponse extends DefaultResponse {
    page?: number;
    limit?: number;
    data: [{
        products: Product[],
        totalProducts: [{ count: number }]
    }]
}