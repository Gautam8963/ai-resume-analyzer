import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Brain } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Brain className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">AI Interview Pro</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <User className="w-8 h-8 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="btn-primary">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
