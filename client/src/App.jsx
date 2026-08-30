import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const CATEGORIES = ['Classroom', 'Laboratory', 'IT / Wi-Fi', 'Hostel', 'Infrastructure', 'Transport', 'Cleanliness', 'Other'];
const DEPARTMENTS = ['IT Department', 'Maintenance', 'Infrastructure', 'Hostel Office', 'Transport', 'Housekeeping'];

const initialComplaints = [
  { id: 'CC-1001', title: 'Wi-Fi down in Block B', status: 'In Progress', priority: 'High', category: 'IT / Wi-Fi', location: 'Block B, 2nd floor', description: 'The internet has been unavailable for students in the lab area since morning.', createdAt: '2026-08-20', student: 'Aisha Khan', studentEmail: 'aisha@campus.edu', department: 'IT Department', assignedTo: 'Network Team', comment: 'Router reset completed and monitoring in progress.', resolution: '' },
  { id: 'CC-1003', title: 'Water leakage in hostel', status: 'Assigned', priority: 'Medium', category: 'Hostel', location: 'Girls Hostel, Room 214', description: 'Water leak near the sink has caused dampness and safety concerns.', createdAt: '2026-08-21', student: 'Meera Nair', studentEmail: 'meera@campus.edu', department: 'Maintenance', assignedTo: 'Civil Unit', comment: 'Leak report escalated to plumbing team.', resolution: '' },
  { id: 'CC-1009', title: 'Classroom projector issue', status: 'Resolved', priority: 'Low', category: 'Classroom', location: 'Science Block, Room 104', description: 'The projector fails to power on during lectures.', createdAt: '2026-08-22', student: 'Rohan Singh', studentEmail: 'rohan@campus.edu', department: 'Infrastructure', assignedTo: 'AV Support', comment: 'Lamp replaced and projector stabilized.', resolution: 'Projector restored and verified across lecture hall.' },
];

