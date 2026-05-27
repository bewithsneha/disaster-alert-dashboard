import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.5 ? 160 : 130;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 55%, ${this.opacity})`; ctx.fill();
      }
    }
    for (let i = 0; i < 60; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Weak', color: 'var(--severity-high)' },
    { label: 'Weak', color: 'var(--severity-high)' },
    { label: 'Fair', color: 'var(--severity-medium)' },
    { label: 'Good', color: 'var(--severity-medium)' },
    { label: 'Strong', color: 'var(--severity-low)' },
    { label: 'Very Strong', color: 'var(--severity-low)' },
  ];
  return { score, ...levels[score] };
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ParticleCanvas />
      <div className="auth-bg-gradient" />

      <div className="auth-nav" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="auth-card glass-panel" style={{ zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="auth-logo-ring" style={{ background: 'linear-gradient(135deg, var(--severity-low), #059669)' }}>
            <UserPlus size={36} color="white" />
          </div>
          <h1 className="brand-name">TerraWatch</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Create your account
          </p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>{t('Username')}</label>
            <input type="text" className="glass-input" value={username}
              onChange={e => setUsername(e.target.value)} required placeholder="Choose a username" />
          </div>
          <div className="form-group">
            <label>{t('Password')}</label>
            <input type="password" className="glass-input" value={password}
              onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" />
            {password && (
              <>
                <div className="password-strength">
                  <div className="password-strength-fill"
                    style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: strength.color, marginTop: '4px', fontWeight: 500 }}>
                  {strength.label}
                </div>
              </>
            )}
          </div>
          <button type="submit" className="glass-btn success" disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : t('Register')}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t("Already have an account?")} <Link to="/" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>{t('Login')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
