import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getReportById } from '../services/interviewApi';
import '../style/interview.scss';

// ─── Inline Premium SVG Icons ────────────────────────────────────────────────
const IconTarget = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const IconCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Score Ring Component ────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return 'url(#scoreGrad)';
    if (s >= 50) return '#fbbf24';
    return '#f87171';
  };

  const getVerdict = (s) => {
    if (s >= 80) return 'Excellent Match';
    if (s >= 65) return 'Good Match';
    if (s >= 50) return 'Moderate Match';
    if (s >= 35) return 'Below Average';
    return 'Poor Match';
  };

  const getDesc = (s) => {
    if (s >= 80) return 'Your profile aligns strongly with the job requirements. You are a top candidate.';
    if (s >= 65) return 'Solid alignment with most requirements. A few gaps to address before the interview.';
    if (s >= 50) return 'Moderate fit. Focus on bridging the highlighted skill gaps to improve your chances.';
    if (s >= 35) return 'Below average match. Significant preparation needed to meet the job requirements.';
    return 'Low alignment. Consider targeting roles better suited to your current skill set.';
  };

  return (
    <div className="score-content">
      <div className="score-ring-wrapper">
        <svg className="score-ring" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="70" cy="70" r={radius} />
          <circle
            className="ring-fill"
            cx="70" cy="70" r={radius}
            stroke={getColor(score)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-label">
          <span className="score-number">{score}</span>
          <span className="score-unit">/ 100</span>
        </div>
      </div>

      <div className="score-meta">
        <p className="score-verdict">{getVerdict(score)}</p>
        <p className="score-desc">{getDesc(score)}</p>
      </div>
    </div>
  );
};

