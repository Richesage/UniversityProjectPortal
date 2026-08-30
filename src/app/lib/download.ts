export function downloadBlob(content: string | Blob, filename: string, mime: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadSubmissionFile(submission: {
  title: string;
  fileName: string;
  submittedAt: string;
  status: string;
  feedback?: string;
  chapter: number;
}) {
  const content = [
    'University Project Portal — Submission Record',
    '============================================',
    '',
    `Title: ${submission.title}`,
    `File: ${submission.fileName}`,
    `Chapter: ${submission.chapter}`,
    `Submitted: ${submission.submittedAt}`,
    `Status: ${submission.status.replace('_', ' ')}`,
    submission.feedback ? `\nSupervisor Feedback:\n${submission.feedback}` : '',
    '',
    '--- End of record ---',
  ]
    .filter(Boolean)
    .join('\n');

  const baseName = submission.fileName.replace(/\.[^.]+$/, '') || `chapter-${submission.chapter}`;
  downloadBlob(content, `${baseName}.txt`, 'text/plain;charset=utf-8');
}
