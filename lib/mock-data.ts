// --- Types ---

export type ResourceType = 'youtube' | 'docs' | 'course' | 'article' | 'github';

export type Task = {
  id: string;
  label: string;
  completed: boolean;
};

export type Item = {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  completed: boolean;
  tasks: Task[];
  pathType?: 'no-code' | 'developer';
};

export type Week = {
  id: string;
  weekNumber: number;
  title: string;
  items: Item[];
};

export type Month = {
  id: string;
  monthNumber: number;
  title: string;
  goal: string;
  milestone: string;
  color: string;
  weeks: Week[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  pathType: 'no-code' | 'developer';
  weeklyHours: number;
  weeklyTarget: number;
  startDate: string;
  streak: number;
  overallProgress: number;
  lastActiveItem: string;
};

export type ProjectStatus = 'planned' | 'in-progress' | 'completed';

export type ProjectPortfolio = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;
  caseStudy?: string;
  completedAt?: string;
};

// --- Constants ---

export const ITEM_TYPES: ResourceType[] = [
  'youtube',
  'docs',
  'course',
  'article',
  'github',
];

// --- Mock User ---

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex',
  email: 'alex@example.com',
  image: undefined,
  pathType: 'developer',
  weeklyHours: 10,
  weeklyTarget: 5,
  startDate: '2026-03-15',
  streak: 12,
  overallProgress: 28,
  lastActiveItem: 'item-2-2-2',
};

// --- Activity Grid (last 28 days, true = active) ---

export const mockActivityGrid = [
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
];

// --- Roadmap (6 Months) ---

