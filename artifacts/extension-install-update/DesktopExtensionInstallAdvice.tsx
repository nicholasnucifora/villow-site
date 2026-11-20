import { useMemo } from 'react'
import { desktopExtensionReleases, releasedExtensionFor } from '../../lib/extension-browser-support.js'
import { currentExtensionBrowser } from '../hooks/useExtensionBrowserConfirmation'
import ExtensionStoreLink from './ExtensionStoreLink'

export default function DesktopExtensionInstallAdvice() {
  const environment = useMemo(() => currentExtensionBrowser(), [])
  const stores = desktopExtensionReleases().filter(release => release.status === 'available' && release.url && release.store)
  const onComputer = !['ios', 'android'].includes(environment.platform)
  // Presentation only: unknown browsers get links, without changing connection rules.
  const selected = onComputer && ['chromium', 'firefox'].includes(environment.browser)
    ? releasedExtensionFor(environment) : null
  return <section aria-label="Computer browsers" className="extension-install-column">
    {selected && <div className="extension-computer-stores">
      <ExtensionStoreLink store={selected.store!} href={selected.url!} compact />
    </div>}
    <div className="extension-store-alternatives">
      <span>{selected ? 'Also available for' : 'Available for'}</span>
      <ul aria-label="Extension browser listings">
        {stores.filter(store => store.name !== selected?.name).map(store => <li key={store.name}>
          <a href={store.url!} target="_blank" rel="noreferrer" aria-label={`Get Villow from ${store.name === 'Firefox' ? 'Firefox Add-ons' : store.name === 'Edge' ? 'Microsoft Edge Add-ons' : 'the Chrome Web Store'}`}>{store.name}</a>
        </li>)}
      </ul>
    </div>
  </section>
}
