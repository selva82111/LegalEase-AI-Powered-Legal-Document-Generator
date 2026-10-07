import { getTemplate } from '../data/templates'
import type { BrandSettings, DocumentFormValues, DraftDocument, TemplateId } from '../types'

const formatDate = (value: string) => {
  if (!value) return 'the effective date stated below'
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const clean = (value: string, fallback: string) => value.trim() || fallback

const introByTemplate: Record<TemplateId, string> = {
  employment: 'This Employment Contract (the “Agreement”) sets out the principal terms under which the Company engages the Employee to contribute their experience, judgment, and care.',
  nda: 'This Non-Disclosure Agreement (the “Agreement”) establishes a practical framework for protecting non-public information shared between the parties in connection with their discussions.',
  lease: 'This Residential Lease Agreement (the “Lease”) records the shared understanding between the Landlord and Tenant regarding the use and care of the premises described below.',
  service: 'This Service Agreement (the “Agreement”) describes the services, responsibilities, and commercial terms that will guide the relationship between the Client and the Service Provider.',
  offer: 'This Offer Letter summarizes the principal terms of the opportunity described below. It is intended to make the next step clear and considered for both parties.',
}

const sectionByTemplate: Record<TemplateId, string[]> = {
  employment: ['1. Appointment and responsibilities', '2. Compensation and benefits', '3. Confidentiality and work product', '4. Termination', '5. General provisions'],
  nda: ['1. Purpose and confidential information', '2. Obligations of the receiving party', '3. Exclusions and permitted disclosures', '4. Term and return of information', '5. General provisions'],
  lease: ['1. Premises and permitted use', '2. Rent and security deposit', '3. Care, repairs, and access', '4. Term and renewal', '5. General provisions'],
  service: ['1. Scope of services', '2. Fees and payment', '3. Collaboration and approvals', '4. Changes and termination', '5. General provisions'],
  offer: ['1. Position and start date', '2. Compensation and benefits', '3. Policies and confidentiality', '4. At-will relationship', '5. Acceptance'],
}

const paragraphByTemplate: Record<TemplateId, string[]> = {
  employment: [
    'The Employee will serve in the role described by the parties and will devote the time and attention reasonably necessary to perform the responsibilities associated with that role. The Employee will follow lawful directions, maintain professional standards, and promptly surface material risks or conflicts.',
    'The Company will provide the compensation and benefits described in the parties’ written offer or compensation schedule. Payments will be made in accordance with the Company’s ordinary payroll practices and subject to applicable withholdings.',
    'The Employee will protect the Company’s confidential information and will promptly disclose work product created in the course of employment, subject to applicable law and any written carve-outs agreed by the parties.',
    'Either party may end the relationship with the notice stated in the parties’ written terms. On termination, each party will return property and cooperate in a reasonable handover of open matters.',
    'This Agreement is the parties’ current understanding of the subject matter. Any amendment should be made in writing and acknowledged by both parties.',
  ],
  nda: [
    'Confidential Information means non-public business, technical, financial, product, customer, or strategic information disclosed by or on behalf of the Disclosing Party, whether disclosed orally, visually, electronically, or in writing.',
    'The Receiving Party will use Confidential Information only for the stated business purpose, will limit access to people who need to know it, and will use reasonable care to protect it from unauthorized use or disclosure.',
    'Information that is already public without breach, independently developed without use of Confidential Information, or lawfully received from a third party without a duty of confidence is not Confidential Information. A disclosure required by law is permitted after reasonable notice where legally allowed.',
    'The confidentiality obligations will continue for the period agreed by the parties. Upon request or conclusion of the purpose, the Receiving Party will return or securely destroy Confidential Information, subject to routine backup retention.',
    'This Agreement does not require either party to proceed with a transaction. It is governed by the jurisdiction identified below, and any changes should be written and acknowledged by both parties.',
  ],
  lease: [
    'The Landlord lets the premises to the Tenant for residential use only. The premises, together with any included fixtures or areas, are described by the address and details provided in the parties’ intake.',
    'The Tenant will pay the stated rent on the agreed schedule. Any security deposit will be held and returned in accordance with applicable law, subject to lawful deductions for unpaid amounts or damage beyond ordinary wear.',
    'The Tenant will keep the premises reasonably clean, promptly report material issues, and avoid activities that create a nuisance or violate applicable rules. The Landlord may access the premises with reasonable notice except in an emergency.',
    'The Lease begins on the effective date and continues for the stated term. Renewal, holdover, and move-out will be handled in accordance with the parties’ written terms and applicable law.',
    'This Lease is the parties’ current understanding of the rental arrangement. Any amendment should be in writing. Nothing in this draft is intended to replace local landlord-tenant requirements.',
  ],
  service: [
    'The Service Provider will perform the services and deliverables described by the parties, using reasonable skill and care. Any assumptions, dependencies, or timing constraints should be documented alongside the agreed scope.',
    'The Client will pay the fees stated by the parties according to the agreed schedule. Invoices are due within the stated payment period, and approved expenses will be reimbursed when properly documented.',
    'The Client will provide timely access, information, and approvals reasonably needed for the work. Feedback should be consolidated where possible so the Service Provider can keep the work moving and the record clear.',
    'Material changes to scope, timing, or fees should be agreed in writing before the changed work begins. Either party may end the engagement on the notice stated in the commercial terms.',
    'This Agreement is the parties’ current understanding of the engagement. Each party remains responsible for its own personnel, taxes, and compliance obligations.',
  ],
  offer: [
    'The Company is pleased to offer the Candidate the position described below, reporting to the manager identified by the parties. The role will begin on the agreed start date unless the parties confirm another date in writing.',
    'The Candidate will receive the compensation and benefits described in the attached or referenced schedule, subject to normal payroll practices and the terms of the applicable plans or policies.',
    'The Candidate will follow the Company’s reasonable policies and protect confidential information encountered through the role. Any material inventions or work product will be handled under the Company’s written policies and applicable law.',
    'Unless a separate written agreement says otherwise, the relationship is at-will and may be ended by either party at any time, with or without cause or advance notice, subject to applicable law.',
    'The Candidate may accept this offer by signing below or confirming acceptance through the agreed channel. This letter is a starting point for a shared understanding and should be reviewed with appropriate advisors.',
  ],
}

const buildContent = (values: DocumentFormValues, brand: BrandSettings) => {
  const template = getTemplate(values.templateId)
  const firstParty = clean(values.firstParty, 'First party')
  const secondParty = clean(values.secondParty, 'Second party')
  const jurisdiction = clean(values.jurisdiction, 'the applicable jurisdiction')
  const terms = values.terms.split('\n').map((term) => term.trim()).filter(Boolean)
  const sections = sectionByTemplate[values.templateId]
  const paragraphs = paragraphByTemplate[values.templateId]
  const termsBlock = (terms.length ? terms : template.defaultTerms).map((term, index) => `${index + 1}. ${term}`).join('\n')
  const legalParties = values.templateId === 'lease'
    ? `Landlord: ${firstParty}\nTenant: ${secondParty}`
    : `Party 1: ${firstParty}\nParty 2: ${secondParty}`

  const body = sections.map((section, index) => `${section}\n${paragraphs[index]}`).join('\n\n')

  return `${brand.companyName}\n${template.label.toUpperCase()}\n\n${introByTemplate[values.templateId]}\n\nPARTIES\n${legalParties}\nEffective date: ${formatDate(values.effectiveDate)}\nGoverning jurisdiction: ${jurisdiction}\n\nKEY TERMS\n${termsBlock}\n\n${body}\n\nSIGNATURES\n\n${firstParty}\nSignature: __________________________    Date: __________________\n\n${secondParty}\nSignature: __________________________    Date: __________________\n\nDRAFT NOTE\nThis draft was prepared with LegalEase as a starting point for discussion. It is not legal advice and should be reviewed by a qualified legal professional for your specific situation.`
}

export async function generateLocalDocument(values: DocumentFormValues, brand: BrandSettings): Promise<DraftDocument> {
  await new Promise((resolve) => window.setTimeout(resolve, 1200))
  const template = getTemplate(values.templateId)
  const now = new Date()
  const content = buildContent(values, brand)
  return {
    id: crypto.randomUUID(),
    title: clean(values.documentTitle, `${template.shortLabel} draft`),
    templateId: values.templateId,
    templateLabel: template.label,
    parties: `${clean(values.firstParty, 'First party')} + ${clean(values.secondParty, 'Second party')}`,
    effectiveDate: formatDate(values.effectiveDate),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    content,
    status: 'ready',
    accent: brand.accentColor || template.accent,
  }
}

export function downloadText(document: DraftDocument) {
  downloadBlob(document.content, `${slugify(document.title)}.txt`, 'text/plain;charset=utf-8')
}

export function downloadWord(document: DraftDocument) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;max-width:720px;margin:48px auto;line-height:1.65;color:#18211f}h1{font-size:24px}pre{white-space:pre-wrap;font:15px/1.7 Georgia,serif}</style></head><body><pre>${escapeHtml(document.content)}</pre></body></html>`
  downloadBlob(html, `${slugify(document.title)}.doc`, 'application/msword')
}

export function printDocument(document: DraftDocument) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=720')
  if (!printWindow) return false
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(document.title)}</title><style>body{font-family:Georgia,serif;max-width:720px;margin:52px auto;line-height:1.7;color:#18211f}pre{white-space:pre-wrap;font:15px/1.7 Georgia,serif}@media print{body{margin:0}}</style></head><body><pre>${escapeHtml(document.content)}</pre><script>window.onload=()=>window.print()<\/script></body></html>`)
  printWindow.document.close()
  return true
}

function downloadBlob(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 500)
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'legalease-document'
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character)
}
