import { useEffect, useRef, useState } from 'react';

const STAGE = {
  LOW: 'low',
  CHARGING: 'charging',
  TRANSITION: 'transition',
  LOGIN: 'login',
  SUCCESS: 'success',
};

function BatteryGlyph({ percent = 1, charging = false, small = false }) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div className={`battery-glyph ${small ? 'small' : ''} ${charging ? 'charging' : 'critical'}`} aria-label={`${Math.round(safe)} persen`}>
      <div className="battery-shell">
        <div className="battery-fill" style={{ width: `${Math.max(safe, 2)}%` }} />
        {charging && <span className="battery-bolt">⚡</span>}
      </div>
      <div className="battery-terminal" />
    </div>
  );
}

function ChargingRing({ percent = 1 }) {
  const safe = Math.max(0, Math.min(100, percent));
  const degrees = Math.max(4, safe * 3.6);
  return (
    <div className="charging-ring-wrap" aria-label={`Mengisi daya ${Math.round(safe)} persen`}>
      <div
        className="charging-ring"
        style={{ '--progress': `${degrees}deg` }}
      >
        <div className="charging-ring-inner">
          <div className="charging-ring-percent">{Math.round(safe)}<span>%</span></div>
          <div className="charging-ring-bolt">⚡</div>
        </div>
        <span className="ring-sweep" />
      </div>
      <div className="charging-ring-label">Charging...</div>
    </div>
  );
}

function Phone({ battery, charging, exiting, connected, phoneRef }) {
  return (
    <div ref={phoneRef} className={`phone-wrap ${charging ? 'phone-is-charging' : ''} ${exiting ? 'phone-exit' : ''}`}>
      <div className="phone-device">
        <div className="phone-side side-left" />
        <div className="phone-side side-right" />
        <div className="phone-screen">
          <div className="screen-glass" />
          <div className="dynamic-island"><span /></div>

          <div className="status-row">
            <span>22:47</span>
            <div className="status-icons"><span>5G</span><span className="wifi">⌁</span><BatteryGlyph percent={battery} charging={charging} small /></div>
          </div>

          <div className="lock-content">
            <div className="date-large">Senin, 5 Oktober</div>
            <div className="low-title">Baterai lemah</div>
            <div className="low-subtitle">Sambungkan charger untuk melanjutkan.</div>

            <div className={`main-battery ${charging ? 'active' : ''}`}>
              {charging ? (
                <ChargingRing percent={battery} />
              ) : (
                <>
                  <BatteryGlyph percent={battery} charging={false} />
                  <div className="battery-number">{Math.round(battery)}%</div>
                  <div className="battery-label">Baterai kritis</div>
                </>
              )}
            </div>

            <div className="charging-orbit" aria-hidden="true">
              <span className="orbit orbit-a" />
              <span className="orbit orbit-b" />
              <span className="orbit-dot dot-a" />
              <span className="orbit-dot dot-b" />
              <span className="orbit-dot dot-c" />
            </div>
          </div>

          <div className="screen-bottom-copy">CHARGE2LOGIN</div>
        </div>
        <div className={`phone-bottom-port ${connected ? 'port-connected' : ''}`} aria-label="Port USB-C" />
      </div>
    </div>
  );
}

function Cable({ cableRef, plugRef, plugPosition, dragging, connected, onPointerDown }) {
  // Short, relaxed cable from the bottom of the scene to the connector.
  // The connector stays centered so the user only drags it vertically like a zipper.
  const px = 50;
  const py = plugPosition.y;
  const endY = Math.min(99.2, py + 6.1);
  const curveY = Math.max(endY - 2.6, 94);
  const path = `M 50 99.4 C 50 98.8, 49.7 97.6, 50 ${curveY} C 50 ${curveY - 1.2}, 50 ${endY - 0.9}, ${px} ${endY}`;

  return (
    <div ref={cableRef} className={`cable-layer ${dragging ? 'dragging' : ''} ${connected ? 'connected' : ''}`}>
      <svg className="cable-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wireBody" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#131923" />
            <stop offset="0.5" stopColor="#2e3948" />
            <stop offset="1" stopColor="#0b1017" />
          </linearGradient>
          <linearGradient id="wireGlow" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0" stopColor="#182230" />
            <stop offset="0.42" stopColor="#4cdfff" />
            <stop offset="0.72" stopColor="#d9ffff" />
            <stop offset="1" stopColor="#65eaff" />
          </linearGradient>
        </defs>
        <path d={path} className="wire-shadow" />
        <path d={path} className="wire-main" />
        <path d={path} className="wire-sheen" />
        {connected && <path d={path} className="energy-path" />}
      </svg>

      <div className="cable-anchor" aria-hidden="true">
        <span className="anchor-ring" />
      </div>

      <button
        ref={plugRef}
        type="button"
        className={`usb-plug ${connected ? 'is-connected' : ''}`}
        style={{ left: `${plugPosition.x}%`, top: `${plugPosition.y}%` }}
        onPointerDown={onPointerDown}
        aria-label="Tarik konektor USB-C ke atas menuju port HP"
      >
        <span className="usb-metal-shell">
          <span className="usb-opening" />
          <span className="usb-contact-line" />
        </span>
        <span className="usb-neck" />
        <span className="usb-housing">
          <span className="housing-highlight" />
        </span>
        <span className="usb-strain-relief" />
        {!connected && <span className="plug-ripple" />}
      </button>

      {!connected && <div className="drag-hint"><span className="hint-arrow">↑</span><span>Tarik USB-C ke atas</span></div>}
      {connected && <div className="connected-badge">⚡ POWER CONNECTED</div>}
    </div>
  );
}

