/*
 * Courses page — redirects to Gumroad
 * All paid courses are sold exclusively through Gumroad
 */
import { useEffect } from 'react';

export default function Courses() {
  useEffect(() => {
    // Replace with your actual Gumroad URL
    const gumroadUrl = 'https://gumroad.com/veilcartography';
    window.location.href = gumroadUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.10 0.015 60)' }}>
      <div style={{ textAlign: 'center', fontFamily: 'Cinzel, serif', color: 'oklch(0.65 0.08 75)' }}>
        <p>Redirecting to our courses on Gumroad...</p>
        <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: 'oklch(0.50 0.05 75)' }}>If you are not redirected, <a href="https://gumroad.com/veilcartography" style={{ color: 'oklch(0.75 0.12 80)', textDecoration: 'underline' }}>click here</a>.</p>
      </div>
    </div>
  );
}
