import { useEffect, useState } from 'react';

export const RESUME_URL = '/resume.pdf';

/** True once public/resume.pdf is known to exist. Drop your PDF there and the download buttons appear. */
export function useResumePdf(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(RESUME_URL, { method: 'HEAD' })
      .then((r) => alive && setOk(r.ok && (r.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return ok;
}
