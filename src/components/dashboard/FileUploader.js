import { useState } from 'react';

/**
 * Component for uploading resume files and providing a job description.
 * It handles file and text state, and makes an API call to the backend
 * to evaluate the resume against the job description.
 */
function FileUploader() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a PDF or DOCX file.');
        setResumeFile(null);
      }
    }
  };

  // Handle job description text input
  const handleTextChange = (e) => {
    setJobDescription(e.target.value);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    setIsEvaluating(true);
    setError('');
    setEvaluationResult(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescription);

    try {
      // NOTE: For local development, use 'http://127.0.0.1:5000/evaluate'.
      // For deployment, use the deployed backend URL.
      const response = await fetch('http://127.0.0.1:5000/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEvaluationResult(result);
    } catch (e) {
      console.error('Error during evaluation:', e);
      setError('An error occurred during evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-8 border border-gray-300 rounded-lg shadow-inner bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="resume-file">
            Upload Your Resume (PDF or DOCX)
          </label>
          <input
            id="resume-file"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="w-full text-gray-700 bg-white border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="job-description">
            Paste Job Description
          </label>
          <textarea
            id="job-description"
            rows="10"
            value={jobDescription}
            onChange={handleTextChange}
            placeholder="Paste the full job description here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
        </div>

        {error && (
          <div className="p-4 text-center text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isEvaluating}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Resume'}
        </button>
      </form>

      {evaluationResult && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Evaluation Report</h3>
          <p className="text-4xl font-extrabold text-center mb-6" style={{color: evaluationResult.overall_score > 70 ? '#22c55e' : evaluationResult.overall_score > 40 ? '#f59e0b' : '#ef4444'}}>
            {evaluationResult.overall_score}%
          </p>
          <div className="text-center text-gray-600 mb-6">
            <p className="text-lg font-semibold">{evaluationResult.summary}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-700">Matched Keywords/Skills:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {evaluationResult.match_breakdown.skills_and_keywords.matched_keywords.length > 0 ? (
                  evaluationResult.match_breakdown.skills_and_keywords.matched_keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No keywords matched.</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-700">Missing Keywords/Skills:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {evaluationResult.match_breakdown.skills_and_keywords.missing_keywords.length > 0 ? (
                  evaluationResult.match_breakdown.skills_and_keywords.missing_keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">All key skills were found!</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-gray-700">Additional Feedback:</h4>
            <p className="text-gray-600 mt-2">
              {evaluationResult.match_breakdown.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCxxKyOX27zNZ3iasDXVJBsoQsdIMm0H_0",
  authDomain: "resume-3b564.firebaseapp.com",
  projectId: "resume-3b564",
  storageBucket: "resume-3b564.firebasestorage.app",
  messagingSenderId: "819142207586",
  appId: "1:819142207586:web:9b04398efb98e2d111893b",
  measurementId: "G-3LE2F1BQ7V"
};
