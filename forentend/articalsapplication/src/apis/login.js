import { apiCaller, apis } from "./apiCaller";

export async function loginUser({ email, password }) {
    let response = await apiCaller.post({
        url: apis.Urls.login,
        body: {
            email: email,
            password: password
        }
    });
    return response;
};

export async function newUser({ name, password, email }) {
    let response = await apiCaller.post({
        url: apis.Urls.signup,
        body: {
            email: email,
            password: password,
            name: name
        }
    });
    return response;
};

export async function validUser() {
    let response = await apiCaller.get({
        url: apis.Urls.validuser
    });
    return response;
};