function EnergyStream({ active }) {
  if (!active) return null;
  return (
    <div className="energy-stream" aria-hidden="true">
      <span className="energy-column-glow" />
      <span className="energy-column-core" />
      <span className="energy-pulse pulse-one" />
      <span className="energy-pulse pulse-two" />
      <span className="energy-pulse pulse-three" />
      <span className="energy-tip-glow" />
      <span className="energy-tip" />
      <span className="energy-particle particle-one" />
      <span className="energy-particle particle-two" />
      <span className="energy-particle particle-three" />
      <span className="energy-particle particle-four" />
      <span className="energy-particle particle-five" />
    </div>
  );
}

function LoginLogo({ battery }) {
  return (
    <div className="login-logo" aria-hidden="true">
      <div className="login-halo" />
      <div className="login-orbit orbit-1" />
      <div className="login-orbit orbit-2" />
      <div className="login-orbit-dot dot-1" />
      <div className="login-orbit-dot dot-2" />
      <div className="login-logo-core">
        <BatteryGlyph percent={Math.max(42, battery)} charging />
        <span className="logo-lightning">⚡</span>
      </div>
    </div>
  );
}

function LoginPage({ battery, username, password, setUsername, setPassword, showPassword, setShowPassword, error, onSubmit }) {
  return (
    <div className="login-page">
      <LoginLogo battery={battery} />
      <div className="login-kicker">POWER RESTORED • SECURE ACCESS</div>
      <h1>Selamat Datang</h1>
      <p className="login-desc">Daya sudah terhubung. Masuk untuk melanjutkan.</p>

      <form className="login-card" onSubmit={onSubmit}>
        <label className="field-label">Username</label>
        <div className="input-wrap">
          <span className="input-symbol">◉</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" autoComplete="username" />
        </div>

        <label className="field-label">Password</label>
        <div className="input-wrap">
          <span className="input-symbol">◆</span>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password" />
          <button className="show-btn" type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Sembunyi' : 'Lihat'}</button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button className="login-btn" type="submit">
          <span>LOGIN</span>
          <strong>→</strong>
        </button>

        <div className="demo-note">Demo: <b>admin</b> / <b>1234</b></div>
      </form>
    </div>
  );
}

