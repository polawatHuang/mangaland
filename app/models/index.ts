export interface BaseResponse {
    success: boolean;
    message: string;
    status: number;
    meta: Meta;
}

export interface Meta {
    timestamp: string;
}