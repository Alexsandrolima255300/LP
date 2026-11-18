"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  tag?: string;
  description: string;
};

type CartLine = { product: Product; quantity: number };

const WHATSAPP_NUMBER = ""; // Configurar com o número oficial da loja, incluindo DDI e DDD.

const products: Product[] = [
  {
    id: 1,
    name: "Pulseira Elo Clássico",
    category: "Pulseiras",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
    tag: "DESTAQUE",
    description: "Uma peça de presença delicada para acompanhar diferentes momentos.",
  },
  {
    id: 2,
    name: "Colar Essenza",
    category: "Colares",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85",
    description: "Linhas limpas e brilho discreto em uma composição atemporal.",
  },
  {
    id: 3,
    name: "Anel Luce",
    category: "Anéis",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
    tag: "NOVO",
    description: "Design minimalista pensado para iluminar a composição.",
  },
  {
    id: 4,
    name: "Pingente Stella",
    category: "Pingentes",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    description: "Um detalhe especial que transforma o essencial.",
  },
  {
    id: 5,
    name: "Brinco Linea",
    category: "Brincos",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    description: "Elegância contemporânea com acabamento delicado.",
  },
  {
    id: 6,
    name: "Conjunto Luce",
    category: "Kits e conjuntos",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
    tag: "CONJUNTO",
    description: "Peças que conversam entre si para uma combinação harmoniosa.",
  },
  {
    id: 7,
    name: "Pulseira Minimal",
    category: "Pulseiras",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85",
    description: "Um clássico versátil para usar todos os dias.",
  },
  {
    id: 8,
    name: "Colar Fiore",
    category: "Colares",
    image: "https://images.unsplash.com/photo-1599459183200-59c7687a0279?auto=format&fit=crop&w=900&q=85",
    description: "Uma expressão sutil de personalidade e estilo.",
  },
];

