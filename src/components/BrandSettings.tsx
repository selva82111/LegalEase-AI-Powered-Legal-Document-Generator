import { useRef } from 'react'
import type { CSSProperties } from 'react'
import type { BrandSettings } from '../types'
import { Icon } from './Icons'

interface BrandSettingsProps {
  settings: BrandSettings
  onChange: (settings: BrandSettings) => void
}

export function BrandSettings({ settings, onChange }: BrandSettingsProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const update = (field: keyof BrandSettings, value: string) => onChange({ ...settings, [field]: value })

  const readLogo = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('logoUrl', String(reader.result))
    reader.readAsDataURL(file)
  }

  return <section className="settings-view"><div className="settings-view__header"><div><span className="eyebrow">Workspace preferences</span><h1>Make the desk yours.</h1><p>Your workspace voice appears on draft previews and exported documents.</p></div><div className="settings-view__stamp"><span>LE</span><small>Workspace</small></div></div><div className="settings-grid"><div className="panel-card settings-card"><div className="panel-card__heading"><div><span className="eyebrow">Identity</span><h2>Company details</h2><p>A little context makes every draft feel more like yours.</p></div></div><div className="field"><label htmlFor="companyName">Company or workspace name</label><input id="companyName" value={settings.companyName} onChange={(event) => update('companyName', event.target.value)} /></div><div className="field"><label>Workspace mark</label><div className="logo-upload"><div className="logo-upload__preview">{settings.logoUrl ? <img src={settings.logoUrl} alt="Uploaded workspace mark" /> : <span>LE</span>}</div><div><button className="button button--outline" onClick={() => fileInput.current?.click()}><Icon name="upload" width={15} height={15} /> Upload mark</button><small>PNG or SVG · kept in this browser</small></div><input ref={fileInput} type="file" accept="image/png,image/svg+xml" hidden onChange={(event) => readLogo(event.target.files?.[0])} /></div></div></div><div className="panel-card settings-card"><div className="panel-card__heading"><div><span className="eyebrow">Accent</span><h2>Signature colour</h2><p>Use one signal colour to carry your identity through the desk.</p></div></div><div className="color-options"><button className={`color-swatch color-swatch--copper ${settings.accentColor === '#B76E4C' ? 'is-selected' : ''}`} onClick={() => update('accentColor', '#B76E4C')} aria-label="Oxidized copper" /><button className={`color-swatch color-swatch--moss ${settings.accentColor === '#8EA58B' ? 'is-selected' : ''}`} onClick={() => update('accentColor', '#8EA58B')} aria-label="Soft moss" /><button className={`color-swatch color-swatch--ink ${settings.accentColor === '#18211F' ? 'is-selected' : ''}`} onClick={() => update('accentColor', '#18211F')} aria-label="Ink" /><label className="custom-color"><input type="color" value={settings.accentColor} onChange={(event) => update('accentColor', event.target.value)} /><span style={{ background: settings.accentColor }} />Custom</label></div><div className="settings-preview" style={{ '--preview-accent': settings.accentColor } as CSSProperties}><div className="settings-preview__top"><span className="settings-preview__seal">LE</span><span>LegalEase draft</span></div><strong>{settings.companyName || 'Your workspace'}</strong><small>Signature colour in context</small><div className="settings-preview__line" /></div></div></div></section>
}
