import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/search?q=${query}`);
            setResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
        setSearching(false);
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        setQuery('');
        setShowResults(false);
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-md mx-auto mb-6">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowResults(true)}
                        placeholder="Search users..."
                        className="w-full px-5 py-2.5 rounded-lg border border-gray-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all shadow-sm pl-11 text-gray-700"
                    />
                    <span className="absolute left-3.5 top-3 text-gray-400 text-lg">🔍</span>
                    <button
                        type="submit"
                        className="absolute right-2 top-1.5 bg-slate-700 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        {searching ? '...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                    {results.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            className="p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Click outside to close */}
            {showResults && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowResults(false)}
                />
            )}
        </div>
    );
}

export default SearchBar;
