interface JsonResponse<T = any> {
    success: boolean;
    message: string;
    data?: T,
    error?: string
}

export { JsonResponse };
