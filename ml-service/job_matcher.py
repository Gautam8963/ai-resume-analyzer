"""
Job Matcher - Compares resume with job description
"""

class JobMatcher:
    def __init__(self):
        pass
    
    def extract_keywords(self, text):
        """Extract important keywords from text"""
        # Simple keyword extraction (can be enhanced with NLP)
        text = text.lower()
        
        # Common tech keywords
        tech_keywords = [
            'react', 'vue', 'angular', 'node.js', 'python', 'java', 'javascript',
            'typescript', 'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws',
            'docker', 'kubernetes', 'git', 'api', 'rest', 'graphql', 'agile',
            'scrum', 'ci/cd', 'testing', 'jest', 'cypress', 'tensorflow', 'pytorch',
            'machine learning', 'data analysis', 'excel', 'tableau', 'power bi'
        ]
        
        found_keywords = []
        for keyword in tech_keywords:
            if keyword in text:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def match_job(self, resume_skills, job_description):
        """
        Match resume skills with job description requirements
        
        Args:
            resume_skills: List of skills from resume
            job_description: Job description text
            
        Returns:
            dict: {
                'matchScore': float (0-100),
                'matchingSkills': list,
                'missingSkills': list,
                'recommendations': list
            }
        """
        # Normalize resume skills
        resume_skills_lower = [skill.lower() for skill in resume_skills]
        
        # Extract required skills from job description
        required_skills = self.extract_keywords(job_description)
        
        if not required_skills:
            return {
                'matchScore': 0,
                'matchingSkills': [],
                'missingSkills': [],
                'recommendations': ['Unable to extract requirements from job description']
            }
        
        # Find matching and missing skills
        matching_skills = []
        missing_skills = []
        
        for required_skill in required_skills:
            if any(required_skill in resume_skill for resume_skill in resume_skills_lower):
                matching_skills.append(required_skill)
            else:
                missing_skills.append(required_skill)
        
        # Calculate match score
        match_score = (len(matching_skills) / len(required_skills)) * 100 if required_skills else 0
        
        # Generate recommendations
        recommendations = []
        if missing_skills:
            if len(missing_skills) <= 3:
                recommendations.append(f"Add these skills to your resume: {', '.join(missing_skills[:3])}")
            else:
                recommendations.append(f"Consider adding: {', '.join(missing_skills[:3])} and {len(missing_skills) - 3} more skills")
        
        if match_score >= 80:
            recommendations.append("Excellent match! Your resume aligns well with this job.")
        elif match_score >= 60:
            recommendations.append("Good match. Adding missing skills could strengthen your application.")
        elif match_score >= 40:
            recommendations.append("Moderate match. Consider gaining experience in missing skills.")
        else:
            recommendations.append("Low match. This role may require significant skill development.")
        
        return {
            'matchScore': round(match_score, 1),
            'matchingSkills': matching_skills,
            'missingSkills': missing_skills,
            'recommendations': recommendations,
            'totalRequired': len(required_skills),
            'totalMatching': len(matching_skills)
        }
