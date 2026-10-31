import { AcademicResource, ResourceNote, ScoreSnapshot } from '../types';

const DB_NAME = 'termyar_academic_vault';
const DB_VERSION = 1;
const STORE_RESOURCES = 'academic_resources';
const STORE_NOTES = 'resource_notes';
const STORE_SNAPSHOTS = 'health_snapshots';

// Sample initial resources
export const initialResources: AcademicResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures — Trees & Graph Algorithms Complete Slide Deck',
    fileName: 'CS201_Lecture05_Trees_and_Graphs.pdf',
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: 4250000,
    fileSizeFormatted: '4.1 MB',
    uploadDate: '2025-02-14',
    courseId: 'c-1',
    courseCode: 'CS201',
    courseName: 'Data Structures',
    description: 'Comprehensive presentation slides covering Binary Search Trees, AVL balance rotations, and Dijkstra shortest path algorithm.',
    tags: ['Slides', 'Exam Material', 'Algorithms', 'Trees'],
    folder: 'جزوات و اسلایدها',
    ownerName: 'Alex Morgan',
    isFavorite: true,
    visibility: 'public',
    shareToken: 'token_cs201_trees_89af',
    downloadAllowed: true,
    pageCount: 6,
    samplePages: [
      {
        pageNumber: 1,
        title: 'Introduction to Non-Linear Data Structures & Binary Trees',
        text: 'A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. Key properties:\n- Height of complete tree: O(log N)\n- Maximum nodes at level L: 2^L\n- Traversal orders: Pre-order (NLR), In-order (LNR), Post-order (LRN)',
        diagramType: 'tree',
      },
      {
        pageNumber: 2,
        title: 'Binary Search Tree (BST) Invariants & Search Complexity',
        text: 'BST Property: For any node X, all elements in its left subtree are strictly less than X.val, and all elements in its right subtree are strictly greater than X.val.\n\nWorst-case search time: O(N) when degenerate into a linked list.\nBalanced search time: O(log N) using self-balancing rotations.',
        diagramType: 'bst',
      },
      {
        pageNumber: 3,
        title: 'Self-Balancing Trees: AVL Balance Factors & Rotations',
        text: 'An AVL tree enforces that for every node, the height difference between left and right subtrees is at most 1 (Balance Factor = Height(L) - Height(R) ∈ {-1, 0, 1}).\n\nFour rotation cases:\n1. Left-Left (LL) -> Single Right Rotation\n2. Right-Right (RR) -> Single Left Rotation\n3. Left-Right (LR) -> Double Rotation (L then R)\n4. Right-Left (RL) -> Double Rotation (R then L)',
        diagramType: 'avl',
      },
      {
        pageNumber: 4,
        title: 'Graph Representation: Adjacency Matrix vs Adjacency List',
        text: 'Adjacency Matrix: Space complexity O(V^2), optimal for dense graphs where edge lookups take O(1).\nAdjacency List: Space complexity O(V + E), optimal for sparse graphs where vertex degree iterations take O(deg(V)).',
        diagramType: 'graph',
      },
      {
        pageNumber: 5,
        title: "Dijkstra's Shortest Path Algorithm & Priority Queue Implementation",
        text: "Dijkstra's algorithm finds single-source shortest paths on non-negative weighted graphs. Using a binary min-heap / priority queue, the time complexity is O((V + E) log V).\n\nInvariant: When a vertex is extracted from the priority queue, its computed distance is optimal.",
        diagramType: 'dijkstra',
      },
      {
        pageNumber: 6,
        title: 'Summary, Midterm Review Questions & Practice Problems',
        text: 'Exam Focus Tips:\n1. Be prepared to draw tree balance rotations step-by-step.\n2. Trace BFS vs DFS vertex visit orders on directed graphs.\n3. Implement Cycle Detection using Disjoint-Set Union (Union-Find).',
        diagramType: 'summary',
      },
    ],
  },
  {
    id: 'res-2',
    title: 'Calculus II — Integration Techniques & Series Convergence Cheat Sheet',
    fileName: 'MATH102_Formula_Sheet_Integration.pdf',
    fileType: 'pdf',
    mimeType: 'application/pdf',
    fileSize: 1820000,
    fileSizeFormatted: '1.7 MB',
    uploadDate: '2025-02-18',
    courseId: 'c-3',
    courseCode: 'MATH102',
    courseName: 'Calculus II',
    description: 'Concise formula cheat sheet: integration by parts, trigonometric substitutions, Taylor series expansions, and ratio test summaries.',
    tags: ['Formula Sheet', 'Midterm', 'Calculus'],
    folder: 'خلاصه و فرمول‌ها',
    ownerName: 'Alex Morgan',
    isFavorite: true,
    visibility: 'link',
    shareToken: 'token_math102_formulas_32bd',
    downloadAllowed: true,
    pageCount: 4,
    samplePages: [
      {
        pageNumber: 1,
        title: 'Standard Integration Formulas & Substitution Shortcuts',
        text: '∫ u dv = uv - ∫ v du (Integration by Parts)\nLIATE rule for choosing u:\nL: Logarithmic\nI: Inverse trigonometric\nA: Algebraic\nT: Trigonometric\nE: Exponential',
        diagramType: 'summary',
      },
      {
        pageNumber: 2,
        title: 'Trigonometric Substitutions & Partial Fractions',
        text: '√(a² - x²)  =>  x = a sin(θ)\n√(a² + x²)  =>  x = a tan(θ)\n√(x² - a²)  =>  x = a sec(θ)\n\nDecomposition of Rational Functions P(x)/Q(x): Factor denominators and solve coefficients.',
        diagramType: 'summary',
      },
      {
        pageNumber: 3,
        title: 'Infinite Series Convergence Tests',
        text: '1. Divergence Test: If lim an ≠ 0, series diverges.\n2. Integral Test: Compare with ∫ f(x) dx.\n3. Ratio Test: L = lim |a_{n+1}/a_n|. Converges if L < 1, diverges if L > 1.\n4. Alternating Series (Leibniz): Converges if |a_n| decreases monotonically to 0.',
        diagramType: 'summary',
      },
      {
        pageNumber: 4,
        title: 'Taylor & Maclaurin Power Series Reference Table',
        text: 'e^x = ∑ x^n / n!\nsin(x) = ∑ (-1)^n x^(2n+1) / (2n+1)!\ncos(x) = ∑ (-1)^n x^(2n) / (2n)!\n1/(1-x) = ∑ x^n for |x| < 1',
        diagramType: 'summary',
      },
    ],
  },
  {
    id: 'res-3',
    title: 'Statistics — Probability Distributions & Hypothesis Testing Notebook',
    fileName: 'STAT101_Probability_Distributions.docx',
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 890000,
    fileSizeFormatted: '870 KB',
    uploadDate: '2025-02-21',
    courseId: 'c-2',
    courseCode: 'STAT101',
    courseName: 'Statistics',
    description: 'Lecture notes covering Normal distributions, Central Limit Theorem, confidence intervals, and p-value interpretations.',
    tags: ['Notes', 'Statistics', 'Homework'],
    folder: 'جزوات و اسلایدها',
    ownerName: 'Alex Morgan',
    isFavorite: false,
    visibility: 'private',
    shareToken: 'token_stat101_prob_91ce',
    downloadAllowed: true,
    pageCount: 3,
    samplePages: [
      {
        pageNumber: 1,
        title: 'Random Variables & Continuous Probability Density Functions',
        text: 'A continuous random variable X has probability density function f(x) satisfying f(x) ≥ 0 and ∫ f(x)dx = 1. Expectation E[X] = ∫ x f(x) dx. Variance Var(X) = E[X^2] - (E[X])^2.',
      },
      {
        pageNumber: 2,
        title: 'Normal Distribution & The Central Limit Theorem',
        text: 'X ~ N(μ, σ²). Standard normal Z = (X - μ) / σ. By CLT, the sampling distribution of sample means approaches normal distribution regardless of population shape as n ≥ 30.',
      },
      {
        pageNumber: 3,
        title: 'Hypothesis Testing Framework (Z-Test vs Student t-Test)',
        text: 'Null hypothesis H0 vs Alternative H1. Type I error (α) and Type II error (β). When population variance is unknown and sample is small, use Student t-distribution with n-1 degrees of freedom.',
      },
    ],
  },
  {
    id: 'res-4',
    title: 'Physics II — Electromagnetism Maxwell Equations Infographic',
    fileName: 'PHYS101_Maxwell_Equations_Diagram.png',
    fileType: 'image',
    mimeType: 'image/png',
    fileSize: 1200000,
    fileSizeFormatted: '1.2 MB',
    uploadDate: '2025-02-22',
    courseId: 'c-4',
    courseCode: 'PHYS101',
    courseName: 'Physics II',
    description: 'High-resolution infographic summarizing Gauss law, Faraday induction law, and Ampere-Maxwell circulating field equations.',
    tags: ['Infographic', 'Formulas', 'Physics'],
    folder: 'خلاصه و فرمول‌ها',
    ownerName: 'Alex Morgan',
    isFavorite: false,
    visibility: 'public',
    shareToken: 'token_phys101_maxwell_44a1',
    downloadAllowed: true,
    pageCount: 1,
    samplePages: [
      {
        pageNumber: 1,
        title: 'The Four Fundamental Maxwell Equations in Differential & Integral Form',
        text: '1. Gauss Law for Electricity: ∮ E·dA = Q_enc / ε₀\n2. Gauss Law for Magnetism: ∮ B·dA = 0\n3. Faraday Law of Induction: ∮ E·ds = -dΦ_B / dt\n4. Ampere-Maxwell Law: ∮ B·ds = μ₀(I_enc + ε₀ dΦ_E / dt)',
        diagramType: 'summary',
      },
    ],
  },
];

