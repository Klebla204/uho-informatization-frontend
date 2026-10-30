import { useEffect, useState } from 'react';
import { fetchBook, fetchBooks, fetchCategories, fetchLibraries } from './services/catalog';

function authorsLabel(authors = []) {
  return authors.map((author) => `${author.nombre} ${author.apellidos}`.trim()).join(', ') || 'Autor no especificado';
}

function Cover({ title, url, compact = false }) {
  if (url) return <img className={`book-cover-image${compact ? ' compact' : ''}`} src={url} alt={`Portada de ${title}`} loading="lazy" />;
  return <div className={`book-cover-placeholder${compact ? ' compact' : ''}`} aria-label={`Sin portada para ${title}`}><span>UHO</span><strong>{title?.slice(0, 1) || 'L'}</strong></div>;
}

function BookCard({ book, onOpen }) {
  const available = book.ejemplares_disponibles || 0;
  return (
    <button className="book-card" type="button" onClick={() => onOpen(book.id)} aria-label={`Abrir ficha de ${book.titulo}`}>
      <Cover title={book.titulo} url={book.portada_url} />
      <span className="book-card-body">
        <strong className="book-title">{book.titulo}</strong>
        <span className="book-author">{authorsLabel(book.autores)}</span>
        <span className={`availability ${available ? 'available' : 'unavailable'}`}>
          <i aria-hidden="true" />{available ? `${available} disponibles` : 'Sin disponibilidad'}
        </span>
      </span>
    </button>
  );
}