function SuccessPage({ username, onReset }) {
  return (
    <div className="success-page">
      <div className="success-mark">✓</div>
      <div className="login-kicker">AUTHENTICATION COMPLETE</div>
      <h1>Akses berhasil</h1>
      <p>Selamat datang kembali, <strong>{username.trim()}</strong>.</p>
      <button className="restart-btn" type="button" onClick={onReset}>ULANGI DEMO</button>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState(STAGE.LOW);
  const [battery, setBattery] = useState(1);
  const [plugPosition, setPlugPosition] = useState({ x: 50, y: 93.5 });
  const [dragging, setDragging] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Sambungkan charger untuk melanjutkan.');

  const sceneRef = useRef(null);
  const phoneRef = useRef(null);
  const plugRef = useRef(null);
  const holdRef = useRef(false);
  const timers = useRef([]);

  const addTimer = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (stage !== STAGE.CHARGING) return undefined;

    let raf = 0;
    let start = performance.now();
    const duration = 3600;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setBattery(1 + eased * 59);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else {
        setBattery(60);
        setStatus('Daya cukup. Menyiapkan login...');
        setStage(STAGE.TRANSITION);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  useEffect(() => {
    if (stage !== STAGE.TRANSITION) return undefined;
    const id = addTimer(() => setStage(STAGE.LOGIN), 950);
    return () => clearTimeout(id);
  }, [stage]);

  const pointToScene = (event) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 93.5 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const startDrag = (event) => {
    if (stage !== STAGE.LOW) return;
    holdRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setStatus('Tarik konektor USB-C ke port di bagian bawah HP.');
  };

  const moveDrag = (event) => {
    if (!holdRef.current || stage !== STAGE.LOW) return;
    const point = pointToScene(event);
    const y = Math.max(87.5, Math.min(93.5, point.y));
    setPlugPosition({ x: 50, y });
  };

  const endDrag = () => {
    if (!holdRef.current) return;
    holdRef.current = false;
    setDragging(false);

    const phone = phoneRef.current?.getBoundingClientRect();
    const plug = plugRef.current?.getBoundingClientRect();
    const scene = sceneRef.current?.getBoundingClientRect();
    if (!phone || !plug || !scene) return;

    const plugX = plug.left + plug.width / 2;
    const plugY = plug.top + plug.height / 2;
    const portX = phone.left + phone.width / 2;
    // Match the actual connector tip to the recessed USB-C port, not to the middle of the phone body.
    const portY = phone.bottom + 2;
    const targetPlugCenterY = portY + 32;
    const distance = Math.hypot(plugX - portX, plugY - targetPlugCenterY);

    if (distance < 34) {
      const targetPercentY = ((targetPlugCenterY - scene.top) / scene.height) * 100;
      setPlugPosition({ x: 50, y: targetPercentY });
      setBattery(1);
      setStatus('Charger terhubung. Energi mulai mengalir...');
      setStage(STAGE.CHARGING);
    } else {
      setStatus('Belum pas. Arahkan konektor ke port USB-C.');
      setPlugPosition({ x: 50, y: 93.5 });
    }
  };

  const login = (event) => {
    event.preventDefault();
    setError('');
    const u = username.trim();
    if (!u || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }
    if (u.toLowerCase() === 'admin' && password === '1234') setStage(STAGE.SUCCESS);
    else setError('Akun demo: admin / 1234');
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    holdRef.current = false;
    setStage(STAGE.LOW);
    setBattery(1);
    setPlugPosition({ x: 50, y: 93.5 });
    setDragging(false);
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setError('');
    setStatus('Sambungkan charger untuk melanjutkan.');
  };

  if (stage === STAGE.LOGIN || stage === STAGE.SUCCESS) {
    return (
      <main className="app app-login">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="grid-overlay" />
        <header className="topbar"><span className="brand-mark" /> <span>Charge2Login</span><span className="project-tag">React Interactive Project</span></header>
        {stage === STAGE.LOGIN ? (
          <LoginPage battery={battery} username={username} password={password} setUsername={setUsername} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} error={error} onSubmit={login} />
        ) : <SuccessPage username={username} onReset={reset} />}
        <footer>Interactive authentication • React + CSS</footer>
      </main>
    );
  }

  const charging = stage === STAGE.CHARGING;
  const exiting = stage === STAGE.TRANSITION;
  const phoneCharging = charging || exiting;

  return (
    <main className={`app ${charging ? 'app-charging' : ''} ${exiting ? 'app-transition' : ''}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-overlay" />
      <header className="topbar"><span className="brand-mark" /> <span>Charge2Login</span><span className="project-tag">React Interactive Project</span></header>

      <section className="charge-page">
        <div className="headline">
          <span className="eyebrow">POWER UP AUTHENTICATION</span>
          <h1>{charging ? 'Charging...' : exiting ? 'Power restored' : 'Baterai lemah'}</h1>
          <p>{exiting ? 'Memindahkan energi ke secure access.' : status}</p>
        </div>

        <div ref={sceneRef} className="charge-scene" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          <div className="phone-halo" />
          <div className="phone-floor-light" />
          <Phone phoneRef={phoneRef} battery={battery} charging={phoneCharging} exiting={exiting} connected={phoneCharging} />
          <EnergyStream active={charging} />
          <Cable cableRef={sceneRef} plugRef={plugRef} plugPosition={plugPosition} dragging={dragging} connected={charging} onPointerDown={startDrag} />
        </div>

        <div className="instruction-bar">
          <div className={`instruction-icon ${charging ? 'live' : ''}`}>{charging ? '⚡' : '↟'}</div>
          <div>
            <strong>{charging ? `Mengisi daya • ${Math.round(battery)}%` : 'Sambungkan charger'}</strong>
            <span>{charging ? 'Arus listrik sedang mengisi baterai.' : 'Tarik konektor USB-C dari bawah ke port HP.'}</span>
          </div>
          {!charging && !exiting && <div className="instruction-arrow">↑</div>}
        </div>
      </section>
    </main>
  );
}
