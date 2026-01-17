import json
import os
import random
import re

class InterviewEvaluator:
    def __init__(self):
        # Load job roles data
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'job_roles.json')
        with open(data_path, 'r') as f:
            self.job_roles = json.load(f)
        
        # Question templates by role
        self.question_templates = {
            'Frontend Developer': [
                'Explain the difference between var, let, and const in JavaScript.',
                'What are React hooks and why are they useful?',
                'How do you optimize the performance of a React application?',
                'Explain the CSS box model.',
                'What is the Virtual DOM and how does it work?',
                'Describe your experience with responsive design.',
                'How do you handle state management in large applications?',
                'What are the key differences between REST and GraphQL?',
                'Explain cross-browser compatibility issues you\'ve faced.',
                'How do you ensure web accessibility in your projects?'
            ],
            'Backend Developer': [
                'Explain the difference between SQL and NoSQL databases.',
                'How do you design a RESTful API?',
                'What is database indexing and why is it important?',
                'Describe your experience with microservices architecture.',
                'How do you handle authentication and authorization?',
                'Explain caching strategies you\'ve implemented.',
                'What are the ACID properties in databases?',
                'How do you ensure API security?',
                'Describe a challenging scalability problem you\'ve solved.',
                'What is your approach to error handling in backend services?'
            ],
            'Full Stack Developer': [
                'Describe your experience building full-stack applications.',
                'How do you manage state between frontend and backend?',
                'Explain your approach to API design and integration.',
                'What deployment strategies have you used?',
                'How do you handle database migrations?',
                'Describe your experience with cloud platforms (AWS/Azure/GCP).',
                'How do you ensure security across the full stack?',
                'What is your testing strategy for full-stack applications?',
                'Explain a complex feature you built end-to-end.',
                'How do you optimize application performance?'
            ],
            'Data Analyst': [
                'How do you approach data cleaning and preprocessing?',
                'Describe your experience with data visualization tools.',
                'Explain a complex SQL query you\'ve written.',
                'How do you identify trends and patterns in data?',
                'What statistical methods do you commonly use?',
                'Describe a data-driven decision you helped make.',
                'How do you handle missing or inconsistent data?',
                'What is your process for creating dashboards?',
                'Explain A/B testing and how you\'ve used it.',
                'How do you communicate insights to non-technical stakeholders?'
            ],
            'ML Engineer': [
                'Explain the bias-variance tradeoff.',
                'How do you prevent overfitting in machine learning models?',
                'Describe your experience with neural networks.',
                'What is the difference between supervised and unsupervised learning?',
                'How do you evaluate model performance?',
                'Explain feature engineering and its importance.',
                'Describe a machine learning project you\'ve deployed to production.',
                'How do you handle imbalanced datasets?',
                'What is transfer learning and when would you use it?',
                'Explain gradient descent and its variants.'
            ],
            'Mobile Developer': [
                'What are the key differences between iOS and Android development?',
                'Explain your experience with React Native or Flutter.',
                'How do you handle offline functionality in mobile apps?',
                'Describe your approach to mobile app performance optimization.',
                'How do you manage different screen sizes and orientations?',
                'What is your testing strategy for mobile applications?',
                'Explain push notifications implementation.',
                'How do you handle app state management?',
                'Describe your experience with mobile app deployment.',
                'What security considerations are important for mobile apps?'
            ],
            'UI/UX Designer': [
                'Explain your design process from research to final design.',
                'How do you conduct user research?',
                'Describe your experience with prototyping tools.',
                'What is your approach to creating design systems?',
                'How do you ensure accessibility in your designs?',
                'Explain the importance of user testing.',
                'Describe a challenging design problem you solved.',
                'How do you balance business goals with user needs?',
                'What are your favorite design patterns and why?',
                'How do you collaborate with developers?'
            ],
            'DevOps Engineer': [
                'Explain the concept of Infrastructure as Code.',
                'Describe your experience with CI/CD pipelines.',
                'How do you approach container orchestration with Kubernetes?',
                'What monitoring and logging strategies do you use?',
                'Explain the difference between Docker and virtual machines.',
                'How do you ensure high availability and disaster recovery?',
                'Describe your experience with cloud platforms.',
                'What is your approach to security in DevOps?',
                'How do you handle deployment rollbacks?',
                'Explain blue-green deployment strategy.'
            ]
        }
    
    def generate_questions(self, role, user_skills):
        """Generate interview questions based on role"""
        
        # Get questions for the role
        if role in self.question_templates:
            questions = self.question_templates[role].copy()
        else:
            # Generic questions if role not found
            questions = [
                'Tell me about your most challenging project.',
                'How do you stay updated with new technologies?',
                'Describe your problem-solving approach.',
                'What are your strengths and weaknesses?',
                'How do you handle tight deadlines?',
                'Describe a time you worked in a team.',
                'What motivates you as a developer?',
                'How do you handle code reviews?',
                'Describe your ideal work environment.',
                'Where do you see yourself in 5 years?'
            ]
        
        # Shuffle and select 10-12 questions
        random.shuffle(questions)
        selected_questions = questions[:random.randint(10, 12)]
        
        return {
            'questions': selected_questions,
            'role': role,
            'totalQuestions': len(selected_questions)
        }
    
    def evaluate_answer(self, question, answer, role):
        """Evaluate user's answer"""
        
        if not answer or len(answer.strip()) < 10:
            return {
                'score': 0,
                'feedback': 'Answer is too short. Please provide more details.',
                'keywords': []
            }
        
        # Get role keywords
        role_keywords = self.job_roles.get(role, {}).get('keywords', [])
        
        # Check for keywords in answer
        answer_lower = answer.lower()
        found_keywords = [kw for kw in role_keywords if kw.lower() in answer_lower]
        
        # Basic scoring
        base_score = 40  # Base score for attempting
        length_score = min(20, len(answer.split()) // 5)  # Up to 20 points for length
        keyword_score = min(40, len(found_keywords) * 10)  # Up to 40 points for keywords
        
        total_score = base_score + length_score + keyword_score
        
        # Generate feedback
        if total_score >= 80:
            feedback = 'Excellent answer! You covered key concepts well and demonstrated strong understanding.'
        elif total_score >= 60:
            feedback = 'Good answer! Consider adding more specific examples or technical details.'
        elif total_score >= 40:
            feedback = 'Decent attempt. Try to include more relevant technical terms and elaborate on your points.'
        else:
            feedback = 'Your answer needs more depth. Focus on technical details and provide concrete examples.'
        
        return {
            'score': min(100, total_score),
            'feedback': feedback,
            'keywords': found_keywords
        }