const categories = [
  { name: "Pulseiras", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85" },
  { name: "Colares", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85" },
  { name: "Pingentes", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85" },
  { name: "Anéis", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85" },
  { name: "Brincos", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85" },
  { name: "Kits e conjuntos", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        product.category.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
      const matchesFavorite = !favoritesOnly || favorites.includes(product.id);
      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [activeCategory, favorites, favoritesOnly, search]);

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === id ? { ...line, quantity: line.quantity + amount } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function startWhatsAppOrder() {
    if (!WHATSAPP_NUMBER) {
      setNoticeOpen(true);
      return;
    }
    const message = [
      "Olá! Gostaria de fazer um pedido pela LP Jóias:",
      ...cart.map((line) => `• ${line.product.name} — quantidade: ${line.quantity}`),
      "",
      "Poderiam confirmar valores, disponibilidade e entrega?",
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function chooseCategory(category: string) {
    setActiveCategory(category);
    setFavoritesOnly(false);
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <div className="announcement">
        Uma experiência de elegância • Descubra a coleção LP Jóias
      </div>

      <header className="topbar">
        <button
          className="icon-button mobile-menu"
          aria-label="Abrir menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a className="brand" href="#" aria-label="LP Jóias - início">
          <span className="brand-name">LP JÓIAS</span>
          <span className="brand-sub">SILVER COLLECTION</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#colecoes">Coleções</a>
          <a href="#colecao">Novidades</a>
          <a href="#marca">A marca</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Buscar produtos"
            onClick={() => document.getElementById("product-search")?.focus()}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>
          <button
            className={`icon-button ${favoritesOnly ? "is-favorite" : ""}`}
            aria-label="Ver favoritos"
            onClick={() => {
              setFavoritesOnly((current) => !current);
              setActiveCategory("Todos");
              document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Heart size={19} strokeWidth={1.5} fill={favoritesOnly ? "currentColor" : "none"} />
          </button>
          <button className="icon-button" aria-label="Abrir carrinho" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && <span className="count">{cartCount}</span>}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Menu mobile">
          <a href="#inicio" onClick={() => setMobileMenuOpen(false)}>Início</a>
          <a href="#colecoes" onClick={() => setMobileMenuOpen(false)}>Coleções</a>
          <a href="#colecao" onClick={() => setMobileMenuOpen(false)}>Novidades</a>
          <a href="#marca" onClick={() => setMobileMenuOpen(false)}>A marca</a>
          <a href="#contato" onClick={() => setMobileMenuOpen(false)}>Contato</a>
        </nav>
      )}

      <section className="hero" id="inicio">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=2200&q=90"
          alt="Composição editorial de joias em prata"
        />
        <div className="hero-content">
          <div className="eyebrow">A essência da elegância</div>
          <h1>O brilho está nos <em>detalhes.</em></h1>
          <p className="hero-copy">
            Peças que traduzem personalidade, delicadeza e presença.
            Descubra uma curadoria pensada para acompanhar a sua história.
          </p>
          <a className="primary-button" href="#colecoes">
            Descobrir coleção <ArrowRight size={14} />
          </a>
        </div>
        <div className="hero-note">LP Jóias · Silver collection</div>
      </section>

      <section className="trust-strip" aria-label="Diferenciais da loja">
        <div className="trust-item"><Sparkles size={19} /> Curadoria especial</div>
        <div className="trust-item"><ShieldCheck size={19} /> Compra com atendimento</div>
        <div className="trust-item"><Truck size={19} /> Entrega com cuidado</div>
      </section>

      <section className="section" id="colecoes">
        <div className="section-heading">
          <div>
            <div className="section-kicker">Explore com personalidade</div>
            <h2 className="section-title">Nossas coleções</h2>
          </div>
          <p className="section-description">
            Encontre a peça que combina com o seu estilo. Uma seleção para
            presentear, celebrar e tornar cada momento especial.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              className="category-card"
              key={category.name}
              onClick={() => chooseCategory(category.name)}
              aria-label={`Ver categoria ${category.name}`}
            >
              <img src={category.image} alt="" loading="lazy" />
              <span className="category-label">
                <span>0{index + 1} / Coleção</span>
                <strong>{category.name}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section products-section" id="colecao">
        <div className="section-heading">
          <div>
            <div className="section-kicker">Seleção LP Jóias</div>
            <h2 className="section-title">
              {favoritesOnly ? "Seus favoritos" : "Peças em destaque"}
            </h2>
          </div>
          <p className="section-description">
            Conheça alguns modelos da coleção. Os valores e detalhes comerciais
            serão preenchidos pela loja antes da publicação.
          </p>
        </div>

        <div className="product-toolbar">
          <label className="search-box">
            <Search size={17} />
            <input
              id="product-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por peça ou categoria"
              aria-label="Buscar produtos"
            />
          </label>
          <div className="filter-list" aria-label="Filtrar por categoria">
            {["Todos", ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                className={`filter-chip ${activeCategory === category ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(category);
                  setFavoritesOnly(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.length === 0 ? (
            <div className="empty-state">
              {favoritesOnly
                ? "Você ainda não adicionou peças aos favoritos."
                : "Nenhuma peça encontrada. Tente outra busca ou categoria."}
            </div>
          ) : (
            visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button
                    className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`}
                    aria-label={favorites.includes(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={17} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    Valor a cadastrar
                    <small>Consulte disponibilidade com a loja</small>
                  </div>
                  <button className="add-button" onClick={() => addToCart(product)}>
                    Adicionar ao carrinho
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section story-section" id="marca">
        <img
          className="story-image"
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
          alt="Detalhe de joias em composição sofisticada"
          loading="lazy"
        />
        <div className="story-copy">
          <div className="section-kicker">A identidade LP</div>
          <h2 className="section-title">Mais que acessórios.<br />Uma expressão de você.</h2>
          <p>
            A LP Jóias acredita na beleza das escolhas feitas com intenção.
            Nossa proposta une estética contemporânea, delicadeza e peças
            escolhidas para fazer parte de histórias reais.
          </p>
          <a className="text-link" href="#contato">Conheça a LP Jóias <ArrowDownRight size={14} /></a>
        </div>
      </section>

      <section className="quote-section">
        <div className="quote-mark">“</div>
        <blockquote>O verdadeiro brilho não precisa chamar atenção. Ele permanece.</blockquote>
        <p>LP Jóias · Elegância em cada detalhe</p>
      </section>

      <section className="newsletter" id="contato">
        <div className="section-kicker">Fique por dentro</div>
        <h2>Novidades, com um toque especial.</h2>
        <p>Entre em contato com nossa equipe e descubra a coleção.</p>
        <a className="primary-button" href="#colecao">Explorar peças <ArrowRight size={14} /></a>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#inicio" style={{ alignItems: "flex-start" }}>
              <span className="brand-name">LP JÓIAS</span>
              <span className="brand-sub">SILVER COLLECTION</span>
            </a>
            <p>Elegância contemporânea em peças escolhidas para acompanhar você em todos os momentos.</p>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#colecoes">Coleções</a>
            <a href="#colecao">Novidades</a>
            <a href="#marca">Nossa essência</a>
          </div>
          <div className="footer-column">
            <h3>Atendimento</h3>
            <a href="#contato">Fale conosco</a>
            <a href="#contato">Entrega e pedidos</a>
            <a href="#contato">Dúvidas frequentes</a>
          </div>
          <div className="footer-column">
            <h3>LP Jóias</h3>
            <span>Instagram — configurar</span>
            <span>WhatsApp — configurar</span>
            <span>Políticas da loja</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} LP Jóias. Todos os direitos reservados.</span>
          <span>Uma experiência feita de detalhes.</span>
        </div>
      </footer>

      {cartOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
            <div className="drawer-header">
              <h2>Sua seleção</h2>
              <button className="close-button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>
                <X size={21} />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="drawer-empty">
                <ShoppingBag size={30} />
                <p>Seu carrinho está esperando por você.</p>
                <span>Adicione suas peças favoritas para continuar.</span>
              </div>
            ) : (
              <>
                {cart.map((line) => (
                  <div className="cart-line" key={line.product.id}>
                    <img src={line.product.image} alt={line.product.name} />
                    <div>
                      <h3>{line.product.name}</h3>
                      <p>Valor a confirmar com a loja</p>
                      <div className="quantity-control">
                        <button aria-label="Diminuir quantidade" onClick={() => changeQuantity(line.product.id, -1)}><Minus size={12} /></button>
                        <span>{line.quantity}</span>
                        <button aria-label="Aumentar quantidade" onClick={() => changeQuantity(line.product.id, 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                    <div className="cart-line-price">A confirmar</div>
                  </div>
                ))}
                <div className="cart-note">
                  Os preços e o valor fixo de entrega serão confirmados pela loja antes da conclusão do pedido.
                </div>
                <div className="cart-total"><span>Total</span><span>A confirmar</span></div>
                <button className="checkout-button" onClick={startWhatsAppOrder}>
                  Continuar pelo WhatsApp
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {noticeOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setNoticeOpen(false);
        }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="setup-notice-title">
            <h2 id="setup-notice-title">Falta configurar o WhatsApp</h2>
            <p>
              O carrinho já está preparado. Para ativar o envio do pedido, precisamos
              inserir o número oficial de WhatsApp da LP Jóias e cadastrar os preços
              reais dos produtos.
            </p>
            <div className="modal-actions">
              <button onClick={() => setNoticeOpen(false)}>Entendi</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
