import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { generateReport } from '../services/interviewApi';
import "../style/home.scss";

// Premium Inline Icons
const UploadCloud = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
    <path d="M12 12v9"></path>
    <path d="m16 16-4-4-4 4"></path>
  </svg>
);

const Briefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const UserCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <polyline points="16 11 18 13 22 9"></polyline>
  </svg>
);

const Target = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const Sparkles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
  </svg>
);

const AlignLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" x2="3" y1="6" y2="6"></line>
    <line x1="15" x2="3" y1="12" y2="12"></line>
    <line x1="17" x2="3" y1="18" y2="18"></line>
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setResumeFile(e.target.files[0]);
    } else {
      setFileName('');
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!resumeFile) return setError('Please upload your resume (PDF).');
    if (!jobDescription.trim()) return setError('Please paste the job description.');
    if (!selfDescription.trim()) return setError('Please fill in your self description.');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      formData.append('selfDescription', selfDescription);
      if (experienceLevel.trim()) formData.append('experienceLevel', experienceLevel);

      const data = await generateReport(formData);
      const reportId = data.interviewReport._id;
      navigate(`/interview/${reportId}`);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err?.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='home-wrapper'>
      {/* Abstract Background Elements */}
      <div className="bg-glow orb-1"></div>
      <div className="bg-glow orb-2"></div>

      <main className='home-container'>
        
        <header className="home-header">
          <h1>AI Interview <span>Simulator</span></h1>
          <p>Generate personalized interview questions based on your profile and target role.</p>
        </header>

        <section className="form-grid">
          {/* Left Column: Job Description */}
          <div className="glass-card left-panel">
            <div className="card-header">
              <Briefcase />
              <h2>Job Description</h2>
            </div>
            <p className="subtext">Paste the full job description to tailor the interview to the exact role requirements.</p>
            
            <div className="textarea-wrapper">
              <textarea 
                name="jobDescription" 
                id="jobDescription" 
                placeholder='e.g., We are looking for a Software Engineer with experience in React and Node.js...'
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              ></textarea>
            </div>
          </div>

          {/* Right Column: Candidate Info */}
          <div className="glass-card right-panel">
            <div className="card-header">
              <UserCheck />
              <h2>Candidate Profile</h2>
            </div>
            <p className="subtext">Provide your details to benchmark against the job role.</p>

            <form className="form-fields" onSubmit={handleSubmit} noValidate>
              
              <div className='input-group file-upload-group'>
                <input 
                  type="file" 
                  name="resume" 
                  id="resume" 
                  accept='.pdf'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label htmlFor="resume" className="file-drop-zone">
                  <div className="icon-container">
                    <UploadCloud />
                  </div>
                  <span className="file-name">{fileName ? fileName : 'Click or drag PDF to upload'}</span>
                  <span className="file-hint">Max file size: 5MB</span>
                </label>
              </div>

              <div className='input-group'>
                <label htmlFor="selfDescription">Self Description</label>
                <div className="input-wrapper">
                  <AlignLeft />
                  <input 
                    type="text" 
                    name="selfDescription" 
                    id="selfDescription" 
                    placeholder='Tell us about yourself...'
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className='input-group'>
                <label htmlFor="experienceLevel">Experience Level</label>
                <div className="input-wrapper">
                  <Target />
                  <input 
                    type="text" 
                    name="experienceLevel" 
                    id="experienceLevel" 
                    placeholder='e.g., Fresher, Mid, Senior'
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <p className="form-error" role="alert">{error}</p>
              )}

              <button type="submit" className='generate-btn' disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Generating Report…</span>
                  </>
                ) : (
                  <>
                    <Sparkles />
                    <span>Generate Interview Report</span>
                    <div className="btn-glow"></div>
                  </>
                )}
              </button>
            </form>

          </div>
        </section>
      </main>
    </div>
  )
}

export default Home;