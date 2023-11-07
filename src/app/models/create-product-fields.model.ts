export interface CreateFields {
    label: string;
    fieldName: string;
    type: string;
    required: boolean;
    multiple: boolean;
    options?: string[];
}