export const mockMonths: Month[] = [
  // ─── Month 1 ──────────────────────────────────────────────────────────────
  {
    id: 'month-1',
    monthNumber: 1,
    title: 'Build Your First Workflow in n8n',
    goal: 'Learn n8n, understand APIs & webhooks, and write effective prompts',
    milestone: 'Ship a working n8n workflow that calls an LLM via API',
    color: '#6366f1',
    weeks: [
      {
        id: 'week-1-1',
        weekNumber: 1,
        title: 'n8n Platform Fundamentals',
        items: [
          {
            id: 'item-1-1-1',
            title: 'n8n Official Documentation',
            type: 'docs',
            url: 'https://docs.n8n.io',
            completed: false,
            tasks: [
              { id: 'task-1-1-1-1', label: 'Read the Getting Started guide', completed: false },
              { id: 'task-1-1-1-2', label: 'Explore the node library overview', completed: false },
              { id: 'task-1-1-1-3', label: 'Bookmark key reference pages', completed: false },
            ],
          },
          {
            id: 'item-1-1-2',
            title: 'n8n Beginner Course',
            type: 'course',
            url: 'https://docs.n8n.io/courses/',
            completed: false,
            tasks: [
              { id: 'task-1-1-2-1', label: 'Complete Level 1 course modules', completed: false },
              { id: 'task-1-1-2-2', label: 'Build the course project workflow', completed: false },
              { id: 'task-1-1-2-3', label: 'Pass the end-of-course quiz', completed: false },
            ],
          },
          {
            id: 'item-1-1-3',
            title: 'Productive Dude: n8n Tutorials',
            type: 'youtube',
            url: 'https://www.youtube.com/@productivedude',
            completed: false,
            tasks: [
              { id: 'task-1-1-3-1', label: 'Watch the n8n crash course video', completed: false },
              { id: 'task-1-1-3-2', label: 'Recreate one workflow from the video', completed: false },
            ],
          },
          {
            id: 'item-1-1-4',
            title: 'Nick Saraev: n8n Deep Dives',
            type: 'youtube',
            url: 'https://www.youtube.com/@nicksaraev',
            completed: false,
            tasks: [
              { id: 'task-1-1-4-1', label: 'Watch 2 n8n workflow breakdown videos', completed: false },
              { id: 'task-1-1-4-2', label: 'Note which nodes are used most', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-1-2',
        weekNumber: 2,
        title: 'APIs, Webhooks & JSON',
        items: [
          {
            id: 'item-1-2-1',
            title: 'What Are Webhooks?: Zapier Blog',
            type: 'article',
            url: 'https://zapier.com/blog/what-are-webhooks/',
            completed: false,
            tasks: [
              { id: 'task-1-2-1-1', label: 'Read the full article', completed: false },
              { id: 'task-1-2-1-2', label: 'Summarise webhook vs polling in your own words', completed: false },
            ],
          },
          {
            id: 'item-1-2-2',
            title: 'HTTP Overview: MDN Web Docs',
            type: 'docs',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
            completed: false,
            tasks: [
              { id: 'task-1-2-2-1', label: 'Read HTTP methods and status codes sections', completed: false },
              { id: 'task-1-2-2-2', label: 'Understand request / response cycle', completed: false },
            ],
          },
          {
            id: 'item-1-2-3',
            title: 'Postman Learning Center',
            type: 'course',
            url: 'https://learning.postman.com',
            completed: false,
            tasks: [
              { id: 'task-1-2-3-1', label: 'Complete Postman Fundamentals collection', completed: false },
              { id: 'task-1-2-3-2', label: 'Make a GET and POST request to a public API', completed: false },
              { id: 'task-1-2-3-3', label: 'Inspect response headers and body', completed: false },
            ],
          },
          {
            id: 'item-1-2-4',
            title: 'RESTful API Design Guide',
            type: 'article',
            url: 'https://restfulapi.net',
            completed: false,
            tasks: [
              { id: 'task-1-2-4-1', label: 'Read the REST constraints overview', completed: false },
              { id: 'task-1-2-4-2', label: 'Learn about resource naming conventions', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-1-3',
        weekNumber: 3,
        title: 'Prompt Engineering Basics',
        items: [
          {
            id: 'item-1-3-1',
            title: 'Anthropic Prompt Engineering Interactive Tutorial',
            type: 'github',
            url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial',
            completed: false,
            tasks: [
              { id: 'task-1-3-1-1', label: 'Clone or open the tutorial notebook', completed: false },
              { id: 'task-1-3-1-2', label: 'Complete all interactive exercises', completed: false },
              { id: 'task-1-3-1-3', label: 'Save your best prompt templates', completed: false },
            ],
          },
          {
            id: 'item-1-3-2',
            title: 'OpenAI Prompt Engineering Guide',
            type: 'docs',
            url: 'https://platform.openai.com/docs/guides/prompt-engineering',
            completed: false,
            tasks: [
              { id: 'task-1-3-2-1', label: 'Read all six strategies', completed: false },
              { id: 'task-1-3-2-2', label: 'Try each tactic in the Playground', completed: false },
            ],
          },
          {
            id: 'item-1-3-3',
            title: 'Learn Prompting: Open Source Guide',
            type: 'course',
            url: 'https://learnprompting.org',
            completed: false,
            tasks: [
              { id: 'task-1-3-3-1', label: 'Complete the Basics chapter', completed: false },
              { id: 'task-1-3-3-2', label: 'Complete the Intermediate chapter', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-1-4',
        weekNumber: 4,
        title: 'LLM Awareness & How Models Work',
        items: [
          {
            id: 'item-1-4-1',
            title: 'Andrej Karpathy: Intro to Large Language Models',
            type: 'youtube',
            url: 'https://www.youtube.com/@AndrejKarpathy',
            completed: false,
            tasks: [
              { id: 'task-1-4-1-1', label: 'Watch the "Intro to LLMs" talk (1 hr)', completed: false },
              { id: 'task-1-4-1-2', label: 'Note key concepts: tokens, context window, temperature', completed: false },
            ],
          },
          {
            id: 'item-1-4-2',
            title: 'Simon Willison\'s Weblog: LLM Explainers',
            type: 'article',
            url: 'https://simonwillison.net',
            completed: false,
            tasks: [
              { id: 'task-1-4-2-1', label: 'Read 3 recent posts tagged "llms"', completed: false },
              { id: 'task-1-4-2-2', label: 'Bookmark one post to share with a peer', completed: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── Month 2 ──────────────────────────────────────────────────────────────
  {
    id: 'month-2',
    monthNumber: 2,
    title: 'Embed AI Into Your Workflows',
    goal: 'Connect LLMs to real triggers and outputs using n8n AI nodes',
    milestone: 'Build a Trigger → AI → Action workflow that runs on a schedule',
    color: '#8b5cf6',
    weeks: [
      {
        id: 'week-2-1',
        weekNumber: 1,
        title: 'n8n AI Nodes & LangChain',
        items: [
          {
            id: 'item-2-1-1',
            title: 'n8n Advanced AI Documentation',
            type: 'docs',
            url: 'https://docs.n8n.io/advanced-ai/',
            completed: false,
            tasks: [
              { id: 'task-2-1-1-1', label: 'Read the AI nodes overview', completed: false },
              { id: 'task-2-1-1-2', label: 'Connect OpenAI node to a workflow', completed: false },
              { id: 'task-2-1-1-3', label: 'Experiment with the Chat Memory node', completed: false },
            ],
          },
          {
            id: 'item-2-1-2',
            title: 'n8n AI Workflow Templates',
            type: 'docs',
            url: 'https://n8n.io/workflows/?categories=AI',
            completed: false,
            tasks: [
              { id: 'task-2-1-2-1', label: 'Browse the AI workflow template gallery', completed: false },
              { id: 'task-2-1-2-2', label: 'Import and run 2 templates in your instance', completed: false },
              { id: 'task-2-1-2-3', label: 'Modify one template to fit a personal use case', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-2-2',
        weekNumber: 2,
        title: 'Trigger → AI → Action Pattern',
        items: [
          {
            id: 'item-2-2-1',
            title: 'Building Effective Agents: Anthropic Research',
            type: 'article',
            url: 'https://anthropic.com/research/building-effective-agents',
            completed: false,
            tasks: [
              { id: 'task-2-2-1-1', label: 'Read the full research post', completed: false },
              { id: 'task-2-2-1-2', label: 'List the five agent design patterns', completed: false },
              { id: 'task-2-2-1-3', label: 'Map one pattern to an n8n workflow design', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-2-3',
        weekNumber: 3,
        title: 'Error Handling & Fallbacks',
        items: [
          {
            id: 'item-2-3-1',
            title: 'n8n Error Handling Documentation',
            type: 'docs',
            url: 'https://docs.n8n.io/flow-logic/error-handling/',
            completed: false,
            tasks: [
              { id: 'task-2-3-1-1', label: 'Read error workflow and retry logic docs', completed: false },
              { id: 'task-2-3-1-2', label: 'Add an error handler to an existing workflow', completed: false },
              { id: 'task-2-3-1-3', label: 'Set up an error notification via email or Slack', completed: false },
            ],
          },
          {
            id: 'item-2-3-2',
            title: 'Nate Herk: n8n Error Handling Tutorials',
            type: 'youtube',
            url: 'https://www.youtube.com/@NateHerk',
            completed: false,
            tasks: [
              { id: 'task-2-3-2-1', label: 'Watch the error handling workflow video', completed: false },
              { id: 'task-2-3-2-2', label: 'Implement the fallback pattern shown', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-2-4',
        weekNumber: 4,
        title: 'Token Cost Awareness',
        items: [
          {
            id: 'item-2-4-1',
            title: 'OpenAI API Pricing',
            type: 'docs',
            url: 'https://openai.com/api/pricing',
            completed: false,
            tasks: [
              { id: 'task-2-4-1-1', label: 'Read current model pricing tiers', completed: false },
              { id: 'task-2-4-1-2', label: 'Estimate cost for 1,000 daily workflow runs', completed: false },
            ],
          },
          {
            id: 'item-2-4-2',
            title: 'Anthropic Model Pricing',
            type: 'docs',
            url: 'https://anthropic.com/pricing',
            completed: false,
            tasks: [
              { id: 'task-2-4-2-1', label: 'Compare Claude model tiers by cost and context', completed: false },
              { id: 'task-2-4-2-2', label: 'Choose the right model for your use case', completed: false },
            ],
          },
          {
            id: 'item-2-4-3',
            title: 'OpenAI Tokenizer Tool',
            type: 'docs',
            url: 'https://platform.openai.com/tokenizer',
            completed: false,
            tasks: [
              { id: 'task-2-4-3-1', label: 'Paste a sample prompt and count tokens', completed: false },
              { id: 'task-2-4-3-2', label: 'Reduce a prompt by 30% without losing meaning', completed: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── Month 3 ──────────────────────────────────────────────────────────────
  {
    id: 'month-3',
    monthNumber: 3,
    title: 'Build Repeatable Service Workflows',
    goal: 'Build 6 real-world service automations clients actually pay for',
    milestone: 'Have at least 3 packaged workflow templates ready to sell',
    color: '#a855f7',
    weeks: [
      {
        id: 'week-3-1',
        weekNumber: 1,
        title: 'Lead Generation Automation',
        items: [
          {
            id: 'item-3-1-1',
            title: 'Apify: Web Scraping & Data Extraction',
            type: 'docs',
            url: 'https://apify.com',
            completed: false,
            tasks: [
              { id: 'task-3-1-1-1', label: 'Read Apify platform overview', completed: false },
              { id: 'task-3-1-1-2', label: 'Run a pre-built actor to scrape LinkedIn profiles', completed: false },
            ],
          },
          {
            id: 'item-3-1-2',
            title: 'Clay: Data Enrichment Platform',
            type: 'docs',
            url: 'https://clay.com',
            completed: false,
            tasks: [
              { id: 'task-3-1-2-1', label: 'Set up a free Clay account', completed: false },
              { id: 'task-3-1-2-2', label: 'Build a lead enrichment table with 50 rows', completed: false },
            ],
          },
          {
            id: 'item-3-1-3',
            title: 'Apollo.io API Documentation',
            type: 'docs',
            url: 'https://docs.apollo.io',
            completed: false,
            tasks: [
              { id: 'task-3-1-3-1', label: 'Read People Search API reference', completed: false },
              { id: 'task-3-1-3-2', label: 'Pull 100 contacts matching an ICP in n8n', completed: false },
            ],
          },
          {
            id: 'item-3-1-4',
            title: 'Hunter.io: Email Finder',
            type: 'docs',
            url: 'https://hunter.io',
            completed: false,
            tasks: [
              { id: 'task-3-1-4-1', label: 'Try Domain Search for 10 target companies', completed: false },
              { id: 'task-3-1-4-2', label: 'Connect Hunter API to n8n lead pipeline', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-3-2',
        weekNumber: 2,
        title: 'Cold Outreach & CRM Automation',
        items: [
          {
            id: 'item-3-2-1',
            title: 'Instantly.ai: Cold Email Platform',
            type: 'docs',
            url: 'https://instantly.ai',
            completed: false,
            tasks: [
              { id: 'task-3-2-1-1', label: 'Set up a sending domain with warm-up', completed: false },
              { id: 'task-3-2-1-2', label: 'Build a 3-step sequence with AI personalisation', completed: false },
            ],
          },
          {
            id: 'item-3-2-2',
            title: 'Smartlead.ai: Outreach Automation',
            type: 'docs',
            url: 'https://smartlead.ai',
            completed: false,
            tasks: [
              { id: 'task-3-2-2-1', label: 'Explore multi-channel campaign builder', completed: false },
              { id: 'task-3-2-2-2', label: 'Compare Smartlead vs Instantly features', completed: false },
            ],
          },
          {
            id: 'item-3-2-3',
            title: 'HubSpot CRM API Documentation',
            type: 'docs',
            url: 'https://developers.hubspot.com',
            completed: false,
            tasks: [
              { id: 'task-3-2-3-1', label: 'Authenticate and create a contact via API', completed: false },
              { id: 'task-3-2-3-2', label: 'Build n8n → HubSpot contact sync workflow', completed: false },
            ],
          },
          {
            id: 'item-3-2-4',
            title: 'Pipedrive API Documentation',
            type: 'docs',
            url: 'https://developers.pipedrive.com',
            completed: false,
            tasks: [
              { id: 'task-3-2-4-1', label: 'Read Deals and Persons API reference', completed: false },
              { id: 'task-3-2-4-2', label: 'Auto-create a deal when a lead replies', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-3-3',
        weekNumber: 3,
        title: 'Content Pipelines & Meeting Automation',
        items: [
          {
            id: 'item-3-3-1',
            title: 'Blotato: AI Social Media Automation',
            type: 'docs',
            url: 'https://blotato.com',
            completed: false,
            tasks: [
              { id: 'task-3-3-1-1', label: 'Connect a content source and run a post pipeline', completed: false },
              { id: 'task-3-3-1-2', label: 'Schedule 7 days of posts from one article', completed: false },
            ],
          },
          {
            id: 'item-3-3-2',
            title: 'Notion API Documentation',
            type: 'docs',
            url: 'https://developers.notion.com',
            completed: false,
            tasks: [
              { id: 'task-3-3-2-1', label: 'Create a database page via API in n8n', completed: false },
              { id: 'task-3-3-2-2', label: 'Push AI-generated content drafts to Notion', completed: false },
            ],
          },
          {
            id: 'item-3-3-3',
            title: 'Fireflies.ai: Meeting Transcription API',
            type: 'docs',
            url: 'https://docs.fireflies.ai',
            completed: false,
            tasks: [
              { id: 'task-3-3-3-1', label: 'Connect Fireflies webhook to n8n', completed: false },
              { id: 'task-3-3-3-2', label: 'Extract action items from transcript with AI', completed: false },
            ],
          },
          {
            id: 'item-3-3-4',
            title: 'OpenAI Whisper: Open Source Transcription',
            type: 'github',
            url: 'https://github.com/openai/whisper',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-3-3-4-1', label: 'Run Whisper locally on a sample audio file', completed: false },
              { id: 'task-3-3-4-2', label: 'Integrate transcription output into an n8n workflow', completed: false },
            ],
          },
          {
            id: 'item-3-3-5',
            title: 'n8n OpenAI Node: Whisper API Transcription',
            type: 'docs',
            url: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/',
            completed: false,
            pathType: 'no-code',
            tasks: [
              { id: 'task-3-3-5-1', label: 'Add an OpenAI node and transcribe a sample meeting recording', completed: false },
              { id: 'task-3-3-5-2', label: 'Configure language and temperature parameters for cleaner output', completed: false },
              { id: 'task-3-3-5-3', label: 'Chain transcription to a GPT summarisation node and save to Notion', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-3-4',
        weekNumber: 4,
        title: 'Internal Knowledge Bots (RAG)',
        items: [
          {
            id: 'item-3-4-1',
            title: 'Supabase Vector Store',
            type: 'docs',
            url: 'https://supabase.com/docs/guides/ai/vector-columns',
            completed: false,
            tasks: [
              { id: 'task-3-4-1-1', label: 'Create a vector-enabled table in Supabase', completed: false },
              { id: 'task-3-4-1-2', label: 'Store and query embeddings from an n8n workflow', completed: false },
            ],
          },
          {
            id: 'item-3-4-2',
            title: 'LlamaIndex: RAG Framework Docs',
            type: 'docs',
            url: 'https://docs.llamaindex.ai',
            completed: false,
            tasks: [
              { id: 'task-3-4-2-1', label: 'Read the RAG fundamentals guide', completed: false },
              { id: 'task-3-4-2-2', label: 'Understand chunking and retrieval strategies', completed: false },
            ],
          },
          {
            id: 'item-3-4-3',
            title: 'n8n RAG & AI Agent Templates',
            type: 'docs',
            url: 'https://n8n.io/workflows/?categories=AI',
            completed: false,
            tasks: [
              { id: 'task-3-4-3-1', label: 'Import an n8n RAG template', completed: false },
              { id: 'task-3-4-3-2', label: 'Feed it your own documents and test queries', completed: false },
              { id: 'task-3-4-3-3', label: 'Deploy as a Slack or Telegram bot', completed: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── Month 4 ──────────────────────────────────────────────────────────────
  {
    id: 'month-4',
    monthNumber: 4,
    title: 'Add AI Agents to Your Toolbox',
    goal: 'Understand agentic patterns and build reliable AI agents in n8n',
    milestone: 'Ship a working AI agent with at least one tool and human-in-the-loop review',
    color: '#c084fc',
    weeks: [
      {
        id: 'week-4-1',
        weekNumber: 1,
        title: 'What Agents Actually Are',
        items: [
          {
            id: 'item-4-1-1',
            title: 'Building Effective Agents: Anthropic Research',
            type: 'article',
            url: 'https://anthropic.com/research/building-effective-agents',
            completed: false,
            tasks: [
              { id: 'task-4-1-1-1', label: 'Re-read with focus on tool use and orchestration', completed: false },
              { id: 'task-4-1-1-2', label: 'Draw the agent loop: perceive → plan → act → observe', completed: false },
            ],
          },
          {
            id: 'item-4-1-2',
            title: 'OpenAI: A Practical Guide to Building Agents (PDF)',
            type: 'docs',
            url: 'https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf',
            completed: false,
            tasks: [
              { id: 'task-4-1-2-1', label: 'Read the full guide (45 min)', completed: false },
              { id: 'task-4-1-2-2', label: 'List 3 agent failure modes and their mitigations', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-4-2',
        weekNumber: 2,
        title: 'Build Your First Agent in n8n',
        items: [
          {
            id: 'item-4-2-1',
            title: 'n8n Agent Node Documentation',
            type: 'docs',
            url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/',
            completed: false,
            tasks: [
              { id: 'task-4-2-1-1', label: 'Read the Agent node reference', completed: false },
              { id: 'task-4-2-1-2', label: 'Add a Calculator tool and test the agent', completed: false },
              { id: 'task-4-2-1-3', label: 'Connect to an external API as a custom tool', completed: false },
            ],
          },
          {
            id: 'item-4-2-2',
            title: 'Slack Block Kit Builder',
            type: 'docs',
            url: 'https://api.slack.com/block-kit',
            completed: false,
            tasks: [
              { id: 'task-4-2-2-1', label: 'Design an approval message with buttons', completed: false },
              { id: 'task-4-2-2-2', label: 'Send agent output to Slack for review', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-4-3',
        weekNumber: 3,
        title: 'Advanced Agent Patterns',
        items: [
          {
            id: 'item-4-3-1',
            title: 'LangChain Academy',
            type: 'course',
            url: 'https://academy.langchain.com',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-4-3-1-1', label: 'Complete Introduction to LangGraph module', completed: false },
              { id: 'task-4-3-1-2', label: 'Build a simple ReAct agent', completed: false },
            ],
          },
          {
            id: 'item-4-3-2',
            title: 'CrewAI Documentation',
            type: 'docs',
            url: 'https://docs.crewai.com',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-4-3-2-1', label: 'Read Agents, Tasks, and Crews overview', completed: false },
              { id: 'task-4-3-2-2', label: 'Run the quickstart multi-agent crew', completed: false },
            ],
          },
          {
            id: 'item-4-3-3',
            title: 'Microsoft AutoGen Documentation',
            type: 'docs',
            url: 'https://microsoft.github.io/autogen/',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-4-3-3-1', label: 'Read the AutoGen overview and architecture', completed: false },
              { id: 'task-4-3-3-2', label: 'Run the two-agent conversation quickstart', completed: false },
            ],
          },
          {
            id: 'item-4-3-4',
            title: 'n8n Advanced Agent Types & Tool-Calling Patterns',
            type: 'docs',
            url: 'https://docs.n8n.io/advanced-ai/examples/introduction/',
            completed: false,
            pathType: 'no-code',
            tasks: [
              { id: 'task-4-3-4-1', label: 'Build a ReAct Agent with 3 connected tools in n8n', completed: false },
              { id: 'task-4-3-4-2', label: 'Set up an HTTP Request Tool to fetch live data from an API', completed: false },
              { id: 'task-4-3-4-3', label: 'Use $fromAI() to let the agent decide parameters at runtime', completed: false },
            ],
          },
          {
            id: 'item-4-3-5',
            title: 'n8n Multi-Agent Systems with Sub-Workflow Chaining',
            type: 'docs',
            url: 'https://docs.n8n.io/advanced-ai/examples/understand-tools/',
            completed: false,
            pathType: 'no-code',
            tasks: [
              { id: 'task-4-3-5-1', label: 'Create a Research Agent and a Writer Agent as separate sub-workflows', completed: false },
              { id: 'task-4-3-5-2', label: 'Build an Orchestrator Agent that chains them via Call n8n Workflow Tool', completed: false },
              { id: 'task-4-3-5-3', label: 'Add a Human-in-the-Loop approval step between agent handoffs', completed: false },
            ],
          },
          {
            id: 'item-4-3-6',
            title: 'Flowise: Visual Multi-Agent Builder',
            type: 'docs',
            url: 'https://docs.flowiseai.com/',
            completed: false,
            pathType: 'no-code',
            tasks: [
              { id: 'task-4-3-6-1', label: 'Install Flowise and build a basic Chatflow with an LLM chain', completed: false },
              { id: 'task-4-3-6-2', label: 'Recreate the 2-agent pipeline using Agentflow V2', completed: false },
              { id: 'task-4-3-6-3', label: 'Compare Flowise vs n8n agent capabilities and note trade-offs', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-4-4',
        weekNumber: 4,
        title: 'Human-in-the-Loop & Reliability',
        items: [
          {
            id: 'item-4-4-1',
            title: 'n8n Wait Node & Approval Patterns',
            type: 'docs',
            url: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/',
            completed: false,
            tasks: [
              { id: 'task-4-4-1-1', label: 'Build a workflow that pauses for human approval', completed: false },
              { id: 'task-4-4-1-2', label: 'Send approval link via email and handle both responses', completed: false },
              { id: 'task-4-4-1-3', label: 'Add a timeout fallback after 24 hours', completed: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── Month 5 ──────────────────────────────────────────────────────────────
  {
    id: 'month-5',
    monthNumber: 5,
    title: 'Make Automations Production-Ready',
    goal: 'Deploy, monitor, secure, and document automations for real clients',
    milestone: 'Hand off a fully documented workflow to a mock client',
    color: '#d946ef',
    weeks: [
      {
        id: 'week-5-1',
        weekNumber: 1,
        title: 'Deployment with Railway or Render',
        items: [
          {
            id: 'item-5-1-1',
            title: 'Railway: App Deployment Platform',
            type: 'docs',
            url: 'https://railway.app',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-5-1-1-1', label: 'Read the Railway getting started guide', completed: false },
              { id: 'task-5-1-1-2', label: 'Deploy a self-hosted n8n instance on Railway', completed: false },
              { id: 'task-5-1-1-3', label: 'Configure environment variables and persistent volume', completed: false },
            ],
          },
          {
            id: 'item-5-1-2',
            title: 'Render: Cloud Hosting Platform',
            type: 'docs',
            url: 'https://render.com',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-5-1-2-1', label: 'Compare Render vs Railway pricing and limits', completed: false },
              { id: 'task-5-1-2-2', label: 'Deploy a simple webhook receiver service', completed: false },
            ],
          },
          {
            id: 'item-5-1-3',
            title: 'n8n Cloud: Managed Hosting',
            type: 'docs',
            url: 'https://n8n.io/cloud',
            completed: false,
            tasks: [
              { id: 'task-5-1-3-1', label: 'Compare n8n Cloud tiers vs self-hosted cost', completed: false },
              { id: 'task-5-1-3-2', label: 'Decide on hosting strategy for client work', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-5-2',
        weekNumber: 2,
        title: 'Logging & Monitoring',
        items: [
          {
            id: 'item-5-2-1',
            title: 'n8n Executions Log Documentation',
            type: 'docs',
            url: 'https://docs.n8n.io/workflows/executions/',
            completed: false,
            tasks: [
              { id: 'task-5-2-1-1', label: 'Review execution history for a live workflow', completed: false },
              { id: 'task-5-2-1-2', label: 'Set up execution data pruning policy', completed: false },
            ],
          },
          {
            id: 'item-5-2-2',
            title: 'Better Stack: Log Management & Uptime',
            type: 'docs',
            url: 'https://betterstack.com',
            completed: false,
            tasks: [
              { id: 'task-5-2-2-1', label: 'Connect n8n logs to Better Stack', completed: false },
              { id: 'task-5-2-2-2', label: 'Set up an uptime monitor for your n8n instance', completed: false },
              { id: 'task-5-2-2-3', label: 'Configure an alert for failed executions', completed: false },
            ],
          },
          {
            id: 'item-5-2-3',
            title: 'Langfuse: LLM Observability',
            type: 'docs',
            url: 'https://langfuse.com',
            completed: false,
            tasks: [
              { id: 'task-5-2-3-1', label: 'Integrate Langfuse tracing into an AI workflow', completed: false },
              { id: 'task-5-2-3-2', label: 'Track token usage and latency per run', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-5-3',
        weekNumber: 3,
        title: 'Prompt Versioning & Security',
        items: [
          {
            id: 'item-5-3-1',
            title: 'OWASP LLM Top 10: Security Risks',
            type: 'docs',
            url: 'https://genai.owasp.org/llm-top-10/',
            completed: false,
            tasks: [
              { id: 'task-5-3-1-1', label: 'Read all 10 LLM security risk categories', completed: false },
              { id: 'task-5-3-1-2', label: 'Audit one of your workflows against the top 3 risks', completed: false },
            ],
          },
          {
            id: 'item-5-3-2',
            title: 'n8n Credentials & Secrets Management',
            type: 'docs',
            url: 'https://docs.n8n.io/credentials/',
            completed: false,
            tasks: [
              { id: 'task-5-3-2-1', label: 'Migrate all hardcoded keys to n8n credentials store', completed: false },
              { id: 'task-5-3-2-2', label: 'Set up credential sharing permissions for team use', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-5-4',
        weekNumber: 4,
        title: 'Documentation & Client Handoff',
        items: [
          {
            id: 'item-5-4-1',
            title: 'Loom: Async Video Documentation',
            type: 'docs',
            url: 'https://loom.com',
            completed: false,
            tasks: [
              { id: 'task-5-4-1-1', label: 'Record a Loom walkthrough of a complete workflow', completed: false },
              { id: 'task-5-4-1-2', label: 'Add chapters and annotations to the video', completed: false },
            ],
          },
          {
            id: 'item-5-4-2',
            title: 'n8n Sticky Notes: In-Workflow Docs',
            type: 'docs',
            url: 'https://docs.n8n.io/workflows/sticky-notes/',
            completed: false,
            tasks: [
              { id: 'task-5-4-2-1', label: 'Add sticky notes explaining every major section', completed: false },
              { id: 'task-5-4-2-2', label: 'Document required credentials and trigger conditions', completed: false },
            ],
          },
          {
            id: 'item-5-4-3',
            title: 'Notion: Client Handoff Template',
            type: 'docs',
            url: 'https://notion.so/templates',
            completed: false,
            tasks: [
              { id: 'task-5-4-3-1', label: 'Find or create a SOP template for workflow delivery', completed: false },
              { id: 'task-5-4-3-2', label: 'Fill out the handoff doc for one completed workflow', completed: false },
              { id: 'task-5-4-3-3', label: 'Share with a peer for feedback', completed: false },
            ],
          },
        ],
      },
    ],
  },

  // ─── Month 6 ──────────────────────────────────────────────────────────────
  {
    id: 'month-6',
    monthNumber: 6,
    title: 'Pick Your Direction & Scale',
    goal: 'Choose a revenue path and take your first real steps toward paid work',
    milestone: 'Land first client, internal project, or published workflow product',
    color: '#ec4899',
    weeks: [
      {
        id: 'week-6-1',
        weekNumber: 1,
        title: 'Freelance Path: Platforms & Positioning',
        items: [
          {
            id: 'item-6-1-1',
            title: 'Upwork: Freelance Marketplace',
            type: 'article',
            url: 'https://upwork.com',
            completed: false,
            tasks: [
              { id: 'task-6-1-1-1', label: 'Create or optimise your Upwork profile', completed: false },
              { id: 'task-6-1-1-2', label: 'Write a niche-specific profile headline', completed: false },
              { id: 'task-6-1-1-3', label: 'Submit 3 proposals to AI automation jobs', completed: false },
            ],
          },
          {
            id: 'item-6-1-2',
            title: 'Fiverr: Gig-Based Freelancing',
            type: 'article',
            url: 'https://fiverr.com',
            completed: false,
            tasks: [
              { id: 'task-6-1-2-1', label: 'Create a gig for one specific automation service', completed: false },
              { id: 'task-6-1-2-2', label: 'Write gig description with clear deliverables', completed: false },
            ],
          },
          {
            id: 'item-6-1-3',
            title: 'Contra: Freelance Without Fees',
            type: 'article',
            url: 'https://contra.com',
            completed: false,
            tasks: [
              { id: 'task-6-1-3-1', label: 'Set up a Contra profile', completed: false },
              { id: 'task-6-1-3-2', label: 'Publish your portfolio projects', completed: false },
            ],
          },
          {
            id: 'item-6-1-4',
            title: 'n8n Creators Program',
            type: 'docs',
            url: 'https://n8n.io/creators/',
            completed: false,
            tasks: [
              { id: 'task-6-1-4-1', label: 'Read the Creators Program requirements', completed: false },
              { id: 'task-6-1-4-2', label: 'Publish one workflow template to n8n.io', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-6-2',
        weekNumber: 2,
        title: 'Client Acquisition & Cold Outreach',
        items: [
          {
            id: 'item-6-2-1',
            title: 'Lemlist Developer API Docs',
            type: 'docs',
            url: 'https://developer.lemlist.com',
            completed: false,
            tasks: [
              { id: 'task-6-2-1-1', label: 'Set up a Lemlist campaign for agency outreach', completed: false },
              { id: 'task-6-2-1-2', label: 'Personalise first-line with Apollo data via n8n', completed: false },
            ],
          },
          {
            id: 'item-6-2-2',
            title: 'Attio CRM API Documentation',
            type: 'docs',
            url: 'https://developers.attio.com',
            completed: false,
            tasks: [
              { id: 'task-6-2-2-1', label: 'Set up Attio for tracking outreach pipeline', completed: false },
              { id: 'task-6-2-2-2', label: 'Auto-log email replies into Attio via n8n', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-6-3',
        weekNumber: 3,
        title: 'In-House Builder Track',
        items: [
          {
            id: 'item-6-3-1',
            title: 'Retool: Internal Tools Builder',
            type: 'docs',
            url: 'https://retool.com',
            completed: false,
            tasks: [
              { id: 'task-6-3-1-1', label: 'Read Retool getting started guide', completed: false },
              { id: 'task-6-3-1-2', label: 'Build a simple internal dashboard connected to an API', completed: false },
            ],
          },
          {
            id: 'item-6-3-2',
            title: 'Streamlit: Python Data App Builder',
            type: 'docs',
            url: 'https://streamlit.io',
            completed: false,
            pathType: 'developer',
            tasks: [
              { id: 'task-6-3-2-1', label: 'Build a Streamlit app to visualise workflow output data', completed: false },
              { id: 'task-6-3-2-2', label: 'Deploy to Streamlit Community Cloud', completed: false },
            ],
          },
          {
            id: 'item-6-3-4',
            title: 'Softr: No-Code Client Portal Builder',
            type: 'docs',
            url: 'https://docs.softr.io',
            completed: false,
            pathType: 'no-code',
            tasks: [
              { id: 'task-6-3-4-1', label: 'Set up a client portal connected to an Airtable base', completed: false },
              { id: 'task-6-3-4-2', label: 'Configure user authentication and group-based permissions', completed: false },
              { id: 'task-6-3-4-3', label: 'Publish the portal and connect it to an n8n or Make workflow', completed: false },
            ],
          },
          {
            id: 'item-6-3-3',
            title: 'Budibase: Open Source Low-Code Platform',
            type: 'docs',
            url: 'https://budibase.com',
            completed: false,
            tasks: [
              { id: 'task-6-3-3-1', label: 'Set up Budibase self-hosted instance', completed: false },
              { id: 'task-6-3-3-2', label: 'Create an internal form that triggers an n8n workflow', completed: false },
            ],
          },
        ],
      },
      {
        id: 'week-6-4',
        weekNumber: 4,
        title: 'AI Automation Agency Track',
        items: [
          {
            id: 'item-6-4-1',
            title: 'The E-Myth Revisited: Michael Gerber',
            type: 'article',
            url: 'https://www.amazon.com/E-Myth-Revisited-Small-Businesses-About/dp/0887307280',
            completed: false,
            tasks: [
              { id: 'task-6-4-1-1', label: 'Read Part 1: The E-Myth and Its Consequences', completed: false },
              { id: 'task-6-4-1-2', label: 'Write down which "hat" you are wearing in your business', completed: false },
            ],
          },
          {
            id: 'item-6-4-2',
            title: 'Built to Sell: John Warrillow',
            type: 'article',
            url: 'https://www.amazon.com/Built-Sell-Creating-Business-Without/dp/1591845823',
            completed: false,
            tasks: [
              { id: 'task-6-4-2-1', label: 'Read chapters on productising a service', completed: false },
              { id: 'task-6-4-2-2', label: 'Define your one repeatable automation offer', completed: false },
            ],
          },
          {
            id: 'item-6-4-3',
            title: 'OnlineJobs.ph: Hiring Virtual Assistants',
            type: 'article',
            url: 'https://onlinejobs.ph',
            completed: false,
            tasks: [
              { id: 'task-6-4-3-1', label: 'Post a job listing for a junior automation VA', completed: false },
              { id: 'task-6-4-3-2', label: 'Write an SOP they could follow without your help', completed: false },
            ],
          },
        ],
      },
    ],
  },
];

// --- Mock Projects ---

export const mockProjects: ProjectPortfolio[] = [
  {
    id: 'proj-1',
    title: 'Email Auto-Responder',
    description: 'AI-powered email triage and response system using Gmail API + Claude. Classifies intent, drafts replies, and routes to the right team.',
    status: 'completed',
    githubUrl: 'https://github.com/example/email-responder',
    demoUrl: 'https://demo.example.com/email-responder',
    loomUrl: 'https://loom.com/share/example1',
    caseStudy: 'Reduced response time by 70% for a 3-person support team.',
    completedAt: '2026-04-01',
  },
  {
    id: 'proj-2',
    title: 'Lead Enrichment Pipeline',
    description: 'Multi-step Make scenario that pulls new CRM leads, enriches them via Clearbit + LinkedIn, and pushes a scored summary to Notion.',
    status: 'completed',
    githubUrl: 'https://github.com/example/lead-pipeline',
    completedAt: '2026-04-10',
  },
  {
    id: 'proj-3',
    title: 'Social Media Scheduler',
    description: 'Zapier + OpenAI workflow that repurposes long-form content into platform-specific posts and schedules them across Twitter, LinkedIn, and Instagram.',
    status: 'in-progress',
    githubUrl: 'https://github.com/example/social-scheduler',
  },
  {
    id: 'proj-4',
    title: 'API Integration Hub',
    description: 'Centralized webhook router built on n8n. Receives events from Stripe, GitHub, and Intercom and fans out to the correct downstream services.',
    status: 'in-progress',
    githubUrl: 'https://github.com/example/api-hub',
    demoUrl: 'https://demo.example.com/api-hub',
  },
  {
    id: 'proj-5',
    title: 'Onboarding Automation',
    description: 'End-to-end client onboarding flow: contract signed → Notion workspace created → welcome email sent → Slack channel provisioned. Zero manual steps.',
    status: 'planned',
  },
  {
    id: 'proj-6',
    title: 'AI Content Moderator',
    description: 'Serverless function that screens user-submitted content with a Claude classifier before it hits the database. Flags, quarantines, or auto-approves.',
    status: 'planned',
    githubUrl: 'https://github.com/example/content-mod',
  },
  {
    id: 'proj-7',
    title: 'Invoice Processing Bot',
    description: 'Reads PDF invoices from Gmail attachments, extracts line items with GPT-4 Vision, and reconciles against QuickBooks records automatically.',
    status: 'planned',
  },
];
