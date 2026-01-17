import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const JobMatchModal = ({ isOpen, onClose, resumeId }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError('Please paste a job description');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/resume/match-job', {
                resumeId,
                jobDescription,
            });

            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze match');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setJobDescription('');
        setResult(null);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-900">Match with Job Description</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {!result ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paste Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                placeholder="Paste the job description here..."
                            />

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="mt-4 btn-primary w-full disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Analyze Match'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Match Score */}
                            <div className="text-center border-b pb-6">
                                <div className="text-6xl font-bold text-blue-600 mb-2">{result.matchScore}%</div>
                                <p className="text-gray-600">
                                    {result.totalMatching} out of {result.totalRequired} skills matched
                                </p>
                            </div>

                            {/* Matching Skills */}
                            {result.matchingSkills && result.matchingSkills.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <h3 className="font-semibold text-gray-900">Matching Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchingSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing Skills */}
                            {result.missingSkills && result.missingSkills.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <h3 className="font-semibold text-gray-900">Missing Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {result.recommendations && result.recommendations.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Recommendations</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {result.recommendations.map((rec, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <span className="text-blue-600 mt-1">•</span>
                                                <span className="text-gray-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setJobDescription('');
                                    }}
                                    className="flex-1 btn-secondary"
                                >
                                    Try Another Job
                                </button>
                                <button onClick={handleClose} className="flex-1 btn-primary">
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

JobMatchModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    resumeId: PropTypes.string.isRequired,
};

export default JobMatchModal;
