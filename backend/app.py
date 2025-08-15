import io
import re
from flask import Flask, request, jsonify
from docx import Document
import PyPDF2
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Download NLTK stopwords if not already present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Get English stopwords for text cleaning
stop_words = nltk.corpus.stopwords.words('english')

# Function to parse PDF files
def parse_pdf(file_stream):
    """Parses a PDF file stream and extracts all text."""
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None

# Function to parse DOCX files
def parse_docx(file_stream):
    """Parses a DOCX file stream and extracts all text."""
    try:
        doc = Document(file_stream)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return None

# Function to clean and tokenize text
def preprocess_text(text):
    """Cleans text by converting to lowercase, removing punctuation, and stop words."""
    if not text:
        return ""
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower()
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

# Function to evaluate the match between resume and job description
def evaluate_match(resume_text, job_description_text):
    """
    Evaluates the relevance of a resume to a job description using TF-IDF and Cosine Similarity.
    """
    # Preprocess both texts
    preprocessed_resume = preprocess_text(resume_text)
    preprocessed_jd = preprocess_text(job_description_text)
    
    if not preprocessed_resume or not preprocessed_jd:
        return {"overall_score": 0, "summary": "One or both documents are empty.", "match_breakdown": {}}

    documents = [preprocessed_resume, preprocessed_jd]

    # Create TF-IDF vectors
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    score = round(cosine_sim[0][0] * 100, 2)
    
    # Simple keyword extraction for feedback
    jd_keywords = set(tfidf_vectorizer.vocabulary_.keys())
    resume_keywords = set(preprocessed_resume.split())

    matched_keywords = list(jd_keywords.intersection(resume_keywords))
    missing_keywords = list(jd_keywords.difference(resume_keywords))
    
    summary = f"The resume has an overall match score of {score}%. "
    if score > 70:
        summary += "It is a strong match and highly relevant to the job description."
    elif score > 40:
        summary += "It is a moderate match, with room for improvement in key areas."
    else:
        summary += "It is a low match, and significant changes are needed."

    return {
        "overall_score": score,
        "summary": summary,
        "match_breakdown": {
            "skills_and_keywords": {
                "matched_keywords": matched_keywords,
                "missing_keywords": missing_keywords,
            },
            "feedback": "This is placeholder feedback. Advanced analysis could go here."
        }
    }


# A simple health check route
@app.route('/', methods=['GET'])
def home():
    return "AI Resume Evaluator Backend is running!"

@app.route('/evaluate', methods=['POST'])
def evaluate_resume():
    """
    This endpoint handles the resume and job description submission.
    
    The frontend will send a POST request to this endpoint with two parts:
    1. A file named 'resume' (PDF or DOCX).
    2. A text field named 'job_description'.
    """
    
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({'error': 'Missing resume file or job description'}), 400

    resume_file = request.files['resume']
    job_description = request.form['job_description']

    if resume_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_stream = io.BytesIO(resume_file.read())

    resume_text = None
    if resume_file.filename.endswith('.pdf'):
        resume_text = parse_pdf(file_stream)
    elif resume_file.filename.endswith('.docx'):
        resume_text = parse_docx(file_stream)
    else:
        return jsonify({'error': 'Invalid file type. Please upload a PDF or DOCX.'}), 400
    
    if resume_text is None:
        return jsonify({'error': 'Failed to parse resume file. It might be corrupt or an unsupported format.'}), 500

    # Perform the AI evaluation
    evaluation_result = evaluate_match(resume_text, job_description)

    return jsonify(evaluation_result), 200

if __name__ == '__main__':
    # When deployed, the port will be set by the environment
    app.run(debug=True, port=5000)
