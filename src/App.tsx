import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { BrandMark } from './components/BrandMark'
import { BrandSettings } from './components/BrandSettings'
import { DraftPreview } from './components/DraftPreview'
import { Icon } from './components/Icons'
import { RecentDocuments } from './components/RecentDocuments'
import { SetupPanel } from './components/SetupPanel'
import { Sidebar } from './components/Sidebar'
import { getTemplate, templates } from './data/templates'
import { downloadText, downloadWord, generateLocalDocument, printDocument } from './services/documentGenerator'
import type { BrandSettings as BrandSettingsType, DocumentFormValues, DraftDocument, TemplateId } from './types'

const documentsKey = 'legalease-documents-v1'
const brandKey = 'legalease-brand-v1'

const initialForm: DocumentFormValues = {
  templateId: 'employment',
  documentTitle: 'New hire agreement — Maya',
  firstParty: 'Northline Studio LLC',
  secondParty: 'Maya Chen',
  effectiveDate: '2026-10-15',
  jurisdiction: 'State of New York',
  terms: 'Full-time role as Product Designer\nAnnual salary of $96,000, paid bi-weekly\nStart date of October 15, 2026\nEither party may terminate with 14 days notice',
}

const initialBrand: BrandSettingsType = { companyName: 'Northline Studio', logoUrl: '', accentColor: '#B76E4C' }

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [form, setForm] = useState<DocumentFormValues>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormValues, string>>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [draft, setDraft] = useState<DraftDocument | null>(null)
  const [documents, setDocuments] = useState<DraftDocument[]>([])
  const [brand, setBrand] = useState<BrandSettingsType>(initialBrand)
  const [isEditing, setIsEditing] = useState(false)
  const [isDarkPreview, setIsDarkPreview] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      const storedDocuments = window.localStorage.getItem(documentsKey)
      const storedBrand = window.localStorage.getItem(brandKey)
      if (storedDocuments) setDocuments(JSON.parse(storedDocuments))
      if (storedBrand) setBrand({ ...initialBrand, ...JSON.parse(storedBrand) })
    } catch {
      // Local storage is an enhancement; the workspace remains usable if unavailable.
    }
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = window.setTimeout(() => setToast(''), 3200)
      return () => window.clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', brand.accentColor)
    document.documentElement.style.setProperty('--accent-soft', `${brand.accentColor}18`)
    try { window.localStorage.setItem(brandKey, JSON.stringify(brand)) } catch { /* non-blocking */ }
  }, [brand])

  const selectedTemplate = useMemo(() => getTemplate(form.templateId), [form.templateId])

  const showToast = (message: string) => setToast(message)
  const updateForm = (field: keyof DocumentFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const selectTemplate = (templateId: TemplateId) => {
    const template = getTemplate(templateId)
    setForm((current) => ({ ...current, templateId, terms: template.defaultTerms.join('\n'), documentTitle: `${template.shortLabel} draft` }))
    setDraft(null)
    setIsEditing(false)
    window.setTimeout(() => document.getElementById('setup-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof DocumentFormValues, string>> = {}
    if (!form.firstParty.trim()) nextErrors.firstParty = 'Add the first party to continue.'
    if (!form.secondParty.trim()) nextErrors.secondParty = 'Add the second party to continue.'
    if (!form.effectiveDate) nextErrors.effectiveDate = 'Choose an effective date.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const persistDocuments = (next: DraftDocument[]) => {
    setDocuments(next)
    try { window.localStorage.setItem(documentsKey, JSON.stringify(next)) } catch { /* non-blocking */ }
  }

  const handleGenerate = async () => {
    if (!validate()) {
      showToast('A couple of details need your attention.')
      return
    }
    setIsGenerating(true)
    setDraft(null)
    try {
      const generated = await generateLocalDocument(form, brand)
      setDraft(generated)
      persistDocuments([generated, ...documents.filter((item) => item.id !== generated.id)].slice(0, 12))
      setIsEditing(false)
      showToast('Your first draft is ready to review.')
    } catch {
      showToast('We could not draft that just now. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!draft) return
    const saved = { ...draft, updatedAt: new Date().toISOString() }
    setDraft(saved)
    persistDocuments([saved, ...documents.filter((item) => item.id !== saved.id)].slice(0, 12))
    setIsEditing(false)
    showToast('Changes saved to your desk.')
  }

  const handleOpen = (document: DraftDocument) => {
    setDraft(document)
    setIsEditing(false)
    setActiveTab('workspace')
    showToast(`${document.title} is open.`)
  }

  const handleDownload = (kind: 'txt' | 'doc' | 'pdf') => {
    if (!draft) return
    if (kind === 'txt') downloadText(draft)
    if (kind === 'doc') downloadWord(draft)
    if (kind === 'pdf') printDocument(draft)
    showToast(kind === 'pdf' ? 'Print dialog opened — choose “Save as PDF”.' : `Downloaded ${kind === 'doc' ? 'a Word-compatible file' : 'your plain-text draft'}.`)
  }

  const renderWorkspace = () => {
    if (draft) return <DraftPreview draft={draft} isEditing={isEditing} isDark={isDarkPreview} onToggleTheme={() => setIsDarkPreview((value) => !value)} onToggleEdit={() => setIsEditing((value) => !value)} onChange={(content) => setDraft((current) => current ? { ...current, content } : current)} onSave={handleSave} onDownload={handleDownload} onBack={() => setDraft(null)} />
    return <>
      <section className="hero-block"><div className="hero-block__copy"><span className="eyebrow">Tuesday, October 06, 2026 <span className="eyebrow__dot" /> Alex’s workspace</span><h1>Turn a brief into<br /><em>a first draft.</em></h1><p>LegalEase brings structure to the documents that move your work forward — without the legal learning curve.</p><button className="button button--primary button--large" onClick={() => document.getElementById('setup-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Start a new document <Icon name="arrow" width={17} height={17} /></button></div><div className="hero-block__aside"><div className="hero-orbit"><div className="hero-orbit__ring hero-orbit__ring--outer" /><div className="hero-orbit__ring hero-orbit__ring--inner" /><div className="hero-orbit__seal">LE</div><span className="hero-orbit__label hero-orbit__label--top">CLEAR<br />TERMS</span><span className="hero-orbit__label hero-orbit__label--bottom">READY<br />TO REVIEW</span></div></div></section>
      <section className="templates-section" aria-labelledby="templates-title"><div className="section-heading"><div><span className="eyebrow">Choose a starting point</span><h2 id="templates-title">What are we making today?</h2></div><span className="section-heading__meta">{templates.length} templates</span></div><div className="template-grid">{templates.map((template) => <button key={template.id} className={`template-card ${form.templateId === template.id ? 'is-selected' : ''}`} onClick={() => selectTemplate(template.id)}><span className="template-card__top"><span className="template-card__icon" style={{ background: `${template.accent}22`, color: template.accent }}>{template.icon}</span><Icon name="arrow" width={16} height={16} /></span><span className="template-card__eyebrow">{template.eyebrow}</span><strong>{template.label}</strong><small>{template.description}</small></button>)}</div></section>
      <SetupPanel values={form} onChange={updateForm} onGenerate={handleGenerate} errors={errors} isGenerating={isGenerating} />
      <RecentDocuments documents={documents} onOpen={handleOpen} />
    </>
  }

  const renderContent = () => {
    if (activeTab === 'settings') return <BrandSettings settings={brand} onChange={setBrand} />
    if (activeTab === 'documents') return <section className="documents-view"><div className="view-header"><div><span className="eyebrow">Your desk</span><h1>All documents.</h1><p>Everything you’ve drafted, in one calm place.</p></div><button className="button button--primary" onClick={() => { setActiveTab('workspace'); setDraft(null) }}><Icon name="plus" width={16} height={16} /> New document</button></div><RecentDocuments documents={documents} onOpen={handleOpen} /></section>
    if (activeTab === 'activity') return <section className="activity-view"><div className="view-header"><div><span className="eyebrow">Workspace rhythm</span><h1>Your activity.</h1><p>A small, useful record of what’s moved forward.</p></div></div><div className="activity-card panel-card"><div className="activity-row"><span className="activity-row__dot activity-row__dot--copper" /><div><strong>Workspace ready</strong><small>LegalEase is set up for your next document.</small></div><time>Now</time></div>{documents.map((document) => <div className="activity-row" key={document.id}><span className="activity-row__dot" style={{ background: document.accent }} /><div><strong>{document.title}</strong><small>{document.templateLabel} · saved to your desk</small></div><time>{new Date(document.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time></div>)}</div></section>
    if (activeTab === 'help') return <section className="help-view"><div className="view-header"><div><span className="eyebrow">A considered start</span><h1>How LegalEase works.</h1><p>Give us the shape of the agreement. Keep the language yours.</p></div></div><div className="help-grid"><div className="help-card panel-card"><span className="help-card__number">01</span><h2>Brief the document</h2><p>Choose a template, name the parties, and add the terms that matter to your situation.</p></div><div className="help-card panel-card"><span className="help-card__number">02</span><h2>Review the structure</h2><p>LegalEase turns the brief into an editable first draft with a clear, professional shape.</p></div><div className="help-card panel-card"><span className="help-card__number">03</span><h2>Make it yours</h2><p>Adjust the language, add your brand, and export a Word-compatible file or save as PDF.</p></div></div><div className="help-banner"><Icon name="shield" width={20} height={20} /><p><strong>A useful reminder.</strong> LegalEase helps you get to a considered starting point. It is not a substitute for legal advice.</p></div></section>
    return renderWorkspace()
  }

  return <div className="app-shell" style={{ '--accent': brand.accentColor, '--accent-soft': `${brand.accentColor}18` } as CSSProperties}>
    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    <main className="main-content"><header className="mobile-header"><button className="icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button><BrandMark compact /><button className="avatar avatar--mobile" onClick={() => setActiveTab('settings')} aria-label="Open brand settings">AC</button></header><div className="topbar"><div className="breadcrumb"><span className="breadcrumb__active">{activeTab === 'workspace' ? 'Workspace' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>{draft && <><span>/</span><span>{draft.title}</span></>}</div><div className="topbar__actions"><button className="quiet-link" onClick={() => setActiveTab('help')}><Icon name="help" width={16} height={16} /> Need a hand?</button><button className="avatar" onClick={() => setActiveTab('settings')} aria-label="Open profile settings">AC</button></div></div><div className="content-wrap">{renderContent()}</div><footer className="site-footer"><span>LegalEase © 2026</span><span>Made for the moments between “we should” and “it’s signed.”</span></footer></main>{toast && <div className="toast" role="status"><span className="toast__icon"><Icon name="check" width={15} height={15} /></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><Icon name="close" width={14} height={14} /></button></div>}
  </div>
}
