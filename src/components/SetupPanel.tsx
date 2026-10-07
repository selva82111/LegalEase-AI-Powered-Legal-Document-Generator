import type { ChangeEvent } from 'react'
import { getTemplate } from '../data/templates'
import type { DocumentFormValues } from '../types'
import { Icon } from './Icons'

interface SetupPanelProps {
  values: DocumentFormValues
  onChange: (field: keyof DocumentFormValues, value: string) => void
  onGenerate: () => void
  errors: Partial<Record<keyof DocumentFormValues, string>>
  isGenerating: boolean
}

export function SetupPanel({ values, onChange, onGenerate, errors, isGenerating }: SetupPanelProps) {
  const template = getTemplate(values.templateId)
  const update = (field: keyof DocumentFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(field, event.target.value)

  return (
    <section className="setup-panel panel-card" aria-labelledby="setup-title">
      <div className="panel-card__heading">
        <div>
          <span className="eyebrow">01 / The brief</span>
          <h2 id="setup-title">Tell us what you’re making.</h2>
          <p>A clear brief gives your first draft a stronger point of view.</p>
        </div>
        <span className="step-badge">1 of 2</span>
      </div>

      <div className="form-grid">
        <div className="field field--wide">
          <label htmlFor="documentTitle">Document name <span>Optional</span></label>
          <input id="documentTitle" value={values.documentTitle} onChange={update('documentTitle')} placeholder="e.g. New hire agreement — Maya" />
        </div>
        <div className="field">
          <label htmlFor="firstParty">First party</label>
          <input id="firstParty" value={values.firstParty} onChange={update('firstParty')} placeholder={values.templateId === 'lease' ? 'Landlord or owner' : 'Company or person'} aria-invalid={Boolean(errors.firstParty)} aria-describedby={errors.firstParty ? 'firstParty-error' : undefined} />
          {errors.firstParty && <span className="field-error" id="firstParty-error">{errors.firstParty}</span>}
        </div>
        <div className="field">
          <label htmlFor="secondParty">Second party</label>
          <input id="secondParty" value={values.secondParty} onChange={update('secondParty')} placeholder={values.templateId === 'lease' ? 'Tenant or occupant' : 'Person or organization'} aria-invalid={Boolean(errors.secondParty)} aria-describedby={errors.secondParty ? 'secondParty-error' : undefined} />
          {errors.secondParty && <span className="field-error" id="secondParty-error">{errors.secondParty}</span>}
        </div>
        <div className="field">
          <label htmlFor="effectiveDate">Effective date</label>
          <input id="effectiveDate" type="date" value={values.effectiveDate} onChange={update('effectiveDate')} aria-invalid={Boolean(errors.effectiveDate)} aria-describedby={errors.effectiveDate ? 'effectiveDate-error' : undefined} />
          {errors.effectiveDate && <span className="field-error" id="effectiveDate-error">{errors.effectiveDate}</span>}
        </div>
        <div className="field">
          <label htmlFor="jurisdiction">Governing jurisdiction <span>Optional</span></label>
          <input id="jurisdiction" value={values.jurisdiction} onChange={update('jurisdiction')} placeholder="e.g. State of New York" />
        </div>
        <div className="field field--wide">
          <div className="field__label-row"><label htmlFor="terms">Specific terms</label><button type="button" className="text-button" onClick={() => onChange('terms', template.defaultTerms.join('\n'))}>Use suggested terms</button></div>
          <textarea id="terms" value={values.terms} onChange={update('terms')} rows={6} placeholder="Add one term per line — payment timing, notice periods, responsibilities…" />
          <span className="field-hint">Start with the facts that matter most. You can edit the draft afterwards.</span>
        </div>
      </div>

      <div className="setup-panel__footer">
        <div className="setup-note"><span className="setup-note__icon"><Icon name="spark" width={15} height={15} /></span><span><strong>{template.label}</strong><small>Drafted in your workspace voice</small></span></div>
        <button className="button button--primary" onClick={onGenerate} disabled={isGenerating}>{isGenerating ? <><span className="button-spinner" /> Drafting…</> : <>Generate draft <Icon name="arrow" width={17} height={17} /></>}</button>
      </div>
    </section>
  )
}
