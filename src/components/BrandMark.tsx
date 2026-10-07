interface BrandMarkProps {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="LegalEase">
      <span className="brand-seal" aria-hidden="true">
        <span className="brand-seal__corner brand-seal__corner--top" />
        <span className="brand-seal__l">L</span>
        <span className="brand-seal__dot" />
        <span className="brand-seal__corner brand-seal__corner--bottom" />
      </span>
      {!compact && <span className="brand-wordmark">Legal<span>Ease</span></span>}
    </div>
  )
}
