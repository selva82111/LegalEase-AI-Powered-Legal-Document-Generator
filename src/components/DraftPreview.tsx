import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Icon } from './Icons'
import { getTemplate } from '../data/templates'
import type { DraftDocument } from '../types'

interface DraftPreviewProps {
  draft: DraftDocument
  isEditing: boolean
  isDark: boolean
  onToggleTheme: () => void
  onToggleEdit: () => void
  onChange: (content: string) => void
  onSave: () => void
  onDownload: (kind: 'txt' | 'doc' | 'pdf') => void
  onBack: () => void
}

export function DraftPreview({ draft, isEditing, isDark, onToggleTheme, onToggleEdit, onChange, onSave, onDownload, onBack }: DraftPreviewProps) {
  const template = getTemplate(draft.templateId)
  const blocks = useMemo(() => draft.content.split('\n\n'), [draft.content])

  return (
    <section className={`draft-preview panel-card ${isDark ? 'draft-preview--dark' : ''}`} aria-labelledby="draft-title">
      <div className="draft-preview__toolbar">
        <div className="draft-preview__toolbar-left"><button className="back-button" onClick={onBack}><Icon name="chevron" width={16} height={16} /> Back to brief</button><span className="toolbar-divider" /><span className="save-state"><span className="save-state__dot" /> Saved just now</span></div>
        <div className="draft-preview__toolbar-actions"><button className="icon-button" onClick={onToggleTheme} aria-label={isDark ? 'Use light preview' : 'Use dark preview'}>{isDark ? <Icon name="sun" /> : <Icon name="moon" />}</button><button className="button button--quiet" onClick={onToggleEdit}><Icon name="edit" width={16} height={16} /> {isEditing ? 'Preview' : 'Edit text'}</button></div>
      </div>
      <div className="draft-preview__meta"><div><span className="eyebrow">{template.eyebrow}</span><h2 id="draft-title">{draft.title}</h2><p>{draft.templateLabel} · {draft.parties} · Effective {draft.effectiveDate}</p></div><span className="draft-status"><Icon name="check" width={14} height={14} /> Ready to review</span></div>
      <div className="document-sheet-wrap">
        <div className="document-sheet" style={{ '--document-accent': draft.accent } as CSSProperties}>
          <div className="document-sheet__header"><div className="document-sheet__seal">LE</div><div><span>{draft.templateLabel}</span><strong>LegalEase draft</strong></div><span className="document-sheet__edition">01 / Draft</span></div>
          {isEditing ? <textarea className="document-editor" value={draft.content} onChange={(event) => onChange(event.target.value)} aria-label="Edit legal document text" /> : <div className="document-content">{blocks.map((block, index) => { const lines = block.split('\n'); const first = lines[0]; const isHeading = /^[A-Z\d][A-Z\d &/.'-]{4,}$/.test(first) || /^\d\./.test(first); return <div key={`${first}-${index}`} className={isHeading ? 'document-block document-block--heading' : 'document-block'}>{isHeading && <span className="document-rule" />}{lines.map((line, lineIndex) => <p key={`${line}-${lineIndex}`} className={lineIndex === 0 && isHeading ? 'document-line document-line--heading' : 'document-line'}>{line || '\u00a0'}</p>)}</div> })}</div>}
          <div className="document-sheet__footer"><span>{draft.title}</span><span>LegalEase · {new Date(draft.updatedAt).getFullYear()}</span></div>
        </div>
      </div>
      <div className="draft-preview__footer"><div className="draft-tip"><Icon name="shield" width={16} height={16} /><span><strong>Starting point, not legal advice.</strong><small>Review with a qualified professional before relying on this draft.</small></span></div><div className="export-actions"><button className="button button--outline" onClick={() => onDownload('txt')}><Icon name="download" width={15} height={15} /> TXT</button><button className="button button--outline" onClick={() => onDownload('doc')}><Icon name="download" width={15} height={15} /> Word</button><button className="button button--primary" onClick={() => onDownload('pdf')}><Icon name="printer" width={15} height={15} /> Print / PDF</button>{isEditing && <button className="button button--secondary" onClick={onSave}><Icon name="check" width={15} height={15} /> Save changes</button>}</div></div>
    </section>
  )
}
