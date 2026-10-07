export type TemplateId = 'employment' | 'nda' | 'lease' | 'service' | 'offer'

export type DocumentStatus = 'draft' | 'ready'

export interface TemplateDefinition {
  id: TemplateId
  label: string
  shortLabel: string
  description: string
  eyebrow: string
  accent: string
  defaultTerms: string[]
  icon: string
}

export interface DocumentFormValues {
  templateId: TemplateId
  documentTitle: string
  firstParty: string
  secondParty: string
  effectiveDate: string
  jurisdiction: string
  terms: string
}

export interface DraftDocument {
  id: string
  title: string
  templateId: TemplateId
  templateLabel: string
  parties: string
  effectiveDate: string
  createdAt: string
  updatedAt: string
  content: string
  status: DocumentStatus
  accent: string
}

export interface BrandSettings {
  companyName: string
  logoUrl: string
  accentColor: string
}
