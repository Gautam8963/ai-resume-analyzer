import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Award, TrendingUp, CheckCircle, AlertCircle, Home } from 'lucide-react';

const InterviewFeedback = () => {
    const { id } = useParams();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterviewResult();
    }, [id]);

    const fetchInterviewResult = async () => {
        try {
            const response = await api.get(`/interview/result/${id}`);
            setInterview(response.data.interview);
        } catch (error) {
            console.error('Failed to fetch interview result:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-900">Interview not found</p>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Interview Complete! 🎉
                    </h1>
                    <p className="text-gray-600">
                        Here's your detailed performance analysis
                    </p>
                </div>

                {/* Overall Score */}
                <div className={`card mb-8 border-2 ${getScoreBg(interview.overallScore)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-700 mb-2">Overall Interview Score</p>
                            <p className={`text-5xl font-bold ${getScoreColor(interview.overallScore)}`}>
                                {interview.overallScore}%
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Role: {interview.role}
                            </p>
                        </div>
                        <Award className={`w-24 h-24 ${getScoreColor(interview.overallScore)} opacity-20`} />
                    </div>
                </div>

                {/* Question-by-Question Breakdown */}
                <div className="space-y-6">
                    {interview.questions.map((q, index) => (
                        <div key={index} className="card">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-2">Question {index + 1}</p>
                                    <p className="text-lg font-medium text-gray-900 mb-4">
                                        {q.question}
                                    </p>
                                </div>
                                <div className={`text-2xl font-bold ${getScoreColor(q.evaluation?.score || 0)} ml-4`}>
                                    {q.evaluation?.score || 0}%
                                </div>
                            </div>

                            {/* User Answer */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
                                <p className="text-gray-900">{q.userAnswer || 'No answer provided'}</p>
                            </div>

                            {/* Feedback */}
                            {q.evaluation && (
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Feedback</p>
                                            <p className="text-sm text-gray-700">{q.evaluation.feedback}</p>
                                        </div>
                                    </div>

                                    {q.evaluation.keywords && q.evaluation.keywords.length > 0 && (
                                        <div className="flex items-start space-x-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-2">Key Topics Covered</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.evaluation.keywords.map((keyword, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-center space-x-4">
                    <Link to="/interview/role-selection" className="btn-primary">
                        Take Another Interview
                    </Link>
                    <Link to="/dashboard" className="btn-secondary flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InterviewFeedback;
