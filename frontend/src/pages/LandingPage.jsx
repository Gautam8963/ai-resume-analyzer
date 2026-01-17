import { Link } from 'react-router-dom';
import { Brain, FileText, Target, TrendingUp, CheckCircle, Zap } from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'AI Resume Analysis',
            description: 'Get instant feedback on your resume with skill extraction and improvement tips',
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Job Matching',
            description: 'See how well your skills match your target role with AI-powered scoring',
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: 'Mock Interviews',
            description: 'Practice with AI-generated questions tailored to your resume and role',
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Track Progress',
            description: 'Monitor your improvement over time with detailed analytics',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Ace Your Next Interview with AI
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            Get AI-powered resume analysis and personalized mock interviews to land your dream job
                        </p>
                        <Link to="/login" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powered by advanced AI and NLP technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card text-center animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Three simple steps to interview success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Upload Resume', desc: 'Upload your resume and get instant AI analysis' },
                            { step: '2', title: 'Select Role', desc: 'Choose your target job role for personalized questions' },
                            { step: '3', title: 'Practice & Improve', desc: 'Take mock interviews and get detailed feedback' },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.desc}
                                    </p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of job seekers who improved their interview skills with AI
                    </p>
                    <Link to="/login" className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg">
                        Start Your Free Trial
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
