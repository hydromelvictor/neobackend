interface JsonResponse<T = any> {
    success: boolean;
    message: string;
    target?: string;
    data?: T,
    error?: string
}


export { JsonResponse };