export const initialNotes: ResourceNote[] = [
  {
    id: 'note-1',
    resourceId: 'res-1',
    pageNumber: 3,
    content: 'Very important for Midterm: Remember that LR rotation requires rotating left child to the left first, then parent to the right!',
    author: 'Alex Morgan',
    createdAt: '2025-02-15 14:30',
    color: 'yellow',
  },
  {
    id: 'note-2',
    resourceId: 'res-1',
    pageNumber: 5,
    content: 'Dr. Johnson confirmed in class that Dijkstra implementation questions will definitely feature in Quiz 2.',
    author: 'Alex Morgan',
    createdAt: '2025-02-16 10:15',
    color: 'blue',
  },
  {
    id: 'note-3',
    resourceId: 'res-2',
    pageNumber: 1,
    content: 'Review substitution with arctan for rational functions where denominator has irreducible quadratics.',
    author: 'Alex Morgan',
    createdAt: '2025-02-19 16:45',
    color: 'green',
  },
];

// Open IndexedDB instance safely
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_RESOURCES)) {
        db.createObjectStore(STORE_RESOURCES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        db.createObjectStore(STORE_SNAPSHOTS, { keyPath: 'week' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Memory / LocalStorage fallback helpers
const LS_RESOURCES_KEY = 'ty_vault_resources_v1';
const LS_NOTES_KEY = 'ty_vault_notes_v1';

export async function loadAllResources(): Promise<AcademicResource[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_RESOURCES, 'readonly');
      const store = tx.objectStore(STORE_RESOURCES);
      const request = store.getAll();
      request.onsuccess = () => {
        if (request.result && request.result.length > 0) {
          resolve(request.result);
        } else {
          // Initialize with initial resources
          seedInitialResources(db).then(resolve);
        }
      };
      request.onerror = () => {
        resolve(loadFromLocalStorage());
      };
    });
  } catch {
    return loadFromLocalStorage();
  }
}

