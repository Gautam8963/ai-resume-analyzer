import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from resume_parser import ResumeParser
from job_matcher import JobMatcher
from interview_evaluator import InterviewEvaluator
from role_classifier import RoleClassifier

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize services
resume_parser = ResumeParser()
job_matcher = JobMatcher()
interview_evaluator = InterviewEvaluator()
role_classifier = RoleClassifier()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'ML Service is running'})

@app.route('/ml/parse-resume', methods=['POST'])
def parse_resume():
    """Parse resume file and extract information"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save file temporarily
        temp_path = f'/tmp/{file.filename}'
        file.save(temp_path)
        
        # Parse resume
        result = resume_parser.parse(temp_path)
        
        # Clean up temp file
        try:
            os.remove(temp_path)
        except:
            pass
        
        return jsonify(result)
    
    except Exception as e:
        print(f'Parse resume error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/ml/match-job', methods=['POST'])
def match_job():
    """Match user skills with job role"""
    try:
        data = request.json
        skills = data.get('skills', [])
        role = data.get('role', '')
        
        if not role:
            return jsonify({'error': 'Role is required'}), 400
        
        result = job_matcher.match_job(skills, role)
        return jsonify(result)
    
    except Exception as e:
        print(f'Match job error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/ml/generate-questions', methods=['POST'])
def generate_questions():
    """Generate interview questions based on role"""
    try:
        data = request.json
        role = data.get('role', '')
        skills = data.get('skills', [])
        
        if not role:
            return jsonify({'error': 'Role is required'}), 400
        
        result = interview_evaluator.generate_questions(role, skills)
        return jsonify(result)
    
    except Exception as e:
        print(f'Generate questions error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/ml/evaluate-answer', methods=['POST'])
def evaluate_answer():
    """Evaluate interview answer"""
    try:
        data = request.json
        question = data.get('question', '')
        answer = data.get('answer', '')
        role = data.get('role', '')
        
        if not question or not answer:
            return jsonify({'error': 'Question and answer are required'}), 400
        
        result = interview_evaluator.evaluate_answer(question, answer, role)
        return jsonify(result)
    
    except Exception as e:
        print(f'Evaluate answer error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/ml/classify-role', methods=['POST'])
def classify_role():
    """Classify job role based on skills"""
    try:
        data = request.json
        skills = data.get('skills', [])
        
        if not skills:
            return jsonify({'error': 'Skills are required'}), 400
        
        result = role_classifier.classify(skills)
        return jsonify(result)
    
    except Exception as e:
        print(f'Classify role error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/ml/match-job-description', methods=['POST'])
def match_job_description():
    """Match resume with job description"""
    try:
        data = request.json
        resume_skills = data.get('resumeSkills', [])
        job_description = data.get('jobDescription', '')
        
        if not resume_skills or not job_description:
            return jsonify({'error': 'Resume skills and job description are required'}), 400
        
        result = job_matcher.match_job(resume_skills, job_description)
        return jsonify(result)
    
    except Exception as e:
        print(f'Match job description error: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 8000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f'🚀 ML Service starting on port {port}')
    app.run(host='0.0.0.0', port=port, debug=debug)
