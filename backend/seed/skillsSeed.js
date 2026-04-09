const seedSkills = [
  // ── Data Structures & Algorithms ──────────────────────────
  {
    skillName: "Arrays & Strings",
    category: "Data Structures & Algorithms",
    description:
      "Two-pointer, sliding window, prefix sums, in-place manipulation",
    importanceLevel: "High",
    expectedLevel: "Solve Medium in 20 min",
    resources: [
      { title: "NeetCode Arrays Playlist", url: "https://neetcode.io/roadmap" },
    ],
    orderIndex: 1,
  },
  {
    skillName: "Binary Search",
    category: "Data Structures & Algorithms",
    description: "Classic and rotated variants, search in answer space",
    importanceLevel: "High",
    expectedLevel: "Solve Medium in 15 min",
    resources: [
      {
        title: "LC Binary Search tag",
        url: "https://leetcode.com/tag/binary-search",
      },
    ],
    orderIndex: 2,
  },
  {
    skillName: "Linked Lists",
    category: "Data Structures & Algorithms",
    description: "Reverse, cycle detection, merge, dummy node tricks",
    importanceLevel: "High",
    expectedLevel: "Solve Medium in 20 min",
    resources: [
      {
        title: "LC Linked List tag",
        url: "https://leetcode.com/tag/linked-list",
      },
    ],
    orderIndex: 3,
  },
  {
    skillName: "Stacks & Queues",
    category: "Data Structures & Algorithms",
    description: "Monotonic stack, BFS queue, deque for sliding window",
    importanceLevel: "High",
    expectedLevel: "Recognize pattern quickly",
    resources: [{ title: "CP Algorithms", url: "https://cp-algorithms.com" }],
    orderIndex: 4,
  },
  {
    skillName: "Trees & BST",
    category: "Data Structures & Algorithms",
    description: "DFS/BFS traversals, LCA, BST operations, diameter, path sum",
    importanceLevel: "High",
    expectedLevel: "Solve Medium in 25 min",
    resources: [
      { title: "NeetCode Trees", url: "https://neetcode.io/roadmap" },
    ],
    orderIndex: 5,
  },
  {
    skillName: "Graphs (DFS/BFS)",
    category: "Data Structures & Algorithms",
    description:
      "Adjacency list, cycle detection, topological sort, connected components",
    importanceLevel: "High",
    expectedLevel: "Implement BFS/DFS from scratch",
    resources: [
      {
        title: "Graph Theory Algorithms",
        url: "https://youtube.com/c/WilliamFiset-videos",
      },
    ],
    orderIndex: 6,
  },
  {
    skillName: "Dynamic Programming",
    category: "Data Structures & Algorithms",
    description: "Memoization, tabulation, 1D/2D DP, knapsack variants",
    importanceLevel: "High",
    expectedLevel: "Identify subproblem and recurrence",
    resources: [
      {
        title: "Aditya Verma DP Playlist",
        url: "https://youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go",
      },
    ],
    orderIndex: 7,
  },
  {
    skillName: "Heaps & Priority Queues",
    category: "Data Structures & Algorithms",
    description: "Top-K elements, K-way merge, median of stream",
    importanceLevel: "High",
    expectedLevel: "Use heap in O(n log k) solutions",
    resources: [
      {
        title: "LC Heap tag",
        url: "https://leetcode.com/tag/heap-priority-queue",
      },
    ],
    orderIndex: 8,
  },
  {
    skillName: "Trie",
    category: "Data Structures & Algorithms",
    description: "Prefix search, autocomplete, word dictionary",
    importanceLevel: "Medium",
    expectedLevel: "Implement from scratch",
    resources: [{ title: "LC Trie tag", url: "https://leetcode.com/tag/trie" }],
    orderIndex: 9,
  },
  {
    skillName: "Backtracking",
    category: "Data Structures & Algorithms",
    description: "Permutations, combinations, subsets, N-queens, Sudoku",
    importanceLevel: "Medium",
    expectedLevel: "Write clean recursive solution",
    resources: [
      {
        title: "LC Backtracking tag",
        url: "https://leetcode.com/tag/backtracking",
      },
    ],
    orderIndex: 10,
  },
  {
    skillName: "Union-Find (DSU)",
    category: "Data Structures & Algorithms",
    description:
      "Connected components, Kruskal MST, cycle detection in undirected graphs",
    importanceLevel: "Medium",
    expectedLevel: "Implement with path compression + union by rank",
    resources: [
      {
        title: "CP Algorithms DSU",
        url: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
      },
    ],
    orderIndex: 11,
  },
  {
    skillName: "Bit Manipulation",
    category: "Data Structures & Algorithms",
    description: "XOR tricks, bitmask DP, bit counting",
    importanceLevel: "Low",
    expectedLevel: "Understand common patterns",
    resources: [
      {
        title: "LC Bit Manipulation tag",
        url: "https://leetcode.com/tag/bit-manipulation",
      },
    ],
    orderIndex: 12,
  },

  // ── System Design ──────────────────────────────────────────
  {
    skillName: "URL Shortener (TinyURL)",
    category: "System Design",
    description: "Hashing, DB schema, redirects, analytics",
    importanceLevel: "High",
    expectedLevel: "Full design in 45 min",
    resources: [
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
      },
    ],
    orderIndex: 1,
  },
  {
    skillName: "Rate Limiter",
    category: "System Design",
    description: "Token bucket, leaky bucket, sliding window counter",
    importanceLevel: "High",
    expectedLevel: "Explain tradeoffs clearly",
    resources: [
      {
        title: "Grokking SDI",
        url: "https://educative.io/courses/grokking-the-system-design-interview",
      },
    ],
    orderIndex: 2,
  },
  {
    skillName: "Distributed Cache (Redis)",
    category: "System Design",
    description:
      "Cache aside, write-through, eviction policies, consistent hashing",
    importanceLevel: "High",
    expectedLevel: "Design caching layer for any service",
    resources: [
      { title: "Redis Best Practices", url: "https://redis.io/docs/manual" },
    ],
    orderIndex: 3,
  },
  {
    skillName: "Message Queues (Kafka/SQS)",
    category: "System Design",
    description: "Producer-consumer, at-least-once delivery, partitioning",
    importanceLevel: "High",
    expectedLevel: "Explain when to use queues vs direct calls",
    resources: [
      { title: "Kafka Docs", url: "https://kafka.apache.org/documentation" },
    ],
    orderIndex: 4,
  },
  {
    skillName: "Scalable Feed / Newsfeed",
    category: "System Design",
    description: "Fan-out on write vs read, ranking, pagination",
    importanceLevel: "High",
    expectedLevel: "Handle 100M DAU",
    resources: [
      {
        title: "Instagram Engineering Blog",
        url: "https://instagram-engineering.com",
      },
    ],
    orderIndex: 5,
  },
  {
    skillName: "Search Autocomplete",
    category: "System Design",
    description: "Trie, top-k with frequency, CDN for popularity",
    importanceLevel: "Medium",
    expectedLevel: "Latency under 100ms",
    resources: [
      {
        title: "Bing Spell Check API Design",
        url: "https://docs.microsoft.com/en-us/azure/cognitive-services/bing-spell-check",
      },
    ],
    orderIndex: 6,
  },
  {
    skillName: "Consistent Hashing",
    category: "System Design",
    description: "Virtual nodes, replication factor, hotspot avoidance",
    importanceLevel: "High",
    expectedLevel: "Draw the ring and explain failures",
    resources: [
      {
        title: "Consistent Hashing Paper",
        url: "https://dl.acm.org/doi/10.1145/258533.258660",
      },
    ],
    orderIndex: 7,
  },
  {
    skillName: "Database Sharding & Replication",
    category: "System Design",
    description: "Horizontal sharding, read replicas, eventual consistency",
    importanceLevel: "High",
    expectedLevel: "Choose strategy for given requirements",
    resources: [
      {
        title: "PostgreSQL Replication Docs",
        url: "https://www.postgresql.org/docs/current/high-availability.html",
      },
    ],
    orderIndex: 8,
  },

  // ── Behavioral & Leadership ────────────────────────────────
  {
    skillName: "STAR Method Storytelling",
    category: "Behavioral & Leadership",
    description:
      "Structure: Situation, Task, Action, Result. Quantify outcomes.",
    importanceLevel: "High",
    expectedLevel: "2-3 polished stories per Googleyness principle",
    resources: [
      {
        title: "Googleyness & Leadership Guide",
        url: "https://igotanoffer.com/blogs/tech/google-behavioral-interview",
      },
    ],
    orderIndex: 1,
  },
  {
    skillName: "Conflict Resolution Stories",
    category: "Behavioral & Leadership",
    description: "Disagreeing with manager/peer, data-driven persuasion",
    importanceLevel: "High",
    expectedLevel: "Demonstrate Googleyness",
    resources: [
      {
        title: "Google Careers - How We Hire",
        url: "https://careers.google.com/how-we-hire",
      },
    ],
    orderIndex: 2,
  },
  {
    skillName: "Ambiguity Handling",
    category: "Behavioral & Leadership",
    description: "Defining scope without complete info, iterative delivery",
    importanceLevel: "High",
    expectedLevel: "Show examples of clarifying requirements",
    resources: [
      {
        title: "PM Interview Book",
        url: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818",
      },
    ],
    orderIndex: 3,
  },
  {
    skillName: "Ownership & Impact Stories",
    category: "Behavioral & Leadership",
    description: "Taking initiative beyond your role, driving end-to-end",
    importanceLevel: "High",
    expectedLevel: "Tangible business/user impact",
    resources: [
      {
        title: "Amazon Leadership Principles Applied to Google",
        url: "https://igotanoffer.com",
      },
    ],
    orderIndex: 4,
  },
  {
    skillName: "Cross-functional Collaboration",
    category: "Behavioral & Leadership",
    description: "Working with PM, Design, Data Science, other eng teams",
    importanceLevel: "Medium",
    expectedLevel: "Show influence without authority",
    resources: [],
    orderIndex: 5,
  },

  // ── Languages & Frameworks ─────────────────────────────────
  {
    skillName: "JavaScript / TypeScript Deep Dive",
    category: "Languages & Frameworks",
    description: "Event loop, closures, prototypes, async/await, generics",
    importanceLevel: "High",
    expectedLevel: "Debug complex async bugs",
    resources: [
      {
        title: "You Don't Know JS",
        url: "https://github.com/getify/You-Dont-Know-JS",
      },
    ],
    orderIndex: 1,
  },
  {
    skillName: "React Internals",
    category: "Languages & Frameworks",
    description: "Virtual DOM, reconciliation, hooks lifecycle, performance",
    importanceLevel: "High",
    expectedLevel: "Explain why re-renders happen",
    resources: [{ title: "React Docs", url: "https://react.dev" }],
    orderIndex: 2,
  },
  {
    skillName: "Node.js & Express",
    category: "Languages & Frameworks",
    description: "Event loop, streams, middleware, error handling, clustering",
    importanceLevel: "High",
    expectedLevel: "Build secure REST API from scratch",
    resources: [{ title: "Node.js Docs", url: "https://nodejs.org/en/docs" }],
    orderIndex: 3,
  },
  {
    skillName: "Python for Interviews",
    category: "Languages & Frameworks",
    description:
      "List comprehensions, generators, collections module, decorators",
    importanceLevel: "Medium",
    expectedLevel: "Write idiomatic solutions",
    resources: [
      { title: "Leetcode with Python", url: "https://realpython.com" },
    ],
    orderIndex: 4,
  },
  {
    skillName: "SQL & Query Optimization",
    category: "Languages & Frameworks",
    description: "JOINs, window functions, indexes, EXPLAIN, query planner",
    importanceLevel: "High",
    expectedLevel: "Write complex multi-table queries",
    resources: [
      { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial" },
    ],
    orderIndex: 5,
  },
  {
    skillName: "REST API Design",
    category: "Languages & Frameworks",
    description: "Resource naming, HTTP verbs, status codes, versioning, auth",
    importanceLevel: "High",
    expectedLevel: "Design idiomatic, secure APIs",
    resources: [
      {
        title: "Microsoft REST API Guidelines",
        url: "https://github.com/microsoft/api-guidelines",
      },
    ],
    orderIndex: 6,
  },
  {
    skillName: "Docker & Containerization",
    category: "Languages & Frameworks",
    description: "Dockerfile, multi-stage builds, docker-compose, layers",
    importanceLevel: "Medium",
    expectedLevel: "Containerise a Node/Python app",
    resources: [{ title: "Docker Docs", url: "https://docs.docker.com" }],
    orderIndex: 7,
  },

  // ── Machine Learning & AI ──────────────────────────────────
  {
    skillName: "ML Fundamentals",
    category: "Machine Learning & AI",
    description:
      "Bias-variance tradeoff, overfitting, regularization, cross-validation",
    importanceLevel: "High",
    expectedLevel: "Explain intuitively without equations",
    resources: [
      {
        title: "Google ML Crash Course",
        url: "https://developers.google.com/machine-learning/crash-course",
      },
    ],
    orderIndex: 1,
  },
  {
    skillName: "Deep Learning Basics",
    category: "Machine Learning & AI",
    description:
      "Neural nets, backprop, activation functions, batch norm, dropout",
    importanceLevel: "High",
    expectedLevel: "Explain forward/backward pass",
    resources: [
      { title: "Fast.ai Practical DL", url: "https://course.fast.ai" },
    ],
    orderIndex: 2,
  },
  {
    skillName: "LLMs & Transformers",
    category: "Machine Learning & AI",
    description:
      "Self-attention, BERT/GPT family, fine-tuning, RAG, prompt engineering",
    importanceLevel: "High",
    expectedLevel: "Explain attention mechanism clearly",
    resources: [
      {
        title: "Hugging Face Course",
        url: "https://huggingface.co/learn/nlp-course",
      },
    ],
    orderIndex: 3,
  },
  {
    skillName: "MLOps & Deployment",
    category: "Machine Learning & AI",
    description:
      "Model serving, monitoring, A/B testing, feature stores, retraining pipelines",
    importanceLevel: "Medium",
    expectedLevel: "Describe end-to-end ML lifecycle",
    resources: [
      {
        title: "MLOps Zoomcamp",
        url: "https://github.com/DataTalksClub/mlops-zoomcamp",
      },
    ],
    orderIndex: 4,
  },
  {
    skillName: "Recommendation Systems",
    category: "Machine Learning & AI",
    description:
      "Collaborative filtering, content-based, two-tower models, cold start",
    importanceLevel: "Medium",
    expectedLevel: "Design a recsys at scale",
    resources: [{ title: "RecSys Papers", url: "https://recsys.acm.org" }],
    orderIndex: 5,
  },
  {
    skillName: "ML System Design",
    category: "Machine Learning & AI",
    description:
      "Feature engineering, training pipeline, online vs offline inference",
    importanceLevel: "High",
    expectedLevel: "Design Gmail spam filter / YouTube recs",
    resources: [
      {
        title: "ML System Design Interview",
        url: "https://huyenchip.com/machine-learning-systems-design/toc.html",
      },
    ],
    orderIndex: 6,
  },

  // ── Core CS Fundamentals ───────────────────────────────────
  {
    skillName: "Operating Systems",
    category: "Core CS Fundamentals",
    description:
      "Processes vs threads, scheduling, deadlocks, virtual memory, paging",
    importanceLevel: "High",
    expectedLevel: "Explain mutex vs semaphore",
    resources: [
      { title: "OSTEP Book", url: "https://pages.cs.wisc.edu/~remzi/OSTEP" },
    ],
    orderIndex: 1,
  },
  {
    skillName: "Networking Fundamentals",
    category: "Core CS Fundamentals",
    description: "TCP/IP, HTTP/2, TLS, DNS, CDN, WebSockets, load balancing",
    importanceLevel: "High",
    expectedLevel: "Trace a web request end-to-end",
    resources: [
      { title: "Julia Evans Networking Zines", url: "https://jvns.ca" },
    ],
    orderIndex: 2,
  },
  {
    skillName: "Concurrency & Parallelism",
    category: "Core CS Fundamentals",
    description:
      "Lock-free data structures, race conditions, async patterns, Go routines / JS event loop",
    importanceLevel: "High",
    expectedLevel: "Debug a race condition",
    resources: [
      { title: "Java Concurrency in Practice", url: "https://jcip.net" },
    ],
    orderIndex: 3,
  },
  {
    skillName: "Database Internals",
    category: "Core CS Fundamentals",
    description: "B-trees, LSM trees, WAL, ACID, isolation levels, MVCC",
    importanceLevel: "High",
    expectedLevel: "Explain why indexes speed up queries",
    resources: [
      { title: "Use The Index, Luke", url: "https://use-the-index-luke.com" },
    ],
    orderIndex: 4,
  },
  {
    skillName: "Security Basics",
    category: "Core CS Fundamentals",
    description: "OWASP Top 10, HTTPS/TLS, JWT, OAuth2, CSRF, SQL injection",
    importanceLevel: "Medium",
    expectedLevel: "Identify vulnerabilities in code review",
    resources: [
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten" },
    ],
    orderIndex: 5,
  },
  {
    skillName: "Distributed Systems Concepts",
    category: "Core CS Fundamentals",
    description:
      "CAP theorem, eventual consistency, Paxos/Raft, leader election",
    importanceLevel: "High",
    expectedLevel: "Choose consistency model for given requirements",
    resources: [
      {
        title: "Designing Data-Intensive Applications",
        url: "https://dataintensive.net",
      },
    ],
    orderIndex: 6,
  },
];

module.exports = { seedSkills };
