import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Code, Server, Layers, Database, Brain, Smartphone, Palette, Cloud } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: 'frontend', name: 'Frontend Developer', icon: <Code className="w-8 h-8" />, color: 'blue' },
        { id: 'backend', name: 'Backend Developer', icon: <Server className="w-8 h-8" />, color: 'green' },
        { id: 'fullstack', name: 'Full Stack Developer', icon: <Layers className="w-8 h-8" />, color: 'purple' },
        { id: 'data-analyst', name: 'Data Analyst', icon: <Database className="w-8 h-8" />, color: 'orange' },
        { id: 'ml-engineer', name: 'ML Engineer', icon: <Brain className="w-8 h-8" />, color: 'pink' },
        { id: 'mobile', name: 'Mobile Developer', icon: <Smartphone className="w-8 h-8" />, color: 'indigo' },
        { id: 'ui-ux', name: 'UI/UX Designer', icon: <Palette className="w-8 h-8" />, color: 'red' },
        { id: 'devops', name: 'DevOps Engineer', icon: <Cloud className="w-8 h-8" />, color: 'teal' },
    ];

    const handleStartInterview = async () => {
        if (!selectedRole) return;

        setLoading(true);
        try {
            const response = await api.post('/interview/start', {
                role: selectedRole,
            });

            navigate(`/interview/${response.data.interviewId}`);
        } catch (error) {
            console.error('Failed to start interview:', error);
            alert('Failed to start interview. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Select Your Target Role
                    </h1>
                    <p className="text-gray-600">
                        Choose the role you're preparing for to get tailored interview questions
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.name)}
                            className={`card text-center transition-all duration-200 cursor-pointer ${selectedRole === role.name
                                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                                    : 'hover:border-gray-400'
                                }`}
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 ${selectedRole === role.name ? 'bg-primary-200' : 'bg-gray-100'
                                }`}>
                                <div className={selectedRole === role.name ? 'text-primary-600' : 'text-gray-600'}>
                                    {role.icon}
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                        </button>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={handleStartInterview}
                        disabled={!selectedRole || loading}
                        className={`btn-primary ${!selectedRole || loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Starting Interview...' : 'Start Mock Interview'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
