import os
import re
import PyPDF2
from docx import Document

class ResumeParser:
    def __init__(self):
        # Common skill keywords to extract
        self.skill_patterns = [
            r'\b(?:Python|Java|JavaScript|TypeScript|C\+\+|C#|Ruby|Go|Rust|PHP|Swift|Kotlin)\b',
            r'\b(?:React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel)\b',
            r'\b(?:HTML|CSS|Sass|Tailwind|Bootstrap|Material UI)\b',
            r'\b(?:MongoDB|PostgreSQL|MySQL|Redis|Cassandra|DynamoDB)\b',
            r'\b(?:AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|CI/CD)\b',
            r'\b(?:Machine Learning|Deep Learning|NLP|TensorFlow|PyTorch|Scikit-learn)\b',
            r'\b(?:REST API|GraphQL|Microservices|WebSocket)\b',
            r'\b(?:SQL|NoSQL|Database|ETL|Data Analysis)\b',
        ]
        
    def extract_text_from_pdf(self, filepath):
        """Extract text from PDF file"""
        try:
            with open(filepath, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ''
                for page in reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ''
    
    def extract_text_from_docx(self, filepath):
        """Extract text from DOCX file"""
        try:
            doc = Document(filepath)
            text = '\n'.join([para.text for para in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            return ''
    
    def extract_text(self, filepath):
        """Extract text based on file extension"""
        ext = os.path.splitext(filepath)[1].lower()
        if ext == '.pdf':
            return self.extract_text_from_pdf(filepath)
        elif ext == '.docx':
            return self.extract_text_from_docx(filepath)
        else:
            return ''
    
    def extract_email(self, text):
        """Extract email from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else None
    
    def extract_name(self, text):
        """Extract name from first few lines (simple heuristic)"""
        lines = text.split('\n')
        for line in lines[:5]:
            line = line.strip()
            # Simple check: if line has 2-4 words and no special chars
            if line and 2 <= len(line.split()) <= 4 and line.replace(' ', '').isalpha():
                return line
        return None
    
    def extract_skills(self, text):
        """Extract skills using pattern matching"""
        skills = set()
        for pattern in self.skill_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            skills.update(matches)
        return list(skills)
    
    def parse(self, filepath):
        """Main parsing function"""
        text = self.extract_text(filepath)
        
        if not text:
            return {
                'extractedData': {
                    'name': None,
                    'email': None,
                    'skills': [],
                    'experience': 'Unable to extract text from resume'
                },
                'analysis': {
                    'score': 0,
                    'strengths': [],
                    'improvements': ['Unable to parse resume. Please ensure it\'s a valid PDF or DOCX file.'],
                    'missingSkills': []
                }
            }
        
        # Extract data
        name = self.extract_name(text)
        email = self.extract_email(text)
        skills = self.extract_skills(text)
        
        # Basic analysis
        score = min(100, len(skills) * 8 + 20)  # Simple scoring
        
        strengths = []
        if len(skills) >= 5:
            strengths.append(f"Strong technical skill set with {len(skills)} identified skills")
        if email:
            strengths.append("Contact information clearly provided")
        
        improvements = []
        if len(skills) < 5:
            improvements.append("Consider adding more technical skills to your resume")
        if not email:
            improvements.append("Add contact email for better visibility")
        if len(text) < 500:
            improvements.append("Resume appears brief. Consider adding more details about your experience")
        
        return {
            'extractedData': {
                'name': name,
                'email': email,
                'skills': skills,
                'experience': text[:200] + '...' if len(text) > 200 else text
            },
            'analysis': {
                'score': score,
                'strengths': strengths,
                'improvements': improvements,
                'missingSkills': []
            }
        }
