import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../redux/postSlice';
import axios from 'axios';

function PostForm() {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState('');
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file); // Changed from 'media' to 'file'
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, config);
            setMedia(data.filePath || data); // Extract filePath
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createPost({ content, media }));
        setContent('');
        setMedia('');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                        rows="4"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="flex items-center justify-center w-full p-4 border border-dashed border-gray-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer group">
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="hidden"
                        />
                        <div className="text-center">
                            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📷</span>
                            <span className="text-sm text-gray-500 group-hover:text-slate-600 font-medium">
                                {uploading ? 'Uploading...' : 'Add Photo or Video'}
                            </span>
                        </div>
                    </label>
                    {media && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
                            <span className="text-emerald-600 mr-2">✓</span>
                            <span className="text-sm text-emerald-700 font-medium">Media uploaded successfully!</span>
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostForm;
