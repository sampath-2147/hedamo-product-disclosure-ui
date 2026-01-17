// -----------------------------
// Mock Data (Producer-declared)
// -----------------------------
const PRODUCTS = [
  {
    id: "p1",
    name: "SolarMax Panel 450W",
    category: "Solar Panels",
    producer: "SurgePV",
    status: "Published",
    updatedAt: "2026-01-15",
    declaredBy: "SurgePV",
    declaredAt: "2026-01-10",
    evidenceCount: 3,
    versions: [
      { version: 2, status: "Published", date: "2026-01-15" },
      { version: 1, status: "Submitted", date: "2026-01-10" },
    ],
  },
  {
    id: "p2",
    name: "VoltSafe Battery 5kWh",
    category: "Batteries",
    producer: "VoltSafe Energy",
    status: "Submitted",
    updatedAt: "2026-01-13",
    declaredBy: "VoltSafe Energy",
    declaredAt: "2026-01-12",
    evidenceCount: 1,
    versions: [
      { version: 2, status: "Submitted", date: "2026-01-13" },
      { version: 1, status: "Draft", date: "2026-01-11" },
    ],
  },
  {
    id: "p3",
    name: "GridFlow Inverter X2",
    category: "Inverters",
    producer: "GridFlow Systems",
    status: "Draft",
    updatedAt: "2026-01-09",
    declaredBy: "GridFlow Systems",
    declaredAt: "2026-01-09",
    evidenceCount: 0,
    versions: [
      { version: 2, status: "Draft", date: "2026-01-09" },
      { version: 1, status: "Draft", date: "2026-01-07" },
    ],
  },
  {
    id: "p4",
    name: "EcoWire Copper Cable 10m",
    category: "Cables",
    producer: "EcoWire Manufacturing",
    status: "Published",
    updatedAt: "2026-01-14",
    declaredBy: "EcoWire Manufacturing",
    declaredAt: "2026-01-08",
    evidenceCount: 2,
    versions: [
      { version: 2, status: "Published", date: "2026-01-14" },
      { version: 1, status: "Submitted", date: "2026-01-08" },
    ],
  },
  {
    id: "p5",
    name: "MountPro Bracket Kit",
    category: "Mounting",
    producer: "MountPro Tools",
    status: "Submitted",
    updatedAt: "2026-01-11",
    declaredBy: "MountPro Tools",
    declaredAt: "2026-01-10",
    evidenceCount: 0,
    versions: [
      { version: 2, status: "Submitted", date: "2026-01-11" },
      { version: 1, status: "Draft", date: "2026-01-09" },
    ],
  },
  {
    id: "p6",
    name: "SunTrack Panel 540W",
    category: "Solar Panels",
    producer: "SunTrack Labs",
    status: "Published",
    updatedAt: "2026-01-12",
    declaredBy: "SunTrack Labs",
    declaredAt: "2026-01-06",
    evidenceCount: 4,
    versions: [
      { version: 2, status: "Published", date: "2026-01-12" },
      { version: 1, status: "Submitted", date: "2026-01-06" },
    ],
  },
];

// -----------------------------
// DOM Elements
// -----------------------------
const searchEl = document.getElementById("search");
const categoryFilterEl = document.getElementById("categoryFilter");
const statusFilterEl = document.getElementById("statusFilter");
const sortEl = document.getElementById("sortSelect");
const clearBtn = document.getElementById("clearBtn");

const loadingEl = document.getElementById("loading");
const productGridEl = document.getElementById("productGrid");
const emptyStateEl = document.getElementById("emptyState");
const emptyClearBtn = document.getElementById("emptyClearBtn");
const activeChipsEl = document.getElementById("activeChips");

// Modal elements
const detailModal = document.getElementById("detailModal");
const closeModal = document.getElementById("closeModal");
const closeModal2 = document.getElementById("closeModal2");

const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const declaredByEl = document.getElementById("declaredBy");
const declaredOnEl = document.getElementById("declaredOn");
const evidenceCountEl = document.getElementById("evidenceCount");
const versionListEl = document.getElementById("versionList");
const currentStatusBadgeEl = document.getElementById("currentStatusBadge");

// -----------------------------
// Helpers
// -----------------------------
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function statusBadge(status) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border transition-soft";

  if (status === "Draft")
    return `<span class="${base} border-zinc-200 bg-zinc-50 text-zinc-700">Draft</span>`;

  if (status === "Submitted")
    return `<span class="${base} border-amber-200 bg-amber-50 text-amber-800">Submitted</span>`;

  return `<span class="${base} border-emerald-200 bg-emerald-50 text-emerald-800">Published</span>`;
}

function makeSkeletonCard() {
  return `
    <div class="rounded-2xl border border-zinc-200 bg-white p-4">
      <div class="h-4 w-2/3 rounded bg-zinc-100"></div>
      <div class="mt-3 h-3 w-1/2 rounded bg-zinc-100"></div>
      <div class="mt-4 flex items-center justify-between">
        <div class="h-6 w-20 rounded-full bg-zinc-100"></div>
        <div class="h-3 w-20 rounded bg-zinc-100"></div>
      </div>
    </div>
  `;
}

function matchesSearch(product, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.producer.toLowerCase().includes(q)
  );
}