// ─── Question Accordion Item ─────────────────────────────────────────────────
const QuestionItem = ({ question, index }) => {
  const [open, setOpen] = useState(false);
  const difficulty = (question.difficulty || 'medium').toLowerCase();

  return (
    <div className={`question-item ${open ? 'open' : ''}`} role="group">
      <div
        className="question-toggle"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="q-number">{index + 1}</span>
        <span className="q-text">{question.question}</span>
        <span className="q-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
          <IconChevronDown />
        </span>
      </div>

      {open && (
        <div className="question-body">
          <div className="q-detail-row">
            <span className="q-detail-label">Intention</span>
            <p className="q-detail-text">{question.intention}</p>
          </div>
          <div className="q-detail-row">
            <span className="q-detail-label">Expected Answer</span>
            <p className="q-detail-text">{question.answer}</p>
          </div>

          {difficulty && (
            <div className="q-detail-row">
              <span className="q-detail-label">Difficulty</span>
              <span className={`difficulty-badge ${difficulty}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          )}

          {question.topics && question.topics.length > 0 && (
            <div className="q-detail-row">
              <span className="q-detail-label">Topics</span>
              <div className="q-tags">
                {question.topics.map((t, i) => (
                  <span className="q-tag" key={i}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Interview Page ─────────────────────────────────────────────────────
const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    if (!interviewId) {
      setError('No interview ID provided.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getReportById(interviewId);
      setReport(data.interviewReport);
    } catch (err) {
      console.error('Failed to load interview report:', err);
      setError(
        err?.response?.data?.message ||
        'Failed to load your interview report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // ── Derived data (handle both AI schema key names) ──────────────────────
  const technicalQuestions = report?.technicalQuestions || report?.technicalQuestions || [];
  const behaviouralQuestions = report?.behaviouralQuestions || report?.behavioralQuestions || [];
  const skillGaps = report?.skillGapAnalysis || report?.skillGaps || [];
  const prepStrategy = report?.preparationStrategy || [];
  const feedback = report?.overallFeedback;
  const matchScore = report?.matchScore ?? 0;

  const overallFeedback = Array.isArray(feedback) ? feedback[0] : feedback;

  return (
    <div className="interview-wrapper">
      {/* Background decorative orbs */}
      <div className="bg-glow orb-1" />
      <div className="bg-glow orb-2" />

      <main className="interview-container">

        {/* Back nav */}
        <nav className="back-nav">
          <button className="back-btn" onClick={() => navigate('/')} aria-label="Go back to home">
            <IconArrowLeft />
            <span>Back to Generator</span>
          </button>
        </nav>

        {/* Page H1 */}
        <header className="interview-header">
          <h1>Your Interview <span>Report</span></h1>
          <p>AI-generated preparation guide tailored to your resume and target role.</p>
        </header>

        {/* ── Loading ──────────────────────────────────────────────── */}
        {loading && (
          <div className="loading-state">
            <div className="spinner" role="status" aria-label="Loading" />
            <p>Loading your personalized report…</p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="error-state" role="alert">
            <span className="error-icon">⚠️</span>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="back-btn" onClick={() => navigate('/')}>
              Return to Home
            </button>
          </div>
        )}

        {/* ── Report Sections ───────────────────────────────────────── */}
        {!loading && report && (
          <>
            {/* 1. Match Score */}
            <section className="glass-card match-score-card" aria-labelledby="match-score-heading">
              <div className="section-header">
                <div className="section-icon"><IconTarget /></div>
                <h2 id="match-score-heading">Match Score</h2>
              </div>
              <ScoreRing score={matchScore} />
            </section>

            {/* 2. Technical Questions */}
            {technicalQuestions.length > 0 && (
              <section className="glass-card" aria-labelledby="technical-heading">
                <div className="section-header">
                  <div className="section-icon"><IconCode /></div>
                  <h2 id="technical-heading">Technical Questions</h2>
                </div>
                <div className="questions-grid" role="list">
                  {technicalQuestions.map((q, i) => (
                    <QuestionItem key={i} question={q} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* 3. Behavioural Questions */}
            {behaviouralQuestions.length > 0 && (
              <section className="glass-card" aria-labelledby="behavioural-heading">
                <div className="section-header">
                  <div className="section-icon"><IconUsers /></div>
                  <h2 id="behavioural-heading">Behavioural Questions</h2>
                </div>
                <div className="questions-grid" role="list">
                  {behaviouralQuestions.map((q, i) => (
                    <QuestionItem key={i} question={q} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. Skill Gap Analysis */}
            {skillGaps.length > 0 && (
              <section className="glass-card" aria-labelledby="skill-gap-heading">
                <div className="section-header">
                  <div className="section-icon"><IconZap /></div>
                  <h2 id="skill-gap-heading">Skill Gap Analysis</h2>
                </div>
                <div className="skill-gap-list">
                  {skillGaps.map((gap, i) => {
                    const sev = (gap.severity || 'low').toLowerCase();
                    return (
                      <div className="skill-gap-item" key={i}>
                        <div className={`severity-dot ${sev}`} aria-label={`Severity: ${sev}`} />
                        <div className="skill-info">
                          <div className="skill-name-row">
                            <span className="skill-name">{gap.skill}</span>
                            <span className={`severity-badge ${sev}`}>{sev}</span>
                          </div>
                          <p className="skill-suggestion">{gap.suggestion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. Preparation Strategy */}
            {prepStrategy.length > 0 && (
              <section className="glass-card" aria-labelledby="prep-heading">
                <div className="section-header">
                  <div className="section-icon"><IconCalendar /></div>
                  <h2 id="prep-heading">Preparation Strategy</h2>
                </div>
                <div className="prep-timeline">
                  {prepStrategy.map((dayObj, i) => (
                    <div className="prep-day" key={i}>
                      <div className="day-marker">
                        <div className="day-dot">
                          <span className="day-number">D{dayObj.day}</span>
                        </div>
                      </div>
                      <div className="day-content">
                        <p className="day-focus">{dayObj.focus}</p>
                        <ul className="day-tasks">
                          {(dayObj.tasks || []).map((task, j) => (
                            <li key={j}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Overall Feedback */}
            {overallFeedback && (
              <section className="glass-card" aria-labelledby="feedback-heading">
                <div className="section-header">
                  <div className="section-icon"><IconStar /></div>
                  <h2 id="feedback-heading">Overall Feedback</h2>
                </div>

                <div className="feedback-grid">
                  {overallFeedback.strengths?.length > 0 && (
                    <div className="feedback-col">
                      <p className="feedback-col-title strengths-title">✦ Strengths</p>
                      <ul className="strengths">
                        {overallFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {overallFeedback.areasOfImprovement?.length > 0 && (
                    <div className="feedback-col">
                      <p className="feedback-col-title improvements-title">▲ Areas to Improve</p>
                      <ul className="improvements">
                        {overallFeedback.areasOfImprovement.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {overallFeedback.recommendation && (
                  <div className="recommendation-box">
                    <p className="rec-label">💡 AI Recommendation</p>
                    <p>{overallFeedback.recommendation}</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Interview;