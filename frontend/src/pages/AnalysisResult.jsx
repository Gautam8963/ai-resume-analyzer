import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react';
import JobMatchModal from '../components/JobMatchModal';

const AnalysisResult = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showJobMatchModal, setShowJobMatchModal] = useState(false);

    useEffect(() => {
        fetchAnalysis();
    }, [id]);

    const fetchAnalysis = async () => {
        try {
            const response = await api.get(`/resume/analysis/${id}`);
            setAnalysis(response.data);
        } catch (error) {
            console.error('Failed to fetch analysis:', error);
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

    if (!analysis) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-900">Analysis not found</p>
                </div>
            </div>
        );
    }

    const { extractedData, analysis: analysisData } = analysis;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Resume Analysis Results
                    </h1>
                    <p className="text-gray-600">
                        AI-powered insights to improve your resume
                    </p>
                </div>

                {/* Score Card */}
                <div className="card mb-8 bg-blue-600 text-white">
                    <p className="text-blue-100 mb-2">Overall Resume Score</p>
                    <p className="text-5xl font-bold">{analysis?.score || 0}%</p>
                </div>

                {/* Role Classification */}
                {analysis.classifiedRole && (
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Classified Role</h2>
                        <p className="text-gray-600 mb-3">Best suited for:</p>
                        <div className="flex items-center space-x-3 mb-4">
                            <span className={`px-4 py-2 rounded font-semibold ${analysis.classifiedRole.includes('Frontend') ? 'bg-blue-100 text-blue-800' :
                                analysis.classifiedRole.includes('Backend') ? 'bg-green-100 text-green-800' :
                                    analysis.classifiedRole.includes('Full Stack') ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {analysis.classifiedRole}
                            </span>
                            <span className="text-sm text-gray-600">
                                {analysis.roleConfidence}% match
                            </span>
                        </div>
                        <button
                            onClick={() => setShowJobMatchModal(true)}
                            className="btn-primary"
                        >
                            Match with Job Description
                        </button>
                    </div>
                )}

                {/* Extracted Info */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Extracted Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Name</p>
                            <p className="font-medium text-gray-900">{extractedData?.name || 'Not found'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Email</p>
                            <p className="font-medium text-gray-900">{extractedData?.email || 'Not found'}</p>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                        Identified Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {extractedData?.skills && extractedData.skills.length > 0 ? (
                            extractedData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-600">No skills identified</p>
                        )}
                    </div>
                </div>

                {/* Strengths */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                        Strengths
                    </h2>
                    <ul className="space-y-2">
                        {analysisData?.strengths && analysisData.strengths.length > 0 ? (
                            analysisData.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{strength}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600">No strengths identified</p>
                        )}
                    </ul>
                </div>

                {/* Improvements */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Target className="w-6 h-6 text-orange-600 mr-2" />
                        Areas for Improvement
                    </h2>
                    <ul className="space-y-2">
                        {analysisData?.improvements && analysisData.improvements.length > 0 ? (
                            analysisData.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{improvement}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600">No improvements suggested</p>
                        )}
                    </ul>
                </div>

                {/* Next Steps */}
                <div className="flex justify-center space-x-4">
                    <Link to="/role-selection" className="btn-primary">
                        Start Mock Interview
                    </Link>
                    <Link to="/dashboard" className="btn-secondary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Job Match Modal */}
            <JobMatchModal
                isOpen={showJobMatchModal}
                onClose={() => setShowJobMatchModal(false)}
                resumeId={id}
            />
        </div>
    );
};

export default AnalysisResult;
