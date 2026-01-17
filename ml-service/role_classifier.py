"""
Role Classifier - Detects the best-fit job role based on resume skills
"""

class RoleClassifier:
    def __init__(self):
        # Define role keywords and their weights
        self.role_keywords = {
            'Frontend Developer': {
                'primary': ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'jsx', 'sass', 'webpack'],
                'secondary': ['ui', 'ux', 'responsive', 'bootstrap', 'tailwind', 'redux', 'next.js', 'nuxt']
            },
            'Backend Developer': {
                'primary': ['node.js', 'python', 'java', 'api', 'rest', 'graphql', 'sql', 'mongodb', 'express', 'django'],
                'secondary': ['postgresql', 'mysql', 'redis', 'microservices', 'spring', 'flask', 'fastapi']
            },
            'Full Stack Developer': {
                'primary': ['full stack', 'mern', 'mean', 'react', 'node.js', 'mongodb', 'express'],
                'secondary': ['frontend', 'backend', 'database', 'api', 'javascript', 'typescript']
            },
            'Data Scientist': {
                'primary': ['python', 'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn'],
                'secondary': ['statistics', 'data analysis', 'deep learning', 'nlp', 'computer vision', 'jupyter']
            },
            'ML Engineer': {
                'primary': ['machine learning', 'tensorflow', 'pytorch', 'deep learning', 'neural networks', 'ai'],
                'secondary': ['python', 'model deployment', 'mlops', 'keras', 'scikit-learn']
            },
            'DevOps Engineer': {
                'primary': ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform', 'ansible'],
                'secondary': ['linux', 'bash', 'monitoring', 'azure', 'gcp', 'gitlab', 'github actions']
            },
            'Mobile Developer': {
                'primary': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
                'secondary': ['mobile', 'app development', 'firebase', 'xcode', 'android studio']
            },
            'UI/UX Designer': {
                'primary': ['figma', 'sketch', 'adobe xd', 'ui design', 'ux design', 'prototyping'],
                'secondary': ['wireframing', 'user research', 'design systems', 'illustrator', 'photoshop']
            },
            'Data Analyst': {
                'primary': ['sql', 'excel', 'tableau', 'power bi', 'data visualization', 'statistics'],
                'secondary': ['python', 'r', 'data analysis', 'reporting', 'dashboards']
            }
        }
    
    def classify(self, skills):
        """
        Classify the role based on extracted skills
        
        Args:
            skills: List of skill strings from resume
            
        Returns:
            dict: {
                'role': str,
                'confidence': float (0-100),
                'matchedSkills': list,
                'alternativeRoles': list
            }
        """
        if not skills:
            return {
                'role': 'General',
                'confidence': 0,
                'matchedSkills': [],
                'alternativeRoles': []
            }
        
        # Normalize skills to lowercase
        normalized_skills = [skill.lower() for skill in skills]
        
        # Calculate scores for each role
        role_scores = {}
        role_matches = {}
        
        for role, keywords in self.role_keywords.items():
            primary_matches = []
            secondary_matches = []
            
            # Check primary keywords (weight: 2)
            for keyword in keywords['primary']:
                if any(keyword in skill for skill in normalized_skills):
                    primary_matches.append(keyword)
            
            # Check secondary keywords (weight: 1)
            for keyword in keywords['secondary']:
                if any(keyword in skill for skill in normalized_skills):
                    secondary_matches.append(keyword)
            
            # Calculate score
            score = (len(primary_matches) * 2) + len(secondary_matches)
            role_scores[role] = score
            role_matches[role] = primary_matches + secondary_matches
        
        # Get top role
        if max(role_scores.values()) == 0:
            return {
                'role': 'General',
                'confidence': 0,
                'matchedSkills': [],
                'alternativeRoles': []
            }
        
        top_role = max(role_scores, key=role_scores.get)
        top_score = role_scores[top_role]
        
        # Calculate confidence (normalize to 0-100)
        max_possible_score = len(self.role_keywords[top_role]['primary']) * 2 + len(self.role_keywords[top_role]['secondary'])
        confidence = min(100, (top_score / max_possible_score) * 100)
        
        # Get alternative roles (sorted by score, excluding top role)
        alternative_roles = sorted(
            [(role, score) for role, score in role_scores.items() if role != top_role and score > 0],
            key=lambda x: x[1],
            reverse=True
        )[:3]  # Top 3 alternatives
        
        return {
            'role': top_role,
            'confidence': round(confidence, 1),
            'matchedSkills': role_matches[top_role],
            'alternativeRoles': [{'role': role, 'score': score} for role, score in alternative_roles]
        }
