"use client";

import { useState, useEffect } from 'react';
import ArticleCard from '../../../components/ArticleCard';
import ArticleHistory from '../../../components/ArticleHistory';
import { useArticles } from '../../../hooks/useArticles';
import { getLocalStorage } from '../../../tools/tools';
import ArticleForm from '../../../components/ArticleForm';

export default function Articles() {
    let user = getLocalStorage('user');
    const { articles, loading, error, createArticle, updateArticle, deleteArticle } = useArticles();
    const [showForm, setShowForm] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [showHistory, setShowHistory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    user=JSON.parse(user)||user;
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'create') {
            setShowForm(true);
        }
    }, []);

    const handleCreateArticle = () => {
        setEditingArticle(null);
        setShowForm(true);
    };

    const handleEditArticle = (article) => {
        setEditingArticle(article);
        setShowForm(true);
    };

    const handleViewHistory = (article) => {
        setShowHistory(article);
    };

    const handleSubmitArticle = async (formData) => {
        setIsSubmitting(true);
        try {
            if (editingArticle) {
                await updateArticle(editingArticle.id, formData);
            } else {
                await createArticle(formData);
            }
            setShowForm(false);
            setEditingArticle(null);
        } catch (error) {
            console.error('Error saving article:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingArticle(null);
    };

    const filteredArticles = articles?.articles?.filter(article => {
        const matchesSearch = article?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article?.content?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterBy === 'my') {
            return matchesSearch && article?.createdBy === user.id;
        }

        return matchesSearch;
    });

    if (!user) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
                    <p className="text-gray-600 mt-2">Manage your articles and content</p>
                </div>
                <button
                    onClick={handleCreateArticle}
                    className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Article
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <ArticleForm
                        article={editingArticle}
                        onSubmit={handleSubmitArticle}
                        onCancel={handleCancelForm}
                        isLoading={isSubmitting}
                    />
                </div>
            )}

            {!showForm && (
                <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Articles</option>
                                    <option value="my">My Articles</option>
                                </select>

                                <div className="text-sm text-gray-600">
                                    {filteredArticles?.length} article{filteredArticles?.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading articles...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12 text-red-600">
                            <p>Error loading articles: {error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles?.map((article) => (
                                <ArticleCard
                                    key={article?.id}
                                    article={article}
                                    onEdit={handleEditArticle}
                                    onDelete={deleteArticle}
                                    onViewHistory={handleViewHistory}
                                    currentUser={user}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && !error && filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first article'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleCreateArticle}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create Article
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {showHistory && (
                <ArticleHistory
                    article={showHistory}
                    onClose={() => setShowHistory(null)}
                />
            )}
        </div>
    );
}
