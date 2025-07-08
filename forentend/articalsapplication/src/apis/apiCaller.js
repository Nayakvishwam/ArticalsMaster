import { getLocalStorage } from "../tools/tools";


export function domainName() {
    return window.location.origin;
};

const isLocal = false

const apiUrl = isLocal ? "http://localhost:4000" : "https://articalsmaster-production.up.railway.app"

export const apis = {
    Urls: {
        login: apiUrl + "/auth/login",
        signup: apiUrl + "/auth/signup",
        validuser: apiUrl + "/auth/validuser",
        articles: apiUrl + "/articles/"
    }
};

export const apiCaller = {
    passbody: async (params) => {
        return params.method != "GET" ? { body: JSON.stringify(params.body) } : {}
    },
    callapi: async (params) => {
        const body = await apiCaller.passbody(params);
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append('Content-Type', 'application/json');
        let token = getLocalStorage("token");
        if (token) {
            headers.append("Authorization", "Bearer " + token);
        }
        if (params.method == "GET" && params.headers) {
            Object.keys(params.headers).map(header => {
                headers.append(header, params.headers[header]);
            })
        }
        const response = await fetch(params.url, {
            method: params.method,
            headers: headers,
            ...body
        }).then((response) => response.json())
        return response;
    },
    get: async (params) => {
        params.method = "GET";
        const response = await apiCaller.callapi(params);
        return response;
    },
    post: async (params) => {
        params.method = "POST";
        const response = await apiCaller.callapi(params);
        return response;
    },
    delete: async (params) => {
        params.method = "DELETE";
        const response = await apiCaller.callapi(params);
        return response;
    },
    put: async (params) => {
        params.method = "PUT";
        const response = await apiCaller.callapi(params);
        return response;
    },
};