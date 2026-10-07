import { BrandMark } from './BrandMark'
import { Icon, type IconName } from './Icons'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const primaryItems: { id: string; label: string; icon: IconName }[] = [
  { id: 'workspace', label: 'Workspace', icon: 'grid' },
  { id: 'documents', label: 'Documents', icon: 'file' },
  { id: 'activity', label: 'Activity', icon: 'clock' },
]

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      <button className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`} onClick={onClose} aria-label="Close navigation" />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar__top">
          <BrandMark />
          <button className="icon-button sidebar__close" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
        </div>
        <div className="sidebar__label">Your desk</div>
        <nav className="sidebar__nav" aria-label="Primary navigation">
          {primaryItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? 'is-active' : ''}`} onClick={() => { onTabChange(item.id); onClose() }}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === 'documents' && <span className="nav-item__count">04</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar__spacer" />
        <div className="sidebar__label">Workspace</div>
        <nav className="sidebar__nav" aria-label="Workspace navigation">
          <button className={`nav-item ${activeTab === 'settings' ? 'is-active' : ''}`} onClick={() => { onTabChange('settings'); onClose() }}><Icon name="settings" /><span>Brand settings</span></button>
          <button className="nav-item" onClick={() => onTabChange('help')}><Icon name="help" /><span>Help centre</span></button>
        </nav>
        <div className="sidebar__footer">
          <div className="privacy-note"><span className="privacy-note__icon"><Icon name="shield" width={15} height={15} /></span><span><strong>Private by default</strong><small>Your drafts stay in this browser.</small></span></div>
          <div className="profile-card"><div className="avatar">AC</div><div><strong>Alex Carter</strong><small>Owner workspace</small></div><Icon name="more" width={17} height={17} /></div>
        </div>
      </aside>
    </>
  )
}
