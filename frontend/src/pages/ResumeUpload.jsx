import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeUpload = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a PDF or DOCX file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Redirect to analysis page
            navigate(`/analysis/${response.data.resumeId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Upload Your Resume
                    </h1>
                    <p className="text-gray-600">
                        Get instant AI-powered analysis and improvement suggestions
                    </p>
                </div>

                <div className="card">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                            }`}
                    >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
                                <p className="text-lg font-medium text-gray-900">Uploading and analyzing...</p>
                                <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-900 mb-2">
                                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    or click to browse files
                                </p>
                                <p className="text-xs text-gray-500">
                                    Supports PDF and DOCX (max 5MB)
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="mt-8 grid md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Skill Extraction</p>
                                <p className="text-xs text-gray-600">AI identifies your key skills</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Score Analysis</p>
                                <p className="text-xs text-gray-600">Get your resume score</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Improvements</p>
                                <p className="text-xs text-gray-600">Actionable suggestions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