async function seedInitialResources(db: IDBDatabase): Promise<AcademicResource[]> {
  const tx = db.transaction(STORE_RESOURCES, 'readwrite');
  const store = tx.objectStore(STORE_RESOURCES);
  for (const item of initialResources) {
    store.put(item);
  }
  return new Promise((resolve) => {
    tx.oncomplete = () => {
      localStorage.setItem(LS_RESOURCES_KEY, JSON.stringify(initialResources));
      resolve(initialResources);
    };
    tx.onerror = () => resolve(initialResources);
  });
}

function loadFromLocalStorage(): AcademicResource[] {
  try {
    const raw = localStorage.getItem(LS_RESOURCES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LS_RESOURCES_KEY, JSON.stringify(initialResources));
    return initialResources;
  } catch {
    return initialResources;
  }
}

export async function saveResourceToVault(resource: AcademicResource): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_RESOURCES, 'readwrite');
    tx.objectStore(STORE_RESOURCES).put(resource);
  } catch {
    // ignore
  }
  // Sync to localStorage
  try {
    const current = loadFromLocalStorage();
    const filtered = current.filter((r) => r.id !== resource.id);
    localStorage.setItem(LS_RESOURCES_KEY, JSON.stringify([resource, ...filtered]));
  } catch (err) {
    console.warn('LocalStorage quota or write error', err);
  }
}

export async function deleteResourceFromVault(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_RESOURCES, 'readwrite');
    tx.objectStore(STORE_RESOURCES).delete(id);
  } catch {
    // ignore
  }
  try {
    const current = loadFromLocalStorage();
    localStorage.setItem(LS_RESOURCES_KEY, JSON.stringify(current.filter((r) => r.id !== id)));
  } catch {
    // ignore
  }
}

// Notes management
export async function loadResourceNotes(resourceId?: string): Promise<ResourceNote[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.getAll();
      req.onsuccess = () => {
        let notes = req.result as ResourceNote[];
        if (!notes || notes.length === 0) {
          notes = loadNotesFromLocalStorage();
        }
        if (resourceId) {
          resolve(notes.filter((n) => n.resourceId === resourceId));
        } else {
          resolve(notes);
        }
      };
      req.onerror = () => resolve(loadNotesFromLocalStorage(resourceId));
    });
  } catch {
    return loadNotesFromLocalStorage(resourceId);
  }
}

function loadNotesFromLocalStorage(resourceId?: string): ResourceNote[] {
  try {
    const raw = localStorage.getItem(LS_NOTES_KEY);
    const notes: ResourceNote[] = raw ? JSON.parse(raw) : initialNotes;
    if (resourceId) return notes.filter((n) => n.resourceId === resourceId);
    return notes;
  } catch {
    return resourceId ? initialNotes.filter((n) => n.resourceId === resourceId) : initialNotes;
  }
}

export async function saveNoteToVault(note: ResourceNote): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    tx.objectStore(STORE_NOTES).put(note);
  } catch {
    // ignore
  }
  try {
    const all = loadNotesFromLocalStorage();
    const updated = [note, ...all.filter((n) => n.id !== note.id)];
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export async function deleteNoteFromVault(noteId: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NOTES, 'readwrite');
    tx.objectStore(STORE_NOTES).delete(noteId);
  } catch {
    // ignore
  }
  try {
    const all = loadNotesFromLocalStorage();
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(all.filter((n) => n.id !== noteId)));
  } catch {
    // ignore
  }
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
