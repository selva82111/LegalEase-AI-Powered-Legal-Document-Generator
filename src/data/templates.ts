import type { TemplateDefinition, TemplateId } from '../types'

export const templates: TemplateDefinition[] = [
  {
    id: 'employment',
    label: 'Employment contract',
    shortLabel: 'Employment',
    description: 'Set expectations for a new hire, from responsibilities to confidentiality.',
    eyebrow: 'People & team',
    accent: '#C98761',
    icon: 'EC',
    defaultTerms: ['Role and responsibilities', 'Compensation and payment schedule', 'Confidentiality and inventions', 'Termination and notice'],
  },
  {
    id: 'nda',
    label: 'Non-disclosure agreement',
    shortLabel: 'NDA',
    description: 'Keep sensitive information clear, scoped, and protected from day one.',
    eyebrow: 'Confidentiality',
    accent: '#8EA58B',
    icon: 'ND',
    defaultTerms: ['Definition of confidential information', 'Permitted use and disclosures', 'Term of confidentiality', 'Return or destruction of materials'],
  },
  {
    id: 'lease',
    label: 'Residential lease agreement',
    shortLabel: 'Lease',
    description: 'Shape a thoughtful rental agreement around a home, term, and obligations.',
    eyebrow: 'Property & place',
    accent: '#D6A85B',
    icon: 'RL',
    defaultTerms: ['Premises and permitted use', 'Rent, deposit, and payment timing', 'Repairs and maintenance', 'Renewal and move-out'],
  },
  {
    id: 'service',
    label: 'Service agreement',
    shortLabel: 'Services',
    description: 'Make a client engagement easier to understand before work begins.',
    eyebrow: 'Independent work',
    accent: '#7F9FB1',
    icon: 'SA',
    defaultTerms: ['Scope and deliverables', 'Fees and invoicing', 'Client responsibilities', 'Change requests and termination'],
  },
  {
    id: 'offer',
    label: 'Offer letter',
    shortLabel: 'Offer',
    description: 'Welcome someone new with a clear, considered summary of their role.',
    eyebrow: 'Hiring',
    accent: '#B78FA6',
    icon: 'OL',
    defaultTerms: ['Position and reporting line', 'Salary and benefits', 'Start date and location', 'At-will employment and acceptance'],
  },
]

export const getTemplate = (id: TemplateId) => templates.find((template) => template.id === id) ?? templates[0]
