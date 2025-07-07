import { useState, useEffect } from 'react';
import { createarticle, deletearticle, editarticle, getarticles } from '../apis/articles';

export const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await getarticles();
            setArticles(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const createArticle = async (article) => {
        try {
            const newArticle = await createarticle(article);
            if (newArticle.status == "success") {
                setArticles(prev => {
                    return { ...prev, articles: [newArticle?.article, ...prev?.articles] };
                });
            }
            return newArticle;
        } catch (err) {
            throw err;
        }
    };

    const updateArticle = async (id, article) => {
        try {
            const updatedArticle = await editarticle({ id, ...article });
            if (updatedArticle.status == "success") {
                setArticles(prev => { return { ...prev, articles: prev?.articles?.map(a => a.id === id ? updatedArticle?.article : a) } });
            };
            return updatedArticle;
        } catch (err) {
            throw err;
        }
    };

    const deleteArticle = async (id) => {
        try {
            let response=await deletearticle({ id });
            if (response?.status=="success") {
                setArticles(prev => { return { ...prev, articles: prev?.articles?.filter(a => a.id !== id) } });
            }
            return response;
        } catch (err) {
            throw err;
        }
    };

    return {
        articles,
        loading,
        error,
        createArticle,
        updateArticle,
        deleteArticle,
        refetch: fetchArticles
    };
};
