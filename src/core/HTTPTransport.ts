enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type RequestOptions = {
    method?: METHODS
    headers?: Record<string, string>
    timeout?: number
    data?: unknown
};

type RequestData = Record<string, string | number>;

function queryStringify(data: RequestData) {
    if (!data) return '';
    return Object.entries(data).reduce((acc, [key, value], index, arr) => {
        return `${acc}${key}=${value}${index < arr.length - 1 ? '&' : ''}`;
    }, '?');
}

class HTTPTransport {
    public get = (url: string, options = {}) => {
        return this.request(url, {...options, method: METHODS.GET});
    };

    public post = (url: string, options = {}) => {
        return this.request(url, {...options, method: METHODS.POST});
    };

    public put = (url: string, options = {}) => {
        return this.request(url, {...options, method: METHODS.PUT});
    };

    public patch = (url: string, options = {}) => {
        return this.request(url, {...options, method: METHODS.PATCH});
    };

    public delete = (url: string, options = {}) => {
        return this.request(url, {...options, method: METHODS.DELETE});
    };

    request = (url: string, options: RequestOptions) => {
        const {
            method = METHODS.GET,
            headers = {},
            data,
            timeout = 5000,
        } = options;

        const query = method === METHODS.GET ? queryStringify(data as RequestData) : '';

        return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                if (method === METHODS.GET && data) {
                    xhr.open(method, `${url}${queryStringify(data as RequestData)}`);
                } else {
                    xhr.open(method, url)
                }

                Object.entries(headers).forEach(([header, val]) => xhr.setRequestHeader(header, val))

                xhr.onload = function () {
                    resolve(xhr);
                };

                xhr.onabort = reject;
                xhr.onerror = reject;

                xhr.timeout = timeout;
                xhr.ontimeout = reject;

                if (method === METHODS.GET || !data) {
                    xhr.send();
                } else {
                    xhr.send(JSON.stringify(data));
                }
            }
        );
    };
}

export default new HTTPTransport();
