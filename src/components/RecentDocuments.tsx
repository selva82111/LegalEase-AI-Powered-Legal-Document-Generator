import { Icon } from './Icons'
import type { DraftDocument } from '../types'

interface RecentDocumentsProps {
  documents: DraftDocument[]
  onOpen: (document: DraftDocument) => void
}

export function RecentDocuments({ documents, onOpen }: RecentDocumentsProps) {
  return <section className="recent-documents" aria-labelledby="recent-title"><div className="section-heading"><div><span className="eyebrow">Your desk</span><h2 id="recent-title">Recent documents</h2></div><span className="section-heading__meta">{String(documents.length).padStart(2, '0')} saved</span></div>{documents.length === 0 ? <div className="empty-state"><div className="empty-state__mark"><Icon name="file" width={22} height={22} /></div><strong>Your desk is waiting.</strong><p>Generate your first draft and it will live here for the next time you need it.</p></div> : <div className="recent-list">{documents.slice(0, 4).map((document) => <button key={document.id} className="recent-card" onClick={() => onOpen(document)}><span className="recent-card__icon" style={{ background: `${document.accent}20`, color: document.accent }}>{document.templateLabel.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><span className="recent-card__body"><strong>{document.title}</strong><small>{document.parties}</small></span><span className="recent-card__date">{new Date(document.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><Icon name="arrow" width={16} height={16} /></button>)}</div>}</section>
}