function BookDetail({ book, onClose, onRequest }) {
  if (!book) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="book-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="icon-close" type="button" onClick={onClose} aria-label="Cerrar ficha">×</button>
        <div className="detail-grid">
          <div>
            <Cover title={book.titulo} url={book.portada_url} compact />
            <section className="availability-list">
              <h3>Disponibilidad por biblioteca</h3>
              {(book.ejemplares || []).reduce((items, copy) => {
                const key = copy.biblioteca;
                const existing = items.find((item) => item.key === key);
                if (existing) {
                  if (copy.estado === 'DISPONIBLE') existing.count += 1;
                } else {
                  items.push({ key, name: copy.biblioteca_nombre, count: copy.estado === 'DISPONIBLE' ? 1 : 0 });
                }
                return items;
              }, []).map((item) => <div className="library-row" key={item.key}><span>{item.name}</span><b className={item.count ? 'text-available' : 'text-unavailable'}>{item.count ? `${item.count} disponibles` : 'No disponible'}</b></div>)}
              {!book.ejemplares?.length && <p className="muted">Sin ejemplares registrados.</p>}
            </section>
          </div>
          <div className="detail-copy">
            <span className={`availability ${book.ejemplares_disponibles ? 'available' : 'unavailable'}`}><i aria-hidden="true" />{book.ejemplares_disponibles ? `${book.ejemplares_disponibles} ejemplares disponibles` : 'Sin ejemplares disponibles'}</span>
            <h2 id="detail-title">{book.titulo}</h2>
            <p className="detail-meta"><b>Autor:</b> {authorsLabel(book.autores)}</p>
            <p className="detail-meta"><b>Editorial:</b> {book.editorial?.nombre || 'No especificada'}{book.año_edicion ? ` · ${book.año_edicion}` : ''}{book.edicion ? ` · ${book.edicion}` : ''}</p>
            {book.isbn && <p className="isbn">ISBN: {book.isbn}</p>}
            <div className="tag-row">{(book.categorias || []).map((category) => <span className="tag" key={category.id}>{category.nombre}</span>)}</div>
            <h3 className="description-heading">Descripción</h3>
            <p className="book-description">{book.resumen || 'No hay descripción disponible para este título.'}</p>
            <button className="request-button" type="button" disabled={!book.ejemplares_disponibles} onClick={onRequest}>
              {book.ejemplares_disponibles ? 'Solicitar préstamo' : 'No disponible'}
            </button>
            <p className="login-note">La solicitud de préstamo requiere autenticación institucional.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [library, setLibrary] = useState('');
  const [available, setAvailable] = useState(false);
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [libraryError, setLibraryError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [showInstitutionalNotice, setShowInstitutionalNotice] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        setBooks(await fetchBooks({ query, category, library, available, signal: controller.signal }));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'No se pudo cargar el catálogo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 250 : 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [query, category, library, available]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetchLibraries({ signal: controller.signal }), fetchCategories({ signal: controller.signal })])
      .then(([libraryData, categoryData]) => { setLibraries(libraryData); setCategories(categoryData); })
      .catch((requestError) => { if (requestError.name !== 'AbortError') setLibraryError(requestError.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function openBook(id) {
    setDetailLoading(true);
    setSelectedBook({ id, titulo: 'Cargando ficha…', autores: [], categorias: [], ejemplares: [] });
    try {
      setSelectedBook(await fetchBook(id));
    } catch (requestError) {
      setSelectedBook(null);
      setToast(requestError.message || 'No se pudo cargar la ficha.');
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="catalog-app">
      <header className="site-header">
        <a className="brand" href="#catalogo" aria-label="BiblioUHO inicio"><span className="brand-mark">UHO</span><span>Biblio<strong>UHO</strong></span></a>
        <span className="public-label"><i /> Catálogo público</span>
      </header>
      <main id="catalogo">
        <section className="catalog-hero">
          <div className="hero-content">
            <p className="hero-kicker">Bibliotecas de la Universidad de Holguín</p>
            <h1>Encuentra tu próxima lectura.</h1>
            <p className="hero-description">Busca títulos y consulta ejemplares disponibles en las bibliotecas de la UHO.</p>
            <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, autor o ISBN" aria-label="Buscar título, autor o ISBN" /><kbd>Buscar</kbd></label>
            <div className="hero-facts"><span><b>Catálogo UHO</b>Consulta pública</span><span><b>{books.length}</b> resultados actuales</span><span><b>{available ? 'Disponibles' : 'Todas las existencias'}</b>Filtro de inventario</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="book-stack"><span>UHO</span><i /><i /><i /></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /></div>
        </section>
        <section className="catalog-section" aria-label="Explorar catálogo">
          <aside className="filter-panel">
            <div className="filter-header"><h2>Filtros</h2><button type="button" onClick={() => { setCategory(''); setLibrary(''); setAvailable(false); setQuery(''); }}>Limpiar</button></div>
            <label className="filter-label" htmlFor="library-filter">Biblioteca</label>
            <select id="library-filter" value={library} onChange={(event) => setLibrary(event.target.value)}><option value="">Todas las bibliotecas</option>{libraries.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
            <label className="filter-label" htmlFor="category-filter">Categoría</label>
            <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
            <label className="availability-toggle"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /><span className="toggle-track" /><span>Solo disponibles</span></label>
            <p className="filter-help">{libraryError ? 'No se pudieron cargar las bibliotecas; puedes seguir buscando libros.' : 'Los resultados se actualizan automáticamente.'}</p>
          </aside>
          <div className="results-area">
            <div className="results-heading"><div><p className="section-kicker">CATÁLOGO COMPARTIDO</p><h2>Libros</h2></div><span className="result-count">{loading ? 'Buscando…' : `${books.length} resultados`}</span></div>
            {error && <div className="state-panel error-state"><strong>No pudimos conectar con el catálogo.</strong><span>{error}</span><button type="button" onClick={() => { setQuery(`${query} `); window.setTimeout(() => setQuery(query.trim()), 0); }}>Reintentar</button></div>}
            {loading && !error && <div className="state-panel" role="status">Cargando catálogo…</div>}
            {!loading && !error && !books.length && <div className="state-panel"><strong>No encontramos títulos.</strong><span>Prueba cambiar la búsqueda o quitar algún filtro.</span></div>}
            {!error && books.length > 0 && <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} onOpen={openBook} />)}</div>}
          </div>
        </section>
      </main>
      <footer className="site-footer"><span>BiblioUHO</span><span>Catálogo público · Universidad de Holguín</span></footer>
      {selectedBook && <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} onRequest={() => setShowInstitutionalNotice(true)} />}
      {showInstitutionalNotice && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowInstitutionalNotice(false); }}><section className="notice-dialog" role="dialog" aria-modal="true" aria-labelledby="institutional-title"><button className="icon-close" type="button" onClick={() => setShowInstitutionalNotice(false)} aria-label="Cerrar aviso">×</button><p className="section-kicker">SOLICITUD DE PRÉSTAMO</p><h2 id="institutional-title">Autenticación institucional requerida</h2><p>El catálogo es público. Para solicitar este libro será necesario iniciar sesión mediante el servicio de autenticación de la Universidad, cuya configuración está pendiente.</p><button className="request-button" type="button" onClick={() => setShowInstitutionalNotice(false)}>Entendido</button></section></div>}
      {detailLoading && <div className="loading-indicator" role="status">Cargando ficha…</div>}
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}