const demoUsers = [
  { name: 'Student User', email: 'student@campus.edu', password: 'student123', role: 'student' },
  { name: 'Admin User', email: 'admin@campus.edu', password: 'admin123', role: 'admin' },
];

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('campuscare_demo_complaints')) || initialComplaints;
    } catch {
      return initialComplaints;
    }
  });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('campuscare_user');
    const savedToken = localStorage.getItem('campuscare_token');
    if (savedUser && savedToken) {
      try { setUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('campuscare_user'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('campuscare_demo_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || 'Invalid email or password.');
      const loggedInUser = result.data.user;
      localStorage.setItem('campuscare_user', JSON.stringify(loggedInUser));
      localStorage.setItem('campuscare_token', result.data.token);
      setUser(loggedInUser);
    } catch (error) {
      // Keeps the demo accounts usable even if the backend is temporarily unavailable.
      const demo = demoUsers.find((item) => item.email === email && item.password === password);
      if (demo) {
        const safeUser = { name: demo.name, email: demo.email, role: demo.role };
        localStorage.setItem('campuscare_user', JSON.stringify(safeUser));
        localStorage.setItem('campuscare_token', 'demo-token');
        setUser(safeUser);
      } else alert(error.message || 'Invalid email or password.');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = String(formData.get('fullName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');
    const role = String(formData.get('role') || 'student');
    if (!name || !email || !password) return alert('Please complete all required fields.');
    if (password !== confirmPassword) return alert('Passwords do not match.');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || 'Registration failed.');
      alert('Registration successful. Please log in.');
      window.location.href = '/login';
    } catch (error) {
      alert(error.message || 'Registration failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('campuscare_user');
    localStorage.removeItem('campuscare_token');
    setUser(null);
  };

  const addComplaint = (complaint) => {
    setComplaints((current) => [complaint, ...current]);
    setNotice(`Complaint ${complaint.id} submitted successfully.`);
  };

  const updateComplaint = (id, patch) => {
    setComplaints((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const assignNext = () => {
    const target = complaints.find((item) => !['Resolved', 'Closed', 'Assigned', 'In Progress'].includes(item.status));
    if (!target) return setNotice('No unassigned active complaints.');
    updateComplaint(target.id, { status: 'Assigned', department: target.department || 'IT Department', assignedTo: 'Operations Team' });
    setNotice(`${target.id} assigned to ${target.department || 'IT Department'}.`);
  };

  const resolveComplaint = (id) => {
    updateComplaint(id, { status: 'Resolved', resolution: 'Issue resolved by the responsible department and verified by the admin team.' });
    setNotice('Complaint marked as resolved.');
  };

  const addComment = (id) => {
    const comment = window.prompt('Admin update / comment:', 'Reviewed and follow-up scheduled.');
    if (!comment) return;
    updateComplaint(id, { comment, status: 'Submitted' === complaints.find((x) => x.id === id)?.status ? 'Under Review' : complaints.find((x) => x.id === id)?.status });
    setNotice(`Update added to ${id}.`);
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  const navItems = user?.role === 'admin'
    ? [
        ['/', 'Overview', '⌂'], ['/admin', 'Dashboard', '▦'], ['/complaints', 'Complaints', '▤'], ['/notifications', 'Alerts', '◉'],
      ]
    : user?.role === 'student'
      ? [['/', 'Home', '⌂'], ['/dashboard', 'Dashboard', '▦'], ['/complaints', 'My Complaints', '▤'], ['/complaints/new', 'Report Issue', '+'], ['/notifications', 'Notifications', '◉'], ['/profile', 'Profile', '○']]
      : [['/', 'Home', '⌂'], ['/login', 'Login', '→'], ['/register', 'Register', '+']];

  return (
    <BrowserRouter>
      <div className={`app-shell theme-${theme} role-${user?.role || 'guest'}`}>
        <aside className="sidebar">
          <div>
            <div className="brand-wrap">
              <div className="brand-mark">CC</div>
              <div><div className="brand-name">CampusCare</div><div className="brand-subtitle">{user?.role === 'admin' ? 'Administration Console' : 'Student Support Portal'}</div></div>
            </div>
            {user && <div className="role-chip"><span className="role-dot" /> {user.role === 'admin' ? 'ADMINISTRATOR' : 'STUDENT ACCOUNT'}</div>}
          </div>

          <nav className="nav">
            {navItems.map(([to, label, icon]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-icon">{icon}</span><span>{label}</span></NavLink>)}
          </nav>

          <div className="sidebar-bottom">
            <button className="theme-toggle" onClick={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}>{theme === 'light' ? '☾  Dark mode' : '☀  Light mode'}</button>
            {user ? <div className="user-panel">
              <div className="profile-pill"><div className="avatar">{user.role === 'admin' ? 'AD' : 'SU'}</div><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
              <button className="logout-button" onClick={logout}>Sign out</button>
            </div> : <div className="guest-note">Sign in to access your portal.</div>}
          </div>
        </aside>

        <main className="page-container">
          {notice && <div className="global-notice"><span>✓</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}
          <Routes>
            <Route path="/" element={user ? <Navigate to={dashboardPath} replace /> : <HomePage />} />
            <Route path="/login" element={user ? <Navigate to={dashboardPath} replace /> : <AuthPage mode="login" onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to={dashboardPath} replace /> : <AuthPage mode="register" onRegister={handleRegister} />} />
            <Route path="/dashboard" element={user?.role === 'student' ? <StudentDashboard complaints={complaints} user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/complaints" element={user ? <ComplaintsPage complaints={complaints} user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/complaints/new" element={user?.role === 'student' ? <NewComplaintPage user={user} onSubmit={addComplaint} /> : <Navigate to="/login" replace />} />
            <Route path="/complaints/:id" element={user ? <ComplaintDetailPage complaints={complaints} user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/notifications" element={user ? <NotificationsPage user={user} complaints={complaints} /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user?.role === 'student' ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard complaints={complaints} updateComplaint={updateComplaint} assignNext={assignNext} resolveComplaint={resolveComplaint} addComment={addComment} /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return <div className="landing">
    <section className="landing-hero">
      <div className="hero-copy">
        <span className="eyebrow">COLLEGE COMPLAINT MANAGEMENT</span>
        <h1>One place to report.<br /><em>One system to resolve.</em></h1>
        <p>CampusCare connects students with the right college department, keeps every update visible, and creates accountability from submission to closure.</p>
        <div className="hero-actions"><Link to="/login" className="primary-btn">Open Student Portal →</Link><Link to="/register" className="secondary-btn">Create account</Link></div>
        <div className="workflow-strip"><span>01 Report</span><i>→</i><span>02 Review</span><i>→</i><span>03 Assign</span><i>→</i><span>04 Resolve</span></div>
      </div>
      <div className="hero-visual"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-ticket"><div className="ticket-top"><span className="status-live">● LIVE</span><span>CC-2048</span></div><h3>Projector not working</h3><p>Science Block · Room 104</p><div className="ticket-progress"><span /><span /><span /><span /><span className="muted-step" /></div><small>In Progress · IT Support</small></div><div className="floating-stat"><strong>94%</strong><span>issues resolved</span></div></div>
    </section>
    <section className="landing-features"><Feature icon="01" title="Report clearly" text="Category, description, location, priority and attachment in one guided form." /><Feature icon="02" title="Track everything" text="Follow the exact Submitted → Under Review → Assigned → In Progress → Resolved → Closed journey." /><Feature icon="03" title="Close the loop" text="Admins assign departments, add updates, record resolution details and manage priorities." /></section>
  </div>;
}

function Feature({ icon, title, text }) { return <article className="landing-feature"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>; }

function AuthPage({ mode, onLogin, onRegister }) {
  const login = mode === 'login';
  return <div className="auth-layout"><div className="auth-brand"><span className="eyebrow">CAMPUSCARE</span><h1>{login ? 'Welcome back.' : 'Make campus better.'}</h1><p>{login ? 'Sign in to track complaints, view updates and stay informed.' : 'Create your student account and make every campus issue visible and accountable.'}</p><div className="auth-checks"><span>✓ Complaint tracking</span><span>✓ Department assignment</span><span>✓ Transparent resolution</span></div></div><section className="auth-card"><div className="auth-card-head"><span className="auth-icon">{login ? '→' : '+'}</span><div><span className="muted-label">{login ? 'SECURE ACCESS' : 'GET STARTED'}</span><h2>{login ? 'Sign in' : 'Create account'}</h2></div></div><form className="stack-form" onSubmit={login ? onLogin : onRegister}>{!login && <><label>Full name<input name="fullName" placeholder="Your full name" required /></label><label>Account type<select name="role" defaultValue="student"><option value="student">Student</option><option value="admin">Admin</option></select></label></>}<label>Email address<input type="email" name="email" placeholder="you@college.edu" required /></label><label>Password<input type="password" name="password" placeholder="••••••••" required /></label>{!login && <label>Confirm password<input type="password" name="confirmPassword" placeholder="Repeat password" required /></label>}<button className="primary-btn full-width">{login ? 'Sign in to CampusCare' : 'Create account'}</button></form>{login && <div className="demo-box"><strong>Demo access</strong><span>Student: student@campus.edu / student123</span><span>Admin: admin@campus.edu / admin123</span></div>}<p className="auth-switch">{login ? <>New here? <Link to="/register">Create an account</Link></> : <>Already registered? <Link to="/login">Sign in</Link></>}</p></section></div>;
}

function StudentDashboard({ complaints, user }) {
  const mine = complaints.filter((x) => x.studentEmail === user?.email || x.student === user?.name || x.student === 'Student User');
  const active = mine.filter((x) => !['Resolved', 'Closed'].includes(x.status)).length;
  const resolved = mine.filter((x) => ['Resolved', 'Closed'].includes(x.status)).length;
  const latest = mine.slice(0, 3);
  return <div className="student-dashboard">
    <header className="dashboard-header student-header"><div><span className="eyebrow">STUDENT PORTAL</span><h1>Good to see you, {user?.name?.split(' ')[0] || 'Student'}.</h1><p>Here is what is happening with your campus issues.</p></div><Link to="/complaints/new" className="primary-btn">+ Report an issue</Link></header>
    <div className="student-stats"><Stat icon="▤" label="Total complaints" value={mine.length} tone="blue" /><Stat icon="◷" label="In progress" value={active} tone="amber" /><Stat icon="✓" label="Resolved" value={resolved} tone="green" /><Stat icon="!" label="Critical" value={mine.filter((x) => x.priority === 'Critical').length} tone="red" /></div>
    <div className="student-main-grid"><section className="dashboard-card track-card"><div className="card-heading"><div><span className="muted-label">LATEST REQUESTS</span><h2>Track your complaints</h2></div><Link to="/complaints">View all →</Link></div>{latest.length ? latest.map((item) => <ComplaintRow key={item.id} item={item} />) : <Empty text="You have not submitted a complaint yet." />}</section><aside className="dashboard-card how-card"><span className="muted-label">HOW IT WORKS</span><h2>From report to resolution</h2><div className="vertical-flow">{['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((step, index) => <div className="flow-step" key={step}><span>{index + 1}</span><div><strong>{step}</strong>{index < 5 && <small>{['Complaint received', 'Admin reviews issue', 'Department selected', 'Team is working', 'Resolution recorded'][index]}</small>}</div></div>)}</div></aside></div>
  </div>;
}

function Stat({ icon, label, value, tone }) { return <div className={`stat-card ${tone}`}><span className="stat-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong></div></div>; }
function ComplaintRow({ item }) { return <Link className="complaint-row" to={`/complaints/${item.id}`}><div className="complaint-id">{item.id}</div><div className="complaint-info"><strong>{item.title}</strong><span>{item.category} · {item.location}</span></div><StatusBadge status={item.status} /><PriorityBadge priority={item.priority} /><span className="row-arrow">→</span></Link>; }
function StatusBadge({ status }) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>; }
function PriorityBadge({ priority }) { return <span className={`priority-badge priority-${priority.toLowerCase()}`}>{priority}</span>; }
function Empty({ text }) { return <div className="empty-box">{text}</div>; }

function ComplaintsPage({ complaints, user }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const isAdmin = user?.role === 'admin';
  const visible = useMemo(() => complaints.filter((item) => {
    const mine = !isAdmin ? (item.studentEmail === user?.email || item.student === user?.name || item.student === 'Student User') : true;
    const text = `${item.id} ${item.title} ${item.category} ${item.location} ${item.student} ${item.department}`.toLowerCase();
    return mine && text.includes(search.toLowerCase()) && (status === 'All' || item.status === status) && (priority === 'All' || item.priority === priority);
  }), [complaints, search, status, priority, isAdmin, user]);
  return <section className={`list-page ${isAdmin ? 'admin-list-page' : ''}`}><header className="page-title-row"><div><span className="eyebrow">{isAdmin ? 'ADMIN WORK QUEUE' : 'MY COMPLAINT HISTORY'}</span><h1>{isAdmin ? 'Complaint Management' : 'My Complaints'}</h1><p>{isAdmin ? 'Search, filter and review every issue reported across campus.' : 'Every issue you report stays here with its complete status history.'}</p></div>{!isAdmin && <Link to="/complaints/new" className="primary-btn">+ New complaint</Link>}</header><div className="filter-bar"><div className="search-field"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAdmin ? 'Search ID, student, department or issue...' : 'Search your complaints...'} /></div><select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{STATUS_OPTIONS.map((x) => <option key={x}>{x}</option>)}</select><select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All</option>{['Low', 'Medium', 'High', 'Critical'].map((x) => <option key={x}>{x}</option>)}</select></div><div className="complaint-table-card"><div className="table-meta"><span>{visible.length} complaint{visible.length === 1 ? '' : 's'}</span><span>Updated just now</span></div><div className="table-wrap"><table><thead><tr><th>Complaint</th><th>{isAdmin ? 'Student' : 'Category'}</th><th>Priority</th><th>Status</th><th>Date</th><th /></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><Link to={`/complaints/${item.id}`} className="table-complaint"><strong>{item.title}</strong><span>{item.id} · {item.location}</span></Link></td><td>{isAdmin ? <span className="student-cell">{item.student || 'Student'}</span> : item.category}</td><td><PriorityBadge priority={item.priority} /></td><td><StatusBadge status={item.status} /></td><td>{item.createdAt}</td><td><Link className="table-open" to={`/complaints/${item.id}`}>Open →</Link></td></tr>)}</tbody></table></div>{!visible.length && <Empty text="No complaints match your filters." />}</div></section>;
}

function NewComplaintPage({ user, onSubmit }) {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const complaint = {
      id: `CC-${String(Date.now()).slice(-6)}`,
      title: String(data.get('title') || '').trim(), category: data.get('category'), description: String(data.get('description') || '').trim(), location: String(data.get('location') || '').trim(), priority: data.get('priority'), status: 'Submitted', createdAt: new Date().toISOString().slice(0, 10), student: user.name, studentEmail: user.email, attachment: fileName, department: '', assignedTo: '', comment: '', resolution: '',
    };
    onSubmit(complaint);
    navigate('/complaints');
  };
  return <section className="form-page"><div className="form-intro"><span className="eyebrow">NEW COMPLAINT</span><h1>Tell us what needs fixing.</h1><p>Give the college enough context to route your issue to the right team the first time.</p><div className="form-checklist"><span>✓ Required details</span><span>✓ Location-aware</span><span>✓ Priority based</span><span>✓ Attachment ready</span></div></div><form className="complaint-form" onSubmit={handleSubmit}><div className="form-section"><div className="form-section-number">01</div><div><h2>Issue details</h2><p>Describe the problem in a few clear words.</p></div></div><div className="form-grid"><label className="full-span">Complaint title<input name="title" placeholder="e.g. Wi-Fi is not working in Block B" required /></label><label>Category<select name="category" defaultValue="IT / Wi-Fi">{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></label><label>Priority<select name="priority" defaultValue="Medium"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><label className="full-span">Description<textarea name="description" rows="6" placeholder="Explain what happened, when it started and who is affected..." required /></label><label className="full-span">Location<input name="location" placeholder="Block, room, hostel, floor, lab, etc." required /></label></div><div className="form-section"><div className="form-section-number">02</div><div><h2>Evidence</h2><p>Add a screenshot or photo if it helps explain the issue.</p></div></div><label className="upload-box"><input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} /><span className="upload-icon">↑</span><strong>{fileName || 'Choose a file to attach'}</strong><small>{fileName ? 'Attachment selected' : 'PNG, JPG, PDF or DOC · optional'}</small></label><div className="form-actions"><Link to="/complaints" className="secondary-btn">Cancel</Link><button className="primary-btn">Submit complaint →</button></div></form></section>;
}

function ComplaintDetailPage({ complaints, user }) {
  const { id } = useParams();
  const item = complaints.find((x) => x.id === id);
  if (!item) return <section className="empty-page"><h1>Complaint not found</h1><Link to="/complaints">Back to complaints</Link></section>;
  const steps = STATUS_OPTIONS;
  const currentIndex = steps.indexOf(item.status);
  return <section className="detail-page"><Link to="/complaints" className="back-link">← Back to complaints</Link><header className="detail-header"><div><span className="eyebrow">{item.id}</span><h1>{item.title}</h1><p>Submitted {item.createdAt} · {item.category}</p></div><div className="detail-badges"><StatusBadge status={item.status} /><PriorityBadge priority={item.priority} /></div></header><div className="detail-layout"><div className="detail-main"><section className="detail-card"><div className="card-heading"><div><span className="muted-label">STATUS TRACKING</span><h2>Complaint journey</h2></div><strong>{item.status}</strong></div><div className="status-timeline">{steps.map((step, index) => <div className={`timeline-step ${index <= currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`} key={step}><span>{index < currentIndex ? '✓' : index + 1}</span><div><strong>{step}</strong><small>{index === 0 ? 'Issue submitted' : index === 1 ? 'Admin review' : index === 2 ? 'Department assigned' : index === 3 ? 'Work underway' : index === 4 ? 'Resolution recorded' : 'Student confirmation'}</small></div></div>)}</div></section><section className="detail-card"><span className="muted-label">ISSUE INFORMATION</span><div className="detail-facts"><Fact label="Category" value={item.category} /><Fact label="Location" value={item.location} /><Fact label="Reported by" value={item.student || user?.name} /><Fact label="Department" value={item.department || 'Awaiting assignment'} /><Fact label="Assigned staff" value={item.assignedTo || 'Not assigned yet'} /></div><div className="description-block"><span>Description</span><p>{item.description}</p></div>{item.attachment && <div className="attachment-chip">📎 {item.attachment}</div>}</section></div><aside className="detail-side"><section className="detail-card resolution-card"><span className="muted-label">ADMIN UPDATES</span><h3>Latest update</h3><p>{item.comment || 'No admin update has been added yet.'}</p></section><section className="detail-card resolution-card"><span className="muted-label">RESOLUTION DETAILS</span><h3>{item.status === 'Resolved' || item.status === 'Closed' ? 'Resolution recorded' : 'Awaiting resolution'}</h3><p>{item.resolution || 'The responsible team will add resolution details when the issue is fixed.'}</p></section></aside></div></section>;
}
function Fact({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function NotificationsPage({ complaints, user }) {
  const recent = complaints.slice(0, 4);
  return <section className="list-page"><header className="page-title-row"><div><span className="eyebrow">NOTIFICATIONS</span><h1>Updates & alerts</h1><p>Important complaint activity in one place.</p></div></header><div className="notification-grid">{recent.length ? recent.map((item) => <div className="notification-card" key={item.id}><span className="notification-dot">●</span><div><strong>{item.title}</strong><p>{item.id} is currently <b>{item.status}</b>.</p><small>For {item.student || user?.name}</small></div><Link to={`/complaints/${item.id}`}>View →</Link></div>) : <Empty text="No notifications yet." />}</div></section>;
}

function ProfilePage({ user }) {
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', department: 'Computer Science', year: '3rd Year', phone: '', address: '' });
  const [editing, setEditing] = useState(false);
  return <section className="profile-page"><header className="page-title-row"><div><span className="eyebrow">STUDENT PROFILE</span><h1>Your profile</h1><p>Keep your contact and academic details up to date.</p></div><button className="secondary-btn" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit profile'}</button></header><div className="profile-layout"><section className="profile-hero"><div className="profile-avatar-large">{user?.name?.slice(0, 2).toUpperCase() || 'SU'}</div><h2>{profile.name}</h2><p>{profile.email}</p><span className="role-chip">STUDENT</span></section><section className="profile-details"><div className="detail-card"><span className="muted-label">ACCOUNT INFORMATION</span>{editing ? <div className="form-grid profile-edit"><label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Email<input value={profile.email} disabled /></label><label>Department<input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} /></label><label>Year<input value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value })} /></label><label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label><label>Address<input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></label><button className="primary-btn" onClick={() => setEditing(false)}>Save changes</button></div> : <div className="detail-facts"><Fact label="Department" value={profile.department} /><Fact label="Year" value={profile.year} /><Fact label="Phone" value={profile.phone || 'Not added'} /><Fact label="Address" value={profile.address || 'Not added'} /></div>}</div></section></div></section>;
}

function AdminDashboard({ complaints, updateComplaint, assignNext, resolveComplaint, addComment }) {
  const [search, setSearch] = useState('');
  const pending = complaints.filter((x) => !['Resolved', 'Closed'].includes(x.status)).length;
  const resolved = complaints.filter((x) => ['Resolved', 'Closed'].includes(x.status)).length;
  const critical = complaints.filter((x) => x.priority === 'Critical').length;
  const inProgress = complaints.filter((x) => x.status === 'In Progress').length;
  const filtered = complaints.filter((x) => `${x.id} ${x.title} ${x.student} ${x.department}`.toLowerCase().includes(search.toLowerCase()));
  const departmentCounts = DEPARTMENTS.map((dept) => ({ dept, count: complaints.filter((x) => x.department === dept).length }));
  return <section className="admin-dashboard"><header className="admin-hero"><div><div className="admin-overline"><span className="live-dot" /> OPERATIONS CONTROL CENTER</div><h1>Good evening, Admin.</h1><p>Monitor campus issues, route work and keep resolution moving.</p></div><button className="admin-primary" onClick={assignNext}>Assign next complaint <span>→</span></button></header><div className="admin-kpis"><AdminKpi label="Total complaints" value={complaints.length} sub="All reported issues" icon="▤" /><AdminKpi label="Needs attention" value={pending} sub="Open & active" icon="◷" /><AdminKpi label="In progress" value={inProgress} sub="Teams working" icon="↗" /><AdminKpi label="Critical" value={critical} sub="Priority escalation" icon="!" danger /><AdminKpi label="Resolved" value={resolved} sub="Resolved / closed" icon="✓" good /></div><div className="admin-grid-new"><section className="admin-work-card"><div className="admin-card-header"><div><span className="muted-label">LIVE WORK QUEUE</span><h2>Complaint management</h2></div><div className="admin-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." /></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Issue</th><th>Student</th><th>Priority</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><div className="admin-issue"><strong>{item.title}</strong><span>{item.id} · {item.location}</span></div></td><td>{item.student || 'Student'}</td><td><PriorityBadge priority={item.priority} /></td><td><select value={item.department || ''} onChange={(e) => updateComplaint(item.id, { department: e.target.value, status: item.status === 'Submitted' ? 'Assigned' : item.status })}><option value="">Unassigned</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></td><td><select value={item.status} onChange={(e) => updateComplaint(item.id, { status: e.target.value })}>{STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}</select></td><td><div className="admin-action-group"><Link to={`/complaints/${item.id}`} className="icon-action">View</Link><button className="icon-action" onClick={() => addComment(item.id)}>Comment</button><button className="resolve-action" onClick={() => resolveComplaint(item.id)} disabled={item.status === 'Resolved' || item.status === 'Closed'}>Resolve</button></div></td></tr>)}</tbody></table>{!filtered.length && <Empty text="No complaints found." />}</div></section><aside className="admin-side-column"><section className="admin-side-card"><div className="admin-side-title"><div><span className="muted-label">DEPARTMENT LOAD</span><h3>Where work is going</h3></div></div><div className="department-bars">{departmentCounts.map(({ dept, count }) => <div className="department-bar" key={dept}><div><span>{dept}</span><strong>{count}</strong></div><div className="bar-track"><span style={{ width: `${Math.min(100, count * 25 + 8)}%` }} /></div></div>)}</div></section><section className="admin-side-card"><span className="muted-label">RECENT ACTIVITY</span><h3>Latest updates</h3><div className="admin-activity">{complaints.slice(0, 4).map((item) => <div key={item.id}><span className="activity-line" /><div><strong>{item.id} · {item.status}</strong><small>{item.title}</small></div></div>)}</div></section></aside></div></section>;
}
function AdminKpi({ label, value, sub, icon, danger, good }) { return <div className={`admin-kpi ${danger ? 'danger' : ''} ${good ? 'good' : ''}`}><span className="admin-kpi-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>; }

export default App;
