import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Heart,
  ImagePlus,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings2,
  Sun,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import { api } from './api.js';

const categories = [
  'all stories',
  'culture',
  'fashion',
  'people',
  'places',
  'traditions',
  'nature',
  'architecture',
  'events',
  'daily life',
];

const coverImage =
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1100&q=85';

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'A';
}

function KenteStripe({ className = '' }) {
  return <div className={`kente-stripe ${className}`} aria-hidden="true" />;
}

function Avatar({ name, image, size = 'normal' }) {
  if (image) {
    return <img className={`avatar avatar-${size}`} src={image} alt="" />;
  }
  return <span className={`avatar avatar-${size}`}>{initials(name)}</span>;
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span className={`toast-check ${toast.tone === 'error' ? 'toast-error' : ''}`}>
        {toast.tone === 'error' ? <X size={16} /> : <Check size={16} />}
      </span>
      <span>{toast.message}</span>
      <button className="icon-button toast-close" onClick={onClose} aria-label="Dismiss notification">
        <X size={16} />
      </button>
    </div>
  );
}

function Modal({ title, eyebrow, onClose, children, wide = false }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal-panel ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-topline">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id="modal-title">{title}</h2>
          </div>
          <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function PhotoCard({ photo, onOpen }) {
  return (
    <article className="photo-card">
      <button className="photo-card-image" onClick={() => onOpen(photo)} aria-label={`View ${photo.title}`}>
        <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
        <span className="photo-category">{photo.category}</span>
        <span className="photo-open"><ArrowUpRight size={18} /></span>
      </button>
      <div className="photo-card-copy">
        <div className="photo-card-title">
          <div>
            <h3>{photo.title}</h3>
            <p>{[photo.location, photo.country].filter(Boolean).join(' · ')}</p>
          </div>
          <Heart className="photo-heart" size={17} strokeWidth={1.8} aria-hidden="true" />
        </div>
        {photo.photographer?.name && (
          <div className="photo-credit">
            <Avatar name={photo.photographer.name} image={photo.photographer.profilePicture} size="small" />
            <span>by {photo.photographer.name}</span>
          </div>
        )}
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-label="Loading photo">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line skeleton-short" />
    </div>
  );
}

function EmptyState({ onShare, authenticated }) {
  return (
    <div className="empty-state">
      <div className="mudcloth-pattern" aria-hidden="true" />
      <div className="empty-icon"><ImagePlus size={25} strokeWidth={1.6} /></div>
      <p className="eyebrow">A space for your story</p>
      <h3>The gallery is waiting for its first frame.</h3>
      <p>Share a photograph that holds a place, a person, or a moment close to home.</p>
      <Button onClick={onShare}>
        <Camera size={17} /> {authenticated ? 'Share the first photograph' : 'Join the gallery'}
      </Button>
    </div>
  );
}

function AuthDialog({ mode, onModeChange, onClose, onSuccess, onError }) {
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    try {
      const result = mode === 'login'
        ? await api.login({ email: values.email, password: values.password })
        : await api.register({ name: values.name, email: values.email, password: values.password });
      onSuccess(result.data);
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      title={mode === 'login' ? 'Good to have you back.' : 'Come on in.'}
      eyebrow={mode === 'login' ? 'Welcome home' : 'Make space for your story'}
      onClose={onClose}
    >
      <p className="modal-intro">
        {mode === 'login'
          ? 'Sign in to share the moments that matter.'
          : 'Join a community keeping our stories in focus.'}
      </p>
      <form className="form-stack" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label className="field">
            <span>Your name</span>
            <input name="name" autoComplete="name" minLength="2" maxLength="100" required placeholder="e.g. Amara Okafor" />
          </label>
        )}
        <label className="field">
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength="8" required placeholder="At least 8 characters" />
        </label>
        <Button type="submit" disabled={busy} className="form-submit">
          {busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create your account'}
          {!busy && <ArrowRight size={17} />}
        </Button>
      </form>
      <p className="auth-switch">
        {mode === 'login' ? 'New to Sanaa?' : 'Already part of the community?'}{' '}
        <button onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </Modal>
  );
}