function applySort(list, sortValue) {
  const arr = [...list];

  if (sortValue === "nameAsc") arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sortValue === "nameDesc") arr.sort((a, b) => b.name.localeCompare(a.name));
  if (sortValue === "dateAsc") arr.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  if (sortValue === "dateDesc") arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return arr;
}

function renderChips() {
  const chips = [];
  const category = categoryFilterEl.value;
  const status = statusFilterEl.value;

  if (category !== "All") {
    chips.push({
      label: `Category: ${category}`,
      onRemove: () => {
        categoryFilterEl.value = "All";
        render();
      },
    });
  }

  if (status !== "All") {
    chips.push({
      label: `Status: ${status}`,
      onRemove: () => {
        statusFilterEl.value = "All";
        render();
      },
    });
  }

  if (chips.length === 0) {
    activeChipsEl.innerHTML = "";
    return;
  }

  activeChipsEl.innerHTML = chips
    .map(
      (c, i) => `
      <button
        data-chip="${i}"
        class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 transition-soft hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-100"
      >
        ${c.label}
        <span class="text-zinc-400">×</span>
      </button>
    `
    )
    .join("");

  document.querySelectorAll("[data-chip]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-chip"));
      chips[idx].onRemove();
    });
  });
}

function renderProducts(products) {
  productGridEl.innerHTML = products
    .map((p) => {
      return `
        <button
          class="group text-left rounded-2xl border border-zinc-200 bg-white p-4 transition-soft hover:border-zinc-300 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-zinc-100"
          data-product-id="${p.id}"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold tracking-tight group-hover:underline">
                ${p.name}
              </h3>
              <p class="mt-1 text-xs text-zinc-500">
                ${p.category} • ${p.producer}
              </p>
            </div>
            <div>${statusBadge(p.status)}</div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-xs text-zinc-500">
              Last updated
              <span class="font-medium text-zinc-700">${formatDate(p.updatedAt)}</span>
            </p>
            <span class="text-xs text-zinc-400">View →</span>
          </div>
        </button>
      `;
    })
    .join("");

  // Click handlers
  document.querySelectorAll("[data-product-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-product-id");
      const product = PRODUCTS.find((x) => x.id === id);
      openDetail(product);
    });
  });
}

function openDetail(product) {
  detailTitle.textContent = product.name;
  detailMeta.textContent = `${product.category} • ${product.producer}`;

  declaredByEl.textContent = product.declaredBy;
  declaredOnEl.textContent = formatDate(product.declaredAt);
  evidenceCountEl.textContent =
    product.evidenceCount > 0 ? `${product.evidenceCount} file(s)` : "None";

  currentStatusBadgeEl.innerHTML = statusBadge(product.status);

  versionListEl.innerHTML = product.versions
    .map(
      (v) => `
      <div class="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
        <div>
          <p class="text-sm font-medium">Version ${v.version}</p>
          <p class="text-xs text-zinc-600">${formatDate(v.date)}</p>
        </div>
        <div>${statusBadge(v.status)}</div>
      </div>
    `
    )
    .join("");

  detailModal.classList.remove("hidden");
  detailModal.classList.add("flex");
}

function closeDetail() {
  detailModal.classList.add("hidden");
  detailModal.classList.remove("flex");
}

// -----------------------------
// Render Logic with Loading State
// -----------------------------
let firstLoad = true;

function render() {
  const query = searchEl.value.trim();
  const category = categoryFilterEl.value;
  const status = statusFilterEl.value;
  const sortValue = sortEl.value;

  renderChips();

  // Simulate loading only on first render (to show skeleton state)
  if (firstLoad) {
    loadingEl.innerHTML = Array.from({ length: 6 }).map(makeSkeletonCard).join("");
    productGridEl.innerHTML = "";
    emptyStateEl.classList.add("hidden");

    setTimeout(() => {
      firstLoad = false;
      loadingEl.innerHTML = "";
      render(); // render again after loading
    }, 700);

    return;
  }

  let filtered = PRODUCTS.filter((p) => matchesSearch(p, query));

  if (category !== "All") filtered = filtered.filter((p) => p.category === category);
  if (status !== "All") filtered = filtered.filter((p) => p.status === status);

  filtered = applySort(filtered, sortValue);

  if (filtered.length === 0) {
    productGridEl.innerHTML = "";
    emptyStateEl.classList.remove("hidden");
    return;
  }

  emptyStateEl.classList.add("hidden");
  renderProducts(filtered);
}

// -----------------------------
// Events
// -----------------------------
searchEl.addEventListener("input", render);
categoryFilterEl.addEventListener("change", render);
statusFilterEl.addEventListener("change", render);
sortEl.addEventListener("change", render);

clearBtn.addEventListener("click", () => {
  searchEl.value = "";
  categoryFilterEl.value = "All";
  statusFilterEl.value = "All";
  sortEl.value = "dateDesc";
  render();
});

emptyClearBtn.addEventListener("click", () => clearBtn.click());

closeModal.addEventListener("click", closeDetail);
closeModal2.addEventListener("click", closeDetail);

// Close modal when clicking backdrop
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) closeDetail();
});

// Keyboard: Esc closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDetail();
});

// Initial render
render();
