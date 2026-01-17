import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Target } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalResumes: 0,
        totalInterviews: 0,
        avgScore: 0,
    });
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [interviewsRes, resumesRes] = await Promise.all([
                api.get('/interview/history'),
                api.get('/resume/list'),
            ]);

            const interviews = interviewsRes.data.interviews || [];
            const resumes = resumesRes.data.resumes || [];

            const avgScore = interviews.length > 0
                ? interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length
                : 0;

            setStats({
                totalResumes: resumes.length,
                totalInterviews: interviews.length,
                avgScore: avgScore.toFixed(1),
            });

            setRecentInterviews(interviews.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        Here's your interview preparation progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Total Resumes</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalResumes}</p>
                    </div>

                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Interviews Taken</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalInterviews}</p>
                    </div>

                    <div className="card">
                        <p className="text-sm text-gray-600 mb-1">Average Score</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link to="/upload" className="card hover:border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Resume</h3>
                        <p className="text-sm text-gray-600">Get analysis and feedback</p>
                    </Link>

                    <Link to="/role-selection" className="card hover:border-green-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Mock Interview</h3>
                        <p className="text-sm text-gray-600">Practice with interview questions</p>
                    </Link>
                </div>

                {/* Recent Interviews */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Interviews</h2>
                    {recentInterviews.length > 0 ? (
                        <div className="space-y-3">
                            {recentInterviews.map((interview) => (
                                <Link
                                    key={interview._id}
                                    to={`/feedback/${interview._id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{interview.role}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(interview.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary-600">
                                                {interview.overallScore}%
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {interview.questions?.length || 0} questions
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No interviews yet</p>
                            <Link to="/role-selection" className="btn-primary">
                                Start Your First Interview
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
