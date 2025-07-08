const { apiCaller, apis } = require("./apiCaller");


export async function getarticles() {
    let response = await apiCaller.get({
        url: apis.Urls.articles
    });
    return response;
};

export async function createarticle({ title, content, status }) {
    let response = await apiCaller.post({
        url: apis.Urls.articles,
        body: {
            title,
            content,
            status
        }
    });
    return response;
};

export async function editarticle({ title, content, status, id }) {
    let response = await apiCaller.put({
        url: apis.Urls.articles + `${id}`,
        body: {
            title,
            content,
            status
        }
    });
    return response;
};

export async function deletearticle({ id }) {
    let response = await apiCaller.delete({
        url: apis.Urls.articles + `${id}`
    });
    return response;
};

export async function getarticleHistory(id) {
    let response = await apiCaller.get({
        url: apis.Urls.articles + `${id}/history/`
    });
    return response;
}