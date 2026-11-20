import '../styles/extension-store-links.css'

const OFFICIAL_BADGES = {
  chrome: { name: 'Chrome Web Store', file: 'chrome-web-store', alt: 'Available in the Chrome Web Store', width: 206 },
  firefox: { name: 'Firefox Add-ons', file: 'firefox-add-ons', alt: 'Get the add-on', width: 172 },
  edge: { name: 'Microsoft Edge Add-ons', file: 'edge-add-ons', alt: 'Get it from Microsoft Edge', width: 226 },
}

export default function ExtensionStoreLink({ store, href, handoff = false, phone = false, phonePlatform, compact = false }: {
  store: 'chrome' | 'firefox' | 'edge'; href: string; handoff?: boolean; phone?: boolean; phonePlatform?: 'ios' | 'android'; compact?: boolean
}) {
  const badge = OFFICIAL_BADGES[store]
  const name = badge.name
  const content = <img src={`/store-badges/${badge.file}.png`} alt={badge.alt}
    className="h-auto max-w-full shrink-0" style={{ width: badge.width * (compact ? 0.75 : 1) }} />
  const className = `extension-store-link ${compact ? 'extension-store-link-compact' : ''}`
  return <a href={href} target={handoff ? undefined : '_blank'} rel="noreferrer"
    className={className} aria-label={`Get Villow from ${name === 'Chrome Web Store' ? 'the ' : ''}${name} for ${phonePlatform === 'ios' ? 'Orion on iPhone or iPad' : phone || phonePlatform === 'android' ? 'Android' : 'your computer'}`}>
    {content}
  </a>
}
