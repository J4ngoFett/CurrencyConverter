export function fetchData<T = unknown>(url: string, params?: Record<string, string | number>): Promise<T> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const searchParams = params
        ? Object.entries(params)
        .reduce((sParams, [key, value]) => {
            sParams.set(key, value.toString());

            return sParams;
        }, new URLSearchParams())
        : new URLSearchParams();

        xhr.open(
            'GET', 
            `${url}${params ? `?${searchParams.toString()}` : ''}`, 
            true);
        xhr.responseType = 'json';

        xhr.onerror = () => reject (new Error('Network error'));
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };

        xhr.send();
    });
}