function UploadDialog({ onClose, onUploaded, onError, token }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('image');
    if (!(file instanceof File) || !file.size) {
      onError('Choose a photograph to upload.');
      return;
    }
    const tags = String(data.get('tags') || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    data.delete('tags');
    data.set('tags', JSON.stringify(tags));
    setBusy(true);
    try {
      await api.uploadPhoto(token, data);
      onUploaded();
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  }

  function selectFile(event) {
    const file = event.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  return (
    <Modal title="Share a photograph" eyebrow="Add a new frame" onClose={onClose} wide>
      <p className="modal-intro">Tell us where this moment lives. Your story becomes part of the collection.</p>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label className={`upload-drop ${preview ? 'has-preview' : ''}`}>
          {preview ? <img src={preview} alt="Selected upload preview" /> : (
            <span className="upload-prompt">
              <span className="upload-icon"><Upload size={21} /></span>
              <strong>Choose a photograph</strong>
              <span>JPEG, PNG or WebP · up to 10 MB</span>
            </span>
          )}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} required />
        </label>
        <div className="upload-fields">
          <label className="field">
            <span>Title</span>
            <input name="title" required minLength="2" maxLength="120" placeholder="The name of this moment" />
          </label>
          <label className="field">
            <span>Category</span>
            <select name="category" required defaultValue="">
              <option value="" disabled>Select a category</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Country</span>
            <input name="country" required maxLength="100" placeholder="e.g. Ghana" />
          </label>
          <label className="field">
            <span>Location <small>Optional</small></span>
            <input name="location" maxLength="200" placeholder="City, region, or place" />
          </label>
          <label className="field field-full">
            <span>A little about it <small>Optional</small></span>
            <textarea name="description" rows="3" maxLength="2000" placeholder="What would you like people to know?" />
          </label>
          <label className="field field-full">
            <span>Tags <small>Optional, separated by commas</small></span>
            <input name="tags" placeholder="family, celebration, home" />
          </label>
        </div>
        <div className="modal-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Sharing…' : 'Share photograph'} <ArrowRight size={17} /></Button>
        </div>
      </form>
    </Modal>
  );
}

function PhotoDialog({ photo, onClose }) {
  return (
    <Modal title={photo.title} eyebrow={photo.category} onClose={onClose} wide>
      <img className="detail-image" src={photo.imageUrl} alt={photo.title} />
      <div className="detail-copy">
        <div>
          <p className="detail-location">{[photo.location, photo.country].filter(Boolean).join(' · ')}</p>
          {photo.description && <p className="detail-description">{photo.description}</p>}
          {photo.photographer?.name && <p className="detail-credit">Shared by {photo.photographer.name}</p>}
        </div>
      </div>
    </Modal>
  );
}

function Sidebar({ activeTab, onNavigate, user, onAuth }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'gallery', label: 'Explore', icon: ImagePlus },
    { id: 'profile', label: 'My space', icon: UserRound },
  ];
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="Sanaa home">
        <span className="brand-mark">S</span>
        <span className="brand-copy"><strong>sanaa</strong><small>stories in every frame</small></span>
      </button>
      <KenteStripe className="sidebar-stripe" />
      <span className="nav-caption">Your space</span>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`} onClick={() => onNavigate(id)}>
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
            {id === 'gallery' && <ArrowUpRight className="nav-arrow" size={15} />}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="community-note">
        <span className="community-icon"><CircleHelp size={17} /></span>
        <p><strong>Stories bring us closer.</strong><br />Every frame belongs here.</p>
        <ArrowDownRight size={15} />
      </div>
      <button className="sidebar-profile" onClick={() => user ? onNavigate('profile') : onAuth()}>
        <Avatar name={user?.name || 'Guest'} image={user?.profilePicture} />
        <span className="sidebar-profile-copy"><strong>{user?.name || 'Your space'}</strong><small>{user ? 'View your profile' : 'Sign in to get started'}</small></span>
        <ArrowUpRight size={16} />
      </button>
    </aside>
  );
}

function BottomNav({ activeTab, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'gallery', label: 'Explore', icon: ImagePlus },
    { id: 'profile', label: 'My space', icon: UserRound },
  ];
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`bottom-nav-item ${activeTab === id ? 'bottom-nav-active' : ''}`} onClick={() => onNavigate(id)}>
          <Icon size={20} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sanaa-token') || '');
  const [photos, setPhotos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 0 });
  const [category, setCategory] = useState('all stories');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [authMode, setAuthMode] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('sanaa-theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('sanaa-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) return;
    api.me(token)
      .then((result) => setUser(result.data))
      .catch(() => {
        localStorage.removeItem('sanaa-token');
        setToken('');
        setUser(null);
      });
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setApiError('');
    const query = {
      page: pagination.page,
      limit: pagination.limit,
      search: appliedSearch,
      ...(category !== 'all stories' ? { category } : {}),
    };
    api.listPhotos(query)
      .then((result) => {
        if (cancelled) return;
        setPhotos(result.data?.photos || []);
        setPagination((current) => ({ ...current, ...(result.data?.pagination || {}) }));
      })
      .catch((error) => {
        if (!cancelled) {
          setPhotos([]);
          setApiError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [pagination.page, appliedSearch, category, refreshIndex]);

  function navigate(tab) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }

  function showToast(message, tone = 'success') {
    setToast({ message, tone });
  }

  function openShare() {
    if (!token) {
      setAuthMode('login');
      return;
    }
    setUploadOpen(true);
  }

  function handleAuthSuccess(account) {
    localStorage.setItem('sanaa-token', account.token);
    setToken(account.token);
    setUser(account);
    setAuthMode('');
    showToast(`Welcome, ${account.name}. You’re right at home.`);
  }

  function handleLogout() {
    localStorage.removeItem('sanaa-token');
    setToken('');
    setUser(null);
    showToast('You have signed out. Come back soon.');
  }

  function handleSearch(event) {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
    setPagination((current) => ({ ...current, page: 1 }));
    setActiveTab('gallery');
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function handleUploadSuccess() {
    setUploadOpen(false);
    setPagination((current) => ({ ...current, page: 1 }));
    setCategory('all stories');
    setAppliedSearch('');
    setSearchInput('');
    setActiveTab('gallery');
    setRefreshIndex((current) => current + 1);
    showToast('Your photograph is now part of the collection.');
  }

  const greetingName = user?.name?.split(' ')[0] || 'friend';

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={navigate}
        user={user}
        onAuth={() => setAuthMode('login')}
      />
      <div className="main-column">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => navigate('home')} aria-label="Sanaa home">
            <span className="brand-mark">S</span><strong>sanaa</strong>
          </button>
          <button className="mobile-menu-toggle icon-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          {mobileMenuOpen && (
            <div className="mobile-menu">
              {['home', 'gallery', 'profile'].map((tab) => (
                <button key={tab} onClick={() => navigate(tab)}>{tab === 'profile' ? 'My space' : tab === 'gallery' ? 'Explore' : 'Home'}</button>
              ))}
            </div>
          )}
          <form className="search-box" onSubmit={handleSearch} role="search">
            <Search size={17} />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Find a place, a person, a story…" aria-label="Search the gallery" />
            <kbd>↵</kbd>
          </form>
          <div className="topbar-right">
            <span className="topbar-note"><span className="status-dot" /> A living archive</span>
            <button className="topbar-user" onClick={() => user ? navigate('profile') : setAuthMode('login')} aria-label={user ? 'Open profile' : 'Sign in'}>
              <Avatar name={user?.name || 'Guest'} image={user?.profilePicture} />
            </button>
          </div>
        </header>
        <KenteStripe className="page-stripe" />

        <main className="page-content">
          {activeTab === 'home' && (
            <section className="home-page">
              <div className="welcome-row">
                <div>
                  <p className="eyebrow"><span className="eyebrow-dot" /> A gallery for us, by us</p>
                  <h1>Karibu, <em>{greetingName}</em><span className="greeting-comma">.</span></h1>
                  <p className="welcome-copy">A place to see ourselves, remember where we come from, and share where we’re going.</p>
                </div>
                <span className="home-date"><span className="home-date-mark">✳</span> Made of many stories</span>
              </div>

              <div className="home-hero">
                <div className="home-hero-copy">
                  <p className="eyebrow eyebrow-light">Our lives, in full colour</p>
                  <h2>Every frame<br />holds a <em>world.</em></h2>
                  <p>From the everyday to the unforgettable, these are the moments that make a home.</p>
                  <Button onClick={() => navigate('gallery')} className="hero-button">
                    Explore the gallery <ArrowRight size={17} />
                  </Button>
                  <span className="hero-note">A community-made collection</span>
                </div>
                <div className="home-hero-image">
                  <img src={photos[0]?.imageUrl || coverImage} alt={photos[0]?.title || 'Portrait celebrating African beauty'} />
                  <div className="hero-image-caption">
                    <span className="caption-line" />
                    <span>{photos[0]?.title || 'A living archive of us'}</span>
                    <span>{photos[0]?.country || 'Across the continent & beyond'}</span>
                  </div>
                  <div className="hero-image-stamp">S<br />✳<br />A</div>
                </div>
              </div>

              <div className="home-lower">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">A little inspiration</p>
                    <h2>Start with a story.</h2>
                  </div>
                  <button className="text-link" onClick={() => navigate('gallery')}>See all stories <ArrowUpRight size={16} /></button>
                </div>
                <div className="quick-actions">
                  <button className="quick-action" onClick={() => navigate('gallery')}>
                    <span className="quick-action-icon quick-terracotta"><Compass size={20} /></span>
                    <span><strong>Wander a while</strong><small>Find a new favourite frame</small></span>
                    <ArrowUpRight size={16} />
                  </button>
                  <button className="quick-action" onClick={openShare}>
                    <span className="quick-action-icon quick-green"><Camera size={20} /></span>
                    <span><strong>Bring your view</strong><small>Share a moment from home</small></span>
                    <ArrowUpRight size={16} />
                  </button>
                  <div className="quote-card">
                    <span className="quote-mark">“</span>
                    <p>We tell our stories so the next generation knows they were always here.</p>
                    <span className="quote-attribution">A thought for the day</span>
                  </div>
                </div>
              </div>

              <div className="home-footer-note"><span>01</span><span className="footer-note-line" /> Rooted in community. Open to the world.</div>
            </section>
          )}

          {activeTab === 'gallery' && (
            <section className="gallery-page">
              <div className="gallery-heading">
                <div>
                  <p className="eyebrow"><span className="eyebrow-dot" /> The collection</p>
                  <h1>Explore <em>stories.</em></h1>
                  <p className="welcome-copy">People, places, and the beautiful in-between.</p>
                </div>
                <Button onClick={openShare}><Camera size={17} /> Share a photograph</Button>
              </div>
              <div className="gallery-toolbar">
                <div className="category-tabs" role="tablist" aria-label="Filter gallery by category">
                  {categories.map((item) => (
                    <button
                      key={item}
                      role="tab"
                      aria-selected={category === item}
                      className={`category-tab ${category === item ? 'category-tab-active' : ''}`}
                      onClick={() => handleCategoryChange(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {appliedSearch && (
                  <button className="search-chip" onClick={() => { setAppliedSearch(''); setSearchInput(''); }}>
                    <Search size={14} /> “{appliedSearch}” <X size={14} />
                  </button>
                )}
              </div>

              {apiError && <div className="api-error" role="alert">{apiError}</div>}
              {loading ? (
                <div className="photo-grid">{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div>
              ) : photos.length ? (
                <>
                  <div className="gallery-results">
                    <span>{pagination.total} {pagination.total === 1 ? 'story' : 'stories'}</span>
                    <span>Collected with care <span className="gold-star">✳</span></span>
                  </div>
                  <div className="photo-grid">
                    {photos.map((photo) => <PhotoCard key={photo._id} photo={photo} onOpen={setSelectedPhoto} />)}
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button className="icon-button" disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))} aria-label="Previous page"><ChevronLeft size={19} /></button>
                      <span>Page <strong>{pagination.page}</strong> of {pagination.totalPages}</span>
                      <button className="icon-button" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))} aria-label="Next page"><ChevronRight size={19} /></button>
                    </div>
                  )}
                </>
              ) : !apiError ? (
                <EmptyState onShare={openShare} authenticated={Boolean(token)} />
              ) : (
                <div className="empty-state api-empty">
                  <div className="empty-icon"><CircleHelp size={25} /></div>
                  <h3>We couldn’t reach the collection.</h3>
                  <p>Check that the backend is running, then try again.</p>
                  <Button variant="outline" onClick={() => setRefreshIndex((current) => current + 1)}>Try again <ArrowRight size={16} /></Button>
                </div>
              )}
              <div className="gallery-bottom-note">Every story is a thread in the bigger picture. <span className="gold-star">✳</span></div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="profile-page">
              <div className="profile-heading">
                <div>
                  <p className="eyebrow"><span className="eyebrow-dot" /> Your corner</p>
                  <h1>My <em>space.</em></h1>
                  <p className="welcome-copy">Make yourself at home. This space is yours.</p>
                </div>
              </div>
              {user ? (
                <div className="profile-layout">
                  <section className="profile-card">
                    <div className="profile-card-top">
                      <div className="profile-avatar-wrap"><Avatar name={user.name} image={user.profilePicture} size="large" /><span className="profile-status" /></div>
                      <div className="profile-details">
                        <p className="eyebrow">Member of the collection</p>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                      </div>
                      <span className="member-badge"><span>✳</span> Community</span>
                    </div>
                    {user.bio && <p className="profile-bio">{user.bio}</p>}
                    <KenteStripe className="profile-stripe" />
                    <div className="profile-card-foot">
                      <span><span className="status-dot" /> Account active</span>
                      <button className="text-link" onClick={handleLogout}><LogOut size={16} /> Sign out</button>
                    </div>
                  </section>
                  <section className="settings-card">
                    <div className="settings-heading">
                      <span className="settings-icon"><Settings2 size={18} /></span>
                      <div><h3>Your settings</h3><p>Make Sanaa feel like yours.</p></div>
                    </div>
                    <div className="setting-row">
                      <div className="setting-description">
                        <span className="setting-symbol">{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</span>
                        <span><strong>Dark mode</strong><small>Easy on the eyes, day or night.</small></span>
                      </div>
                      <button
                        className={`toggle ${theme === 'dark' ? 'toggle-on' : ''}`}
                        role="switch"
                        aria-checked={theme === 'dark'}
                        aria-label="Toggle dark mode"
                        onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
                      ><span /></button>
                    </div>
                    <button className="setting-row setting-link" onClick={() => navigate('gallery')}>
                      <div className="setting-description">
                        <span className="setting-symbol"><ImagePlus size={18} /></span>
                        <span><strong>Explore the gallery</strong><small>Find your next favourite story.</small></span>
                      </div>
                      <ArrowRight size={18} />
                    </button>
                  </section>
                  <div className="profile-aside">
                    <span className="profile-aside-mark">“</span>
                    <p>Your perspective makes the collection more complete.</p>
                    <button className="text-link" onClick={openShare}>Share your view <ArrowUpRight size={16} /></button>
                  </div>
                </div>
              ) : (
                <div className="profile-guest">
                  <div className="empty-icon"><UserRound size={24} /></div>
                  <p className="eyebrow">Your story starts here</p>
                  <h2>There’s room for you.</h2>
                  <p>Sign in or make an account to share your photographs with the community.</p>
                  <Button onClick={() => setAuthMode('login')}>Sign in to your space <ArrowRight size={17} /></Button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onNavigate={navigate} />
      <Toast toast={toast} onClose={() => setToast(null)} />
      {authMode && (
        <AuthDialog
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode('')}
          onSuccess={handleAuthSuccess}
          onError={(message) => showToast(message, 'error')}
        />
      )}
      {uploadOpen && (
        <UploadDialog
          token={token}
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploadSuccess}
          onError={(message) => showToast(message, 'error')}
        />
      )}
      {selectedPhoto && <PhotoDialog photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}

export default App;
