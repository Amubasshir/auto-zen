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
  {
    id: 'month-1',
    monthNumber: 1,
    title: 'AI Fundamentals & Tools',
    goal: 'Understand the AI landscape and master core automation tools',
    milestone: 'Build 2 basic automation projects',
    color: '#6366f1',
    weeks: [
      {
        id: 'week-1-1',
        weekNumber: 1,
        title: 'Introduction to AI Automation',
        items: [
          {
            id: 'item-1-1-1',
            title: 'What is AI Automation?',
            type: 'course',
            url: 'https://example.com/intro-ai-automation',
            completed: true,
            tasks: [
              {
                id: 'task-1-1-1-1',
                label: 'Watch intro video',
                completed: true,
              },
              {
                id: 'task-1-1-1-2',
                label: 'Read overview article',
                completed: true,
              },
            ],
          },
          {
            id: 'item-1-1-2',
            title: 'AI Automation Landscape in 2026',
            type: 'youtube',
            url: 'https://youtube.com/watch?v=example',
            completed: true,
            tasks: [
              { id: 'task-1-1-2-1', label: 'Watch video', completed: true },
              {
                id: 'task-1-1-2-2',
                label: 'Take notes on key tools',
                completed: true,
              },
            ],
          },
        ],
      },
      {
        id: 'week-1-2',
        weekNumber: 2,
        title: 'Core Tools Setup',
        items: [
          {
            id: 'item-1-2-1',
            title: 'Setting up your AI toolkit',
            type: 'docs',
            url: 'https://example.com/toolkit-setup',
            completed: true,
            tasks: [
              {
                id: 'task-1-2-1-1',
                label: 'Install Node.js & npm',
                completed: true,
              },
              {
                id: 'task-1-2-1-2',
                label: 'Set up VS Code with AI extensions',
                completed: true,
              },
              {
                id: 'task-1-2-1-3',
                label: 'Create first automation script',
                completed: true,
              },
            ],
          },
          {
            id: 'item-1-2-2',
            title: 'Understanding APIs',
            type: 'course',
            completed: true,
            tasks: [
              {
                id: 'task-1-2-2-1',
                label: 'Complete API basics module',
                completed: true,
              },
              {
                id: 'task-1-2-2-2',
                label: 'Make first API call',
                completed: true,
              },
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
            title: 'Prompt engineering for automation',
            type: 'course',
            completed: true,
            tasks: [
              {
                id: 'task-1-3-1-1',
                label: 'Complete prompt engineering course',
                completed: true,
              },
              {
                id: 'task-1-3-1-2',
                label: 'Practice with 10 prompts',
                completed: true,
              },
            ],
          },
          {
            id: 'item-1-3-2',
            title: 'Prompt patterns for developers',
            type: 'article',
            url: 'https://example.com/prompt-patterns',
            completed: true,
            tasks: [
              { id: 'task-1-3-2-1', label: 'Read article', completed: true },
              {
                id: 'task-1-3-2-2',
                label: 'Save useful patterns',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-1-4',
        weekNumber: 4,
        title: 'First Automation Project',
        items: [
          {
            id: 'item-1-4-1',
            title: 'Build a simple AI agent',
            type: 'github',
            url: 'https://github.com/example/first-agent',
            completed: true,
            tasks: [
              {
                id: 'task-1-4-1-1',
                label: 'Clone starter repo',
                completed: true,
              },
              {
                id: 'task-1-4-1-2',
                label: 'Implement agent logic',
                completed: true,
              },
              {
                id: 'task-1-4-1-3',
                label: 'Test and document',
                completed: true,
              },
            ],
          },
          {
            id: 'item-1-4-2',
            title: 'Project: Email Auto-Responder',
            type: 'github',
            completed: true,
            tasks: [
              {
                id: 'task-1-4-2-1',
                label: 'Set up email API',
                completed: true,
              },
              {
                id: 'task-1-4-2-2',
                label: 'Build response logic',
                completed: true,
              },
              { id: 'task-1-4-2-3', label: 'Deploy and test', completed: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'month-2',
    monthNumber: 2,
    title: 'No-Code Automation Platforms',
    goal: 'Master no-code tools and build production-ready workflows',
    milestone: 'Deploy 3 automated workflows',
    color: '#8b5cf6',
    weeks: [
      {
        id: 'week-2-1',
        weekNumber: 1,
        title: 'Make (Integromat) Fundamentals',
        items: [
          {
            id: 'item-2-1-1',
            title: 'Make.com platform overview',
            type: 'course',
            completed: true,
            tasks: [
              {
                id: 'task-2-1-1-1',
                label: 'Complete Make basics course',
                completed: true,
              },
              {
                id: 'task-2-1-1-2',
                label: 'Create first scenario',
                completed: true,
              },
            ],
          },
          {
            id: 'item-2-1-2',
            title: 'Webhooks in Make',
            type: 'youtube',
            completed: true,
            tasks: [
              {
                id: 'task-2-1-2-1',
                label: 'Watch webhook tutorial',
                completed: true,
              },
              {
                id: 'task-2-1-2-2',
                label: 'Set up a webhook trigger',
                completed: true,
              },
            ],
          },
        ],
      },
      {
        id: 'week-2-2',
        weekNumber: 2,
        title: 'Advanced Make Scenarios',
        items: [
          {
            id: 'item-2-2-1',
            title: 'Error handling & routing',
            type: 'docs',
            completed: true,
            tasks: [
              {
                id: 'task-2-2-1-1',
                label: 'Read error handling docs',
                completed: true,
              },
              {
                id: 'task-2-2-1-2',
                label: 'Implement error handlers',
                completed: false,
              },
            ],
          },
          {
            id: 'item-2-2-2',
            title: 'Data transformation & iterators',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-2-2-2-1',
                label: 'Complete data transformation module',
                completed: false,
              },
              {
                id: 'task-2-2-2-2',
                label: 'Build data pipeline scenario',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-2-3',
        weekNumber: 3,
        title: 'Zapier & n8n',
        items: [
          {
            id: 'item-2-3-1',
            title: 'Zapier quickstart',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-2-3-1-1',
                label: 'Set up Zapier account',
                completed: false,
              },
              { id: 'task-2-3-1-2', label: 'Create 3 zaps', completed: false },
            ],
          },
          {
            id: 'item-2-3-2',
            title: 'n8n self-hosted setup',
            type: 'github',
            url: 'https://github.com/example/n8n-setup',
            completed: false,
            tasks: [
              {
                id: 'task-2-3-2-1',
                label: 'Deploy n8n locally',
                completed: false,
              },
              {
                id: 'task-2-3-2-2',
                label: 'Build first workflow',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-2-4',
        weekNumber: 4,
        title: 'Project: Multi-Platform Workflow',
        items: [
          {
            id: 'item-2-4-1',
            title: 'Build cross-platform automation',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-2-4-1-1',
                label: 'Design workflow architecture',
                completed: false,
              },
              {
                id: 'task-2-4-1-2',
                label: 'Implement with Make + APIs',
                completed: false,
              },
              {
                id: 'task-2-4-1-3',
                label: 'Test and deploy',
                completed: false,
              },
            ],
          },
          {
            id: 'item-2-4-2',
            title: 'Project: Social Media Scheduler',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-2-4-2-1',
                label: 'Set up social APIs',
                completed: false,
              },
              {
                id: 'task-2-4-2-2',
                label: 'Build scheduling logic',
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'month-3',
    monthNumber: 3,
    title: 'API Integrations & Webhooks',
    goal: 'Master API integration patterns and build connected systems',
    milestone: 'Build an API integration hub',
    color: '#a855f7',
    weeks: [
      {
        id: 'week-3-1',
        weekNumber: 1,
        title: 'REST & GraphQL APIs',
        items: [
          {
            id: 'item-3-1-1',
            title: 'REST API deep dive',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-3-1-1-1',
                label: 'Complete REST API course',
                completed: false,
              },
              {
                id: 'task-3-1-1-2',
                label: 'Build REST client wrapper',
                completed: false,
              },
            ],
          },
          {
            id: 'item-3-1-2',
            title: 'GraphQL for automation',
            type: 'article',
            completed: false,
            tasks: [
              {
                id: 'task-3-1-2-1',
                label: 'Learn GraphQL basics',
                completed: false,
              },
              {
                id: 'task-3-1-2-2',
                label: 'Query a GraphQL API',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-3-2',
        weekNumber: 2,
        title: 'Webhook Mastery',
        items: [
          {
            id: 'item-3-2-1',
            title: 'Building webhook listeners',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-3-2-1-1',
                label: 'Set up webhook receiver',
                completed: false,
              },
              {
                id: 'task-3-2-1-2',
                label: 'Handle payload validation',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-3-3',
        weekNumber: 3,
        title: 'Third-Party API Integration',
        items: [
          {
            id: 'item-3-3-1',
            title: 'Slack, Notion, and Google APIs',
            type: 'docs',
            completed: false,
            tasks: [
              {
                id: 'task-3-3-1-1',
                label: 'Integrate Slack API',
                completed: false,
              },
              {
                id: 'task-3-3-1-2',
                label: 'Integrate Notion API',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-3-4',
        weekNumber: 4,
        title: 'Project: API Hub',
        items: [
          {
            id: 'item-3-4-1',
            title: 'Build an API orchestration service',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-3-4-1-1',
                label: 'Design API hub architecture',
                completed: false,
              },
              {
                id: 'task-3-4-1-2',
                label: 'Implement multi-API workflow',
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'month-4',
    monthNumber: 4,
    title: 'Advanced Workflows & Logic',
    goal: 'Build complex multi-step automations with conditional logic',
    milestone: 'Ship a production-grade automation system',
    color: '#c084fc',
    weeks: [
      {
        id: 'week-4-1',
        weekNumber: 1,
        title: 'Workflow Design Patterns',
        items: [
          {
            id: 'item-4-1-1',
            title: 'Common automation patterns',
            type: 'article',
            completed: false,
            tasks: [
              {
                id: 'task-4-1-1-1',
                label: 'Study 5 design patterns',
                completed: false,
              },
              {
                id: 'task-4-1-1-2',
                label: 'Document patterns for reuse',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-4-2',
        weekNumber: 2,
        title: 'Conditional Logic & Branching',
        items: [
          {
            id: 'item-4-2-1',
            title: 'Building smart workflows',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-4-2-1-1',
                label: 'Implement branching logic',
                completed: false,
              },
              {
                id: 'task-4-2-1-2',
                label: 'Add error recovery paths',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-4-3',
        weekNumber: 3,
        title: 'Data Pipelines',
        items: [
          {
            id: 'item-4-3-1',
            title: 'ETL automation',
            type: 'docs',
            completed: false,
            tasks: [
              {
                id: 'task-4-3-1-1',
                label: 'Build data extraction pipeline',
                completed: false,
              },
              {
                id: 'task-4-3-1-2',
                label: 'Add transformation steps',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-4-4',
        weekNumber: 4,
        title: 'Project: Smart Automation System',
        items: [
          {
            id: 'item-4-4-1',
            title: 'Build an intelligent routing system',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-4-4-1-1',
                label: 'Design routing logic',
                completed: false,
              },
              {
                id: 'task-4-4-1-2',
                label: 'Implement and deploy',
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'month-5',
    monthNumber: 5,
    title: 'Building Production Systems',
    goal: 'Learn to build, test, and deploy production-ready automations',
    milestone: 'Deploy a client-ready automation system',
    color: '#d946ef',
    weeks: [
      {
        id: 'week-5-1',
        weekNumber: 1,
        title: 'Testing & Monitoring',
        items: [
          {
            id: 'item-5-1-1',
            title: 'Testing automation workflows',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-5-1-1-1',
                label: 'Write test cases',
                completed: false,
              },
              {
                id: 'task-5-1-1-2',
                label: 'Set up monitoring',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-5-2',
        weekNumber: 2,
        title: 'Deployment & Scaling',
        items: [
          {
            id: 'item-5-2-1',
            title: 'Deploying to production',
            type: 'docs',
            completed: false,
            tasks: [
              {
                id: 'task-5-2-1-1',
                label: 'Set up CI/CD pipeline',
                completed: false,
              },
              {
                id: 'task-5-2-1-2',
                label: 'Configure auto-scaling',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-5-3',
        weekNumber: 3,
        title: 'Security & Best Practices',
        items: [
          {
            id: 'item-5-3-1',
            title: 'Securing automation systems',
            type: 'article',
            completed: false,
            tasks: [
              {
                id: 'task-5-3-1-1',
                label: 'Implement auth & secrets mgmt',
                completed: false,
              },
              {
                id: 'task-5-3-1-2',
                label: 'Audit security posture',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-5-4',
        weekNumber: 4,
        title: 'Project: Client Automation System',
        items: [
          {
            id: 'item-5-4-1',
            title: 'Build a client-ready automation',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-5-4-1-1',
                label: 'Gather requirements',
                completed: false,
              },
              {
                id: 'task-5-4-1-2',
                label: 'Build and deploy',
                completed: false,
              },
              {
                id: 'task-5-4-1-3',
                label: 'Document for handoff',
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'month-6',
    monthNumber: 6,
    title: 'Portfolio & Job Prep',
    goal: 'Build portfolio and prepare for AI automation roles',
    milestone: 'Land your first AI automation gig or role',
    color: '#ec4899',
    weeks: [
      {
        id: 'week-6-1',
        weekNumber: 1,
        title: 'Portfolio Building',
        items: [
          {
            id: 'item-6-1-1',
            title: 'Create portfolio website',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-6-1-1-1',
                label: 'Design portfolio layout',
                completed: false,
              },
              {
                id: 'task-6-1-1-2',
                label: 'Showcase 3 best projects',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-6-2',
        weekNumber: 2,
        title: 'Case Studies & Documentation',
        items: [
          {
            id: 'item-6-2-1',
            title: 'Write project case studies',
            type: 'article',
            completed: false,
            tasks: [
              {
                id: 'task-6-2-1-1',
                label: 'Write case study for each project',
                completed: false,
              },
              {
                id: 'task-6-2-1-2',
                label: 'Add metrics and results',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-6-3',
        weekNumber: 3,
        title: 'Freelancing & Pricing',
        items: [
          {
            id: 'item-6-3-1',
            title: 'Freelancing on Upwork & Fiverr',
            type: 'course',
            completed: false,
            tasks: [
              {
                id: 'task-6-3-1-1',
                label: 'Set up freelancer profiles',
                completed: false,
              },
              {
                id: 'task-6-3-1-2',
                label: 'Create first gig listing',
                completed: false,
              },
            ],
          },
        ],
      },
      {
        id: 'week-6-4',
        weekNumber: 4,
        title: 'Final Project & Launch',
        items: [
          {
            id: 'item-6-4-1',
            title: 'Capstone: Full client project',
            type: 'github',
            completed: false,
            tasks: [
              {
                id: 'task-6-4-1-1',
                label: 'Complete capstone project',
                completed: false,
              },
              {
                id: 'task-6-4-1-2',
                label: 'Get client testimonial',
                completed: false,
              },
              {
                id: 'task-6-4-1-3',
                label: 'Publish and share',
                completed: false,
              },
            ],
          },
        ],
      },
    ],
  },
];
