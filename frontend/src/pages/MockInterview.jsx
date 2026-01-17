import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';

const MockInterview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInterview();
    }, [id]);

    const fetchInterview = async () => {
        try {
            const response = await api.get(`/interview/result/${id}`);
            setInterview(response.data.interview);

            // Find first unanswered question
            const firstUnanswered = response.data.interview.questions.findIndex(
                q => !q.userAnswer
            );
            setCurrentQuestionIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
        } catch (error) {
            console.error('Failed to fetch interview:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) return;

        setSubmitting(true);
        try {
            await api.post('/interview/answer', {
                interviewId: id,
                questionIndex: currentQuestionIndex,
                answer: answer.trim(),
            });

            // Move to next question
            if (currentQuestionIndex < interview.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setAnswer('');
                await fetchInterview(); // Refresh to get evaluation
            } else {
                // Interview complete
                navigate(`/interview/feedback/${id}`);
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
            alert('Failed to submit answer. Please try again.');
        } finally {
            setSubmitting(false);
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

    const currentQuestion = interview.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Question {currentQuestionIndex + 1} of {interview.questions.length}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="card mb-6">
                    <div className="flex items-start space-x-3 mb-6">
                        <MessageCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Interview Question</p>
                            <p className="text-xl font-medium text-gray-900">
                                {currentQuestion?.question}
                            </p>
                        </div>
                    </div>

                    {/* Previous Answer Feedback */}
                    {currentQuestion?.evaluation && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-900 mb-1">
                                        Score: {currentQuestion.evaluation.score}%
                                    </p>
                                    <p className="text-sm text-green-800">
                                        {currentQuestion.evaluation.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Answer Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Answer
                        </label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={8}
                            className="input-field resize-none"
                            disabled={submitting}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Take your time and provide a detailed answer
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim() || submitting}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span>
                                    {currentQuestionIndex < interview.questions.length - 1
                                        ? 'Submit & Next'
                                        : 'Submit & Finish'}
                                </span>
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MockInterview;
