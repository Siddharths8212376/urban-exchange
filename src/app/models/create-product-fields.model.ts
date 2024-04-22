export interface CreateFields {
    label: string;
    fieldName: string;
    type: string;
    required: boolean;
    multiple: boolean;
    options?: any[];
    metadata?: { category: string, fields: CreateFields[] }[];
}