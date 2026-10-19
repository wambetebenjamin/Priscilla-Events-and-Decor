'use client';

/**
 * The style finder at /style-quiz.
 *
 * Six questions about aesthetic preference: colour palette, setting, floral
 * style, lighting, tables, and what guests should remember. The result is a
 * recommended package plus a mood board collage built from the photography that
 * was chosen along the way, with a call to action to book a consultation.
 *
 * Everything runs in the browser. No answers are posted, stored or logged, and no
 * account is needed. Reloading the page starts again from nothing, which is the
 * point.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { QUIZ, QUIZ_TOTAL, scoreQuiz, type QuizAnswers } from '@/lib/quiz';
import { getPackage, formatKes } from '@/lib/packages';

export default function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ[step];
  const total = QUIZ_TOTAL;
  const answered = Object.keys(answers).length;

  const result = useMemo(() => scoreQuiz(answers), [answers]);
  const recommended = useMemo(() => getPackage(result.packageId), [result.packageId]);

  function choose(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    if (step + 1 < total) {
      // A short beat so the selection is visible before moving on.
      window.setTimeout(() => setStep((value) => value + 1), 220);
    } else {
      window.setTimeout(() => setShowResult(true), 220);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setShowResult(false);
  }

  /* --------------------------------------------------------------- result */
  if (showResult) {
    return (
      <div className="quiz-shell">
        <div className="quiz-card quiz-result">
          <span className="eyebrow">Your result</span>
          <h2 className="section-title">Your look is {recommended?.name ?? 'The Bloom Package'}.</h2>
          <p className="section-lead" style={{ margin: '0 0 26px', textAlign: 'left' }}>
            {recommended?.quizLine} {recommended?.summary}
          </p>

          {result.board.length > 0 ? (
            <>
              <h3 style={{ fontSize: 'var(--fs-h4)' }}>Your mood board</h3>
              <p className="hint" style={{ marginBottom: 16 }}>
                Built from the choices you just made. Save the screen or bring it with you to a
                consultation.
              </p>

              <div className="moodboard" aria-label="Mood board collage">
                {result.board.map((src, index) => (
                  <figure
                    key={src}
                    className={index === 0 ? 'wide tall' : index === 1 || index === 4 ? 'tall' : ''}
                  >
                    <img
                      src={src}
                      alt={`Mood board image ${index + 1} from your style quiz choices`}
                      width={700}
                      height={700}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
            </>
          ) : null}

          {question.options.some((option) => option.swatches) ? (
            <div className="moodboard-palette" aria-label="Your chosen palette">
              {(question.options.find((option) => option.id === answers.palette)?.swatches ?? []).map(
                (swatch) => (
                  <span key={swatch.hex} style={{ background: swatch.hex }} title={swatch.name}>
                    <span className="visually-hidden">{swatch.name}</span>
                  </span>
                ),
              )}
            </div>
          ) : null}

          {recommended ? (
            <div className="summary-grid">
              <div className="summary-row">
                <dt>Package</dt>
                <dd>{recommended.name}</dd>
              </div>
              <div className="summary-row">
                <dt>Starting from</dt>
                <dd>{formatKes(recommended.startingPrice)}</dd>
              </div>
              <div className="summary-row">
                <dt>Suits</dt>
                <dd>{recommended.guestRange}</dd>
              </div>
              <div className="summary-row">
                <dt>Best for</dt>
                <dd>{recommended.suitable}</dd>
              </div>
            </div>
          ) : null}

          <p className="meta" style={{ marginBottom: 20 }}>
            This result is a starting point, not a quote. Nothing you answered was stored or sent
            anywhere. It lives only in this browser tab.
          </p>

          <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
            <Link href="/enquire?intent=package" className="btn btn-primary">
              Love this look? Book a consultation.
            </Link>
            <button type="button" className="btn btn-quiet" onClick={restart}>
              Start again
            </button>
          </div>

          <p className="hint" style={{ marginTop: 16 }}>
            You can also{' '}
            <Link href="/packages">compare all three packages</Link> or{' '}
            <Link href="/portfolio">see the work</Link> before you decide.
          </p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------- questions */
  return (
    <div className="quiz-shell">
      <div className="quiz-card">
        <div className="quiz-progress">
          <span className="meta" style={{ margin: 0 }}>
            Question {step + 1} of {total}
          </span>
          <div className="progress-track" role="presentation">
            <div className="progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
          </div>
        </div>

        <h2 className="quiz-q" id="quiz-question" tabIndex={-1}>
          {question.question}
        </h2>
        {question.help ? <p className="quiz-help">{question.help}</p> : null}

        {question.layout === 'swatches' ? (
          <div className="swatches" role="group" aria-labelledby="quiz-question">
            {question.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="swatch"
                aria-pressed={answers[question.id] === option.id}
                onClick={() => choose(option.id)}
              >
                <span className="swatch-row" aria-hidden="true">
                  {option.swatches?.map((swatch) => (
                    <span
                      key={swatch.hex}
                      className="swatch-chip"
                      style={{ background: swatch.hex }}
                    />
                  ))}
                </span>
                <span className="swatch-name">{option.label}</span>
                <span className="swatch-note">{option.note}</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            className={`quiz-options ${question.layout === 'photos-2' ? 'cols-2' : 'cols-3'}`}
            role="group"
            aria-labelledby="quiz-question"
          >
            {question.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="quiz-option"
                aria-pressed={answers[question.id] === option.id}
                onClick={() => choose(option.id)}
              >
                {option.image ? (
                  <img
                    src={option.image}
                    alt={option.imageAlt ?? option.label}
                    width={700}
                    height={525}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <span className="quiz-option-label">{option.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="step-actions">
          {step > 0 ? (
            <button type="button" className="btn btn-quiet" onClick={() => setStep((v) => v - 1)}>
              <i className="bi bi-arrow-left" aria-hidden="true" /> Previous
            </button>
          ) : (
            <span />
          )}
          {answers[question.id] ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                step + 1 < total ? setStep((value) => value + 1) : setShowResult(true)
              }
            >
              Next <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          ) : (
            <span className="meta" style={{ margin: 0 }}>
              Choose an option to continue
            </span>
          )}
        </div>
      </div>

      <p className="meta" style={{ textAlign: 'center', marginTop: 18 }}>
        Nothing is stored. No login, no email, no data leaves the browser.
      </p>
    </div>
  );
}
