// @vitest-environment happy-dom
import { act, createElement, Fragment } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { currentExtensionBrowser, saveExtensionBrowserConfirmation } from '../hooks/useExtensionBrowserConfirmation'
import { applyDesignPreview, isDesignPreviewPaused, readDesignPreview, toggleDesignPreviewPaused, writeDesignPreview } from '../utils/designPreview'
import ExtensionInstallLinks, { CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL, EDGE_EXTENSION_URL } from './ExtensionInstallLinks'
import type { ExtensionInstallation } from '../../lib/extension-device-setup'
import ExtensionSetup from './ExtensionSetup'
import ExtensionDailyUsage from './ExtensionDailyUsage'
import { apiService } from '../services/api'

const preference = vi.hoisted(() => ({ phone: null as 'ios' | 'android' | 'none' | null, save: vi.fn() }))
vi.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'user-a' } }) }))
vi.mock('../hooks/usePhonePlatform', () => ({ usePhonePlatform: () => ({ ...preference, ready: true, error: null, retry: vi.fn() }) }))
let host: HTMLDivElement
let root: Root
const windowsChrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0.0.0 Safari/537.36'
const androidChrome = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/140.0.0.0 Mobile Safari/537.36'
const iphoneChrome = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1'
const phoneSection = () => host.querySelector<HTMLElement>('[aria-labelledby="extension-phone-heading"]')!
const computerSection = () => host.querySelector<HTMLElement>('[aria-label="Computer installation guide"] .extension-install-column')!
function choose(value: 'ios' | 'android' | 'desktop') {
  const name = value === 'ios' ? 'iPhone / iPad' : value === 'android' ? 'Android' : 'Computer'
  act(() => [...host.querySelectorAll<HTMLButtonElement>('[aria-label="Installation device"] button')].find(button => button.textContent === name)!.click())
}
function chooseAndroidBrowser(label: string) {
  act(() => phoneSection().querySelector<HTMLButtonElement>('button[aria-label^="Android setup browser:"]')!.click())
  act(() => [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')].find(option => option.textContent === label)!.click())
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(windowsChrome)
  preference.phone = null
  preference.save.mockClear()
  localStorage.clear()
  saveExtensionBrowserConfirmation('user-a', null)
  writeDesignPreview([])
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
  if (isDesignPreviewPaused()) toggleDesignPreviewPaused()
  writeDesignPreview([])
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('extension installation advice', () => {
  it('puts the phone story after connection, initially collapsed, and retains its mounted example when toggled', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(iphoneChrome)
    vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
      matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }) as unknown as MediaQueryList)
    act(() => root.render(createElement(ExtensionInstallLinks, {
      connection: createElement('section', { id: 'connection-fixture' }, 'Connect to Villow'),
    })))
    const story = host.querySelector<HTMLDetailsElement>('.extension-story-disclosure')!
    const frame = story.querySelector('iframe')!
    const example = story.querySelector('[data-extension-story-demo]')!
    expect(story.previousElementSibling?.id).toBe('connection-fixture')
    expect(story.open).toBe(false)
    expect(story.querySelector('summary')!.hidden).toBe(false)
    expect(story.querySelector('figcaption')).toBeNull()
    act(() => story.querySelector('summary')!.click())
    expect(story.open).toBe(true)
    act(() => story.querySelector('summary')!.click())
    expect(story.open).toBe(false)
    act(() => story.querySelector('summary')!.click())
    expect(story.querySelector('iframe')).toBe(frame)
    expect(story.querySelector('[data-extension-story-demo]')).toBe(example)
    expect(preference.save).not.toHaveBeenCalled()
  })
  it('keeps the desktop story open when browsing phone installation advice', () => {
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const story = host.querySelector<HTMLDetailsElement>('.extension-story-disclosure')!
    expect(story.open).toBe(true)
    expect(story.querySelector('summary')!.hidden).toBe(true)
    choose('ios')
    expect(story.open).toBe(true)
    expect(story.querySelector('figcaption')).not.toBeNull()
  })
  it.each([windowsChrome, androidChrome, iphoneChrome])('shows all three device choices and one matching guide for %s', userAgent => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    expect([...host.querySelectorAll('[aria-label="Installation device"] button')].map(button => button.textContent)).toEqual(['Computer', 'iPhone / iPad', 'Android'])
    expect(host.querySelectorAll('[aria-label="Installation device"] [aria-pressed="true"]')).toHaveLength(1)
    expect(host.querySelectorAll('.extension-device-content .extension-install-column')).toHaveLength(1)
    expect(host.querySelector('[aria-label="Installation device"] [aria-pressed="true"]')!.textContent).toBe(userAgent === windowsChrome ? 'Computer' : userAgent === androidChrome ? 'Android' : 'iPhone / iPad')
    expect(preference.save).not.toHaveBeenCalled()
  })
  it('selects this desktop even with a saved phone preference, then lets all devices be selected', () => {
    preference.phone = 'ios'
    act(() => root.render(createElement(ExtensionInstallLinks)))
    expect(computerSection().querySelectorAll('.extension-store-link')).toHaveLength(1)
    choose('ios')
    expect(phoneSection().textContent).toContain('Download Orion')
    expect(phoneSection().querySelectorAll('.extension-install-instructions > li')).toHaveLength(4)
    expect(preference.save).toHaveBeenCalledWith('ios')
    expect(computerSection()).toBeNull()
    choose('android')
    expect(phoneSection().textContent).toContain('Firefox (recommended)')
    expect(preference.save).toHaveBeenCalledWith('android')
    choose('desktop')
    expect(computerSection().querySelectorAll('.extension-store-link')).toHaveLength(1)
    expect(phoneSection()).toBeNull()
  })
  it('switches the story input cue and real Home viewport with the selected installation device', () => {
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const checkStory = (mobile: boolean) => {
      const figure = host.querySelector('.extension-save-story')!
      const demo = figure.querySelector('[data-extension-story-demo]')!.shadowRoot!
      expect(figure.getAttribute('data-story-device')).toBe(mobile ? 'mobile' : 'desktop')
      expect(demo.querySelector('.villow-demo__masthead .villow-demo__teaching-pill')?.textContent).toBe('Choose videos')
      expect(demo.querySelector('.villow-demo__instruction')).toBeNull()
      expect(demo.querySelector('.villow-demo')?.getAttribute('data-device')).toBe(mobile ? 'mobile' : 'desktop')
      const frame = figure.querySelector('iframe')!
      expect(new URLSearchParams(frame.getAttribute('src')!.split('#')[1]).get('device')).toBe(mobile ? 'phone' : 'desktop')
      expect(frame.style.width).toBe(mobile ? '390px' : '1190px')
      expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
    }
    checkStory(false)
    choose('ios')
    checkStory(true)
    choose('android')
    checkStory(true)
    choose('desktop')
    checkStory(false)
  })
  it.each([
    [windowsChrome, CHROME_EXTENSION_URL, 'chrome-web-store'],
    [windowsChrome + ' Edg/140.0.0.0', EDGE_EXTENSION_URL, 'edge-add-ons'],
    ['Mozilla/5.0 Firefox/140.0', FIREFOX_EXTENSION_URL, 'firefox-add-ons'],
    [windowsChrome + ' OPR/100.0', CHROME_EXTENSION_URL, 'chrome-web-store'],
  ])('shows one detected badge with visible text alternatives: %s', (userAgent, selectedURL, image) => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const section = computerSection()
    const badges = [...section.querySelectorAll<HTMLAnchorElement>('.extension-store-link')]
    expect(badges).toHaveLength(1)
    expect(badges[0].href).toBe(selectedURL)
    expect(badges[0].querySelector('img')!.getAttribute('src')).toBe(`/store-badges/${image}.png`)
    const alternatives = [...section.querySelectorAll<HTMLAnchorElement>('.extension-store-alternatives a')]
    expect(alternatives.map(link => link.href).sort()).toEqual([CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL, EDGE_EXTENSION_URL].filter(url => url !== selectedURL).sort())
    expect(alternatives.every(link => !link.closest('[hidden]') && !link.querySelector('img'))).toBe(true)
    expect(section.querySelector('button')).toBeNull()
    expect(section.textContent).toContain('Also available for')
    expect(section.querySelector('.extension-firefox-label')).toBeNull()
    expect(preference.save).not.toHaveBeenCalled()
  })
  it.each(['Unknown desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Version/18.0 Safari/605.1.15'])('offers only text links when no installable browser is detected: %s', userAgent => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const section = computerSection()
    expect(section.querySelector('.extension-store-link')).toBeNull()
    expect(section.querySelector('button')).toBeNull()
    const links = [...section.querySelectorAll<HTMLAnchorElement>('a')]
    expect(links.map(link => link.href).sort()).toEqual([CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL, EDGE_EXTENSION_URL].sort())
    expect(links.every(link => !link.closest('[hidden]') && !link.querySelector('img'))).toBe(true)
    expect(section.textContent).toContain('Available for')
    expect(preference.save).not.toHaveBeenCalled()
  })
  it('keeps desktop available on an actual phone without sending desktop links to mobile browsers', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    preference.phone = 'ios'
    act(() => root.render(createElement(ExtensionInstallLinks)))
    expect(phoneSection().textContent).toContain('Install on Android')
    choose('desktop')
    expect(computerSection().querySelector('.extension-store-link')).toBeNull()
    const stores = [...computerSection().querySelectorAll<HTMLAnchorElement>('.extension-store-alternatives a')]
    expect(stores.map(store => store.href)).toEqual([CHROME_EXTENSION_URL, FIREFOX_EXTENSION_URL, EDGE_EXTENSION_URL])
    expect(stores.every(store => store.target === '_blank')).toBe(true)
    expect(host.textContent).toContain('Finish setup in Villow on your computer.')
    expect(host.querySelector('a[href="#extension-connect"]')).toBeNull()
    choose('ios')
    expect(phoneSection().querySelector('a[href^="orion:"]')).toBeNull()
    choose('android')
    expect(host.querySelector('a[href="#extension-connect"]')).toBeNull()
  })
  it('offers numbered Orion steps with a real iPhone handoff', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(iphoneChrome)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const store = phoneSection().querySelector<HTMLAnchorElement>('a[aria-label*="Chrome Web Store"]')!
    expect(store.getAttribute('href')).toBe('orion://open-url?url=' + encodeURIComponent(CHROME_EXTENSION_URL))
    expect(store.hasAttribute('target')).toBe(false)
    expect(store.getAttribute('aria-label')).toContain('Orion on iPhone or iPad')
    expect(host.querySelector('a[href="#extension-connect"]')).toBeNull()
    expect(phoneSection().textContent).toContain('The extension won’t work in the YouTube app')
  })
  it('hands Firefox installation to Android only for the actual Android guide', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    const badge = phoneSection().querySelector<HTMLAnchorElement>('a[aria-label*="Firefox Add-ons"]')!
    expect(badge.getAttribute('href')).toContain('intent://addons.mozilla.org/en-US/firefox/addon/villow/#Intent;scheme=https;package=org.mozilla.firefox;')
    expect(badge.hasAttribute('target')).toBe(false)
    choose('desktop')
    expect(computerSection().querySelector<HTMLAnchorElement>('a[aria-label*="Firefox Add-ons"]')!.href).toBe(FIREFOX_EXTENSION_URL)
  })
  it.each(['Vivaldi', 'Quetta', 'Lemur'])('preserves untested %s phone advice and search recovery', name => {
    act(() => root.render(createElement(ExtensionInstallLinks)))
    choose('android')
    preference.save.mockClear()
    chooseAndroidBrowser(name + ' (Villow untested)')
    expect(phoneSection().textContent).toContain('Villow hasn’t been tested in ' + name + ' yet')
    expect(phoneSection().textContent).toContain('extension manager')
    expect(phoneSection().textContent).toContain('search for Villow')
    if (name === 'Vivaldi') expect(phoneSection().textContent).toContain('Vivaldi 8.2 or newer')
    expect(phoneSection().querySelector<HTMLAnchorElement>('a[href="' + CHROME_EXTENSION_URL + '"]')!.target).toBe('_blank')
    expect(phoneSection().textContent).not.toContain('Create connect link')
    expect(preference.save).not.toHaveBeenCalled()
  })
  it('copies an alternative browser listing and exposes its link if copying fails', async () => {
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    act(() => root.render(createElement(ExtensionInstallLinks)))
    choose('android')
    chooseAndroidBrowser('Quetta (Villow untested)')
    const copyButton = () => [...phoneSection().querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'Copy extension link')!
    await act(async () => copyButton().click())
    expect(copy).toHaveBeenLastCalledWith(CHROME_EXTENSION_URL)
    copy.mockRejectedValue(new Error('Clipboard unavailable'))
    await act(async () => copyButton().click())
    expect(phoneSection().querySelector<HTMLInputElement>('input[aria-label="Chrome Web Store extension link"]')!.value).toBe(CHROME_EXTENSION_URL)
    chooseAndroidBrowser('Lemur (Villow untested)')
    expect(phoneSection().querySelector('input[aria-label="Chrome Web Store extension link"]')).toBeNull()
  })
  it('previews advice through pause and reset without saving or changing the actual device', () => {
    act(() => root.render(createElement(ExtensionInstallLinks)))
    act(() => writeDesignPreview(['usage-history-7', 'extension-phone-ios']))
    expect(host.textContent).toContain('Apple phone advice preview.')
    expect(phoneSection().querySelector('a[href^="orion:"]')).toBeNull()
    expect(currentExtensionBrowser().platform).toBe('windows')
    act(() => toggleDesignPreviewPaused())
    expect(computerSection()).not.toBeNull()
    act(() => toggleDesignPreviewPaused())
    act(() => host.querySelector<HTMLButtonElement>('.extension-advice-preview button')!.click())
    expect(readDesignPreview()).toEqual(['usage-history-7'])
    act(() => { applyDesignPreview(['extension-phone-ios']); window.dispatchEvent(new Event('villow-design-preview-changed')) })
    expect(phoneSection().querySelector('[aria-label="Android installation"]')).toBeNull()
    expect(preference.save).not.toHaveBeenCalled()
  })
})

describe('extension page disclosures', () => {
  let setupClient: QueryClient
  function renderSetup(collapsed = false, installations: ExtensionInstallation[] = [], tokens: Awaited<ReturnType<typeof apiService.getExtensionTokens>>['tokens'] = []) {
    const client = new QueryClient()
    setupClient = client
    client.setQueryData(['extensionHomeState', 'user-a'], { tokens, homeState, devices: null, day: null, setup: { devices: [], installations } })
    const router = createMemoryRouter([{ path: '*', element: createElement(ExtensionSetup, null,
      createElement(Fragment, null, createElement('p', null, 'Daily limits sample'),
        createElement(ExtensionDailyUsage, { day: { date: '2026-11-01', timezone: 'UTC', updatedAt: null, sources: [],
          totals: { activeSeconds: 0, recommendationsSeen: 0, saves: 0, savedDurationSeconds: 0, savesUnknownDuration: 0 } }, config: homeState }))) }],
      { initialEntries: [{ pathname: '/extension', state: { collapseExtensionSetup: collapsed } }] })
    act(() => root.render(createElement(QueryClientProvider, { client }, createElement(RouterProvider, { router }))))
    return router
  }
  const guide = () => host.querySelector<HTMLDetailsElement>('section[aria-label="Set up the browser extension"] > details')!
  const browser = () => host.querySelector<HTMLDivElement>('#extension-connect')!
  const homeState = { saveLimitPerDay: 5, savesUsedToday: 0, recommendationLimitPerDay: 200,
    recommendationsSeenToday: 0, timeLimitSecondsPerDay: 1800, timeSpentSecondsToday: 0,
    youTubeBlocked: false, updatedAt: '2026-10-11T00:00:00Z' }
  it('keeps expanded setup, device advice and a pending browser removal through usage editor links and Back', async () => {
    const token = { id: 'browser-link', label: null, createdAt: '2026-10-08T00:00:00Z', lastUsedAt: '2026-10-12T00:00:00Z',
      client: 'Chrome', extensionVersion: null, limits: { recommendationsPerDay: null, savesPerDay: null, timeSecondsPerDay: null, definitionVersion: null, reportedAt: null } }
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: token.id, platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report], [token])
    act(() => guide().querySelector('summary')!.click())
    choose('ios')
    const setupBefore = guide()
    const connections = host.querySelector<HTMLDetailsElement>('.extension-connections-disclosure')!
    act(() => connections.querySelector('summary')!.click())
    act(() => connections.querySelector<HTMLButtonElement>('[aria-label="Remove Chrome on Windows"]')!.click())
    for (const target of ['minutes', 'recommendations', 'saves']) {
      await act(async () => host.querySelector<HTMLAnchorElement>(`a[href="/extension#extension-limit-${target}"]`)!.click())
      expect(router.state.location.state.extensionSettingsNavigation).toBe(true)
      expect(guide()).toBe(setupBefore)
      expect(guide().open).toBe(true)
      expect(connections.open).toBe(true)
      expect(host.querySelector('[aria-label="Installation device"] [aria-pressed="true"]')?.textContent).toBe('iPhone / iPad')
      expect([...connections.querySelectorAll('button')].some(button => button.textContent === 'Keep')).toBe(true)
    }
    await act(async () => { await router.navigate(-3) })
    expect(guide()).toBe(setupBefore)
    expect(guide().open).toBe(true)
    expect(connections.open).toBe(true)
    router.dispose()
  })
  it('keeps Home-warning setup closed while opening a usage editor', async () => {
    const router = renderSetup(true)
    const before = guide()
    await act(async () => host.querySelector<HTMLAnchorElement>('a[href="/extension#extension-limit-recommendations"]')!.click())
    expect(guide()).toBe(before)
    expect(guide().open).toBe(false)
    router.dispose()
  })
  it.each([
    { name: 'unreported settings', state: null, conflict: false, destination: '/extension?from=youtube' },
    { name: 'blocking', state: { ...homeState, youTubeBlocked: true }, conflict: false, destination: '/extension?from=youtube' },
    { name: 'a reached limit', state: { ...homeState, savesUsedToday: 5 }, conflict: false, destination: '/extension?from=youtube' },
    { name: 'conflicting changes', state: homeState, conflict: true, destination: '/extension?from=youtube#extension-settings-conflict' },
  ])('routes the compact YouTube action to guidance for $name', async ({ state, conflict, destination }) => {
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: 'live-link', platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report])
    await act(async () => {
      setupClient.setQueryData(['extensionHomeState', 'user-a'], { tokens: [], homeState: state, devices: { hasConflict: conflict }, day: null, setup: { devices: [], installations: [report] } })
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    const action = host.querySelector<HTMLAnchorElement>('.extension-connected-status .extension-connected-link')!
    expect(action.getAttribute('href')).toBe(destination)
    expect(action.getAttribute('target')).toBeNull()
    expect(browser().querySelector('.extension-connected-link')?.getAttribute('href')).toBe(destination)
    expect(browser().querySelector('a[href="https://www.youtube.com/"]')).toBeNull()
    await act(async () => { action.click() })
    expect(`${router.state.location.pathname}${router.state.location.search}${router.state.location.hash}`).toBe(destination)
    router.dispose()
  })
  it.each([
    { userAgent: windowsChrome, platform: 'windows' as const, family: 'chromium' as const, client: 'Chrome', href: 'https://www.youtube.com/' },
    { userAgent: androidChrome, platform: 'android' as const, family: 'firefox' as const, client: 'Firefox', href: 'intent://www.youtube.com/#Intent;scheme=https;package=org.mozilla.firefox;S.browser_fallback_url=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Finstall-firefox-android-device-using-google-play;end' },
    { userAgent: iphoneChrome, platform: 'ios' as const, family: 'safari' as const, client: 'Browser', href: 'orion://open-url?url=https%3A%2F%2Fwww.youtube.com%2F' },
  ])('preserves the compact ready handoff for $platform', async ({ userAgent, platform, family, client, href }) => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
    const report: ExtensionInstallation = { source: 'ready-install', tokenId: 'live-link', platform, browser: family, client, lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report])
    await act(async () => {
      setupClient.setQueryData(['extensionHomeState', 'user-a'], { tokens: [], homeState, devices: { hasConflict: false }, day: null, setup: { devices: [], installations: [report] } })
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    const action = host.querySelector('.extension-connected-status .extension-connected-link')!
    expect(action.getAttribute('href')).toBe(href)
    expect(action.getAttribute('data-tooltip')).toBe(`Open YouTube in ${platform === 'ios' ? 'Orion' : client}`)
    expect(action.querySelector('svg')).not.toBeNull()
    expect(browser().querySelector('.extension-connected-link')?.getAttribute('href')).toBe(href)
    expect(host.querySelector('.extension-connection-actions')).toBeNull()
    router.dispose()
  })
  it('automatically collapses ready installation on each visit while allowing manual reopening', async () => {
    localStorage.setItem('villow:extension-guide:user-a:install', 'open')
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: 'live-link', platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report])
    expect(guide().open).toBe(false)
    act(() => guide().querySelector('summary')!.click())
    expect(guide().open).toBe(true)
    await act(async () => { await router.navigate('/extension') })
    expect(guide().open).toBe(false)
    router.dispose()
  })
  it('becomes ready as soon as the first connected extension reports after opening YouTube', async () => {
    const router = renderSetup()
    expect(guide().open).toBe(true)
    act(() => browser().querySelector<HTMLAnchorElement>('a[href="https://www.youtube.com/"]')!.click())
    expect(browser().textContent).toContain('Waiting for Chrome on Windows to check in')
    expect(browser().textContent).not.toContain('Yes, it worked')
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: 'live-link', platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: new Date().toISOString() }
    await act(async () => {
      setupClient.setQueryData(['extensionHomeState', 'user-a'], { tokens: [], homeState: null, devices: null, day: null, setup: { devices: [], installations: [report] } })
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    expect(browser().textContent).toContain('Chrome is connected!')
    expect(guide().open).toBe(false)
    expect(browser().textContent).not.toContain('Waiting for Chrome')
    expect(localStorage.getItem('villow:extension-browser:user-a')).toBeNull()
    router.dispose()
  })
  it('keeps explicitly opened setup and its device selection through new check-ins until navigation', async () => {
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: 'live-link', platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report])
    act(() => guide().querySelector('summary')!.click())
    choose('android')
    await act(async () => {
      setupClient.setQueryData(['extensionHomeState', 'user-a'], { tokens: [], homeState: null, devices: null, day: null, setup: { devices: [], installations: [report,
        { ...report, source: 'android-install', platform: 'android', browser: 'firefox', client: 'Firefox' },
      ] } })
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    expect(guide().open).toBe(true)
    expect(host.querySelector('[aria-label="Installation device"] [aria-pressed="true"]')?.textContent).toBe('Android')
    await act(async () => { await router.navigate('/extension') })
    expect(guide().open).toBe(false)
    router.dispose()
  })
  it('keeps the optional Android shortcut choice usable for the visit when site storage is blocked', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked') })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Storage blocked') })
    renderSetup(false, [{ source: 'android-firefox', tokenId: 'phone-link', platform: 'android', browser: 'firefox', client: 'Firefox', lastSeenAt: new Date().toISOString() }])
    expect(browser().textContent).toContain('Firefox is connected!')
    act(() => [...browser().querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'I’ll use my Firefox shortcut')!.click())
    expect(browser().textContent).toContain('Using your Firefox YouTube shortcut')
    expect(browser().textContent).not.toContain('Allow site storage')
    act(() => [...browser().querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'Use the browser link instead')!.click())
    expect(browser().textContent).toContain('Firefox is connected!')
  })
  it('makes Orion ready from a recent report without confirmation or site storage', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(iphoneChrome)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked') })
    const report: ExtensionInstallation = { source: 'orion-install', tokenId: 'phone-link', platform: 'ios', browser: 'safari', client: 'Browser', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report])
    expect(browser().textContent).toContain('Orion is connected!')
    const link = browser().querySelector<HTMLAnchorElement>('a[href^="orion://open-url"]')!
    expect(link.getAttribute('href')).toBe('orion://open-url?url=https%3A%2F%2Fwww.youtube.com%2F')
    act(() => link.click())
    expect(browser().textContent).not.toContain('Yes, it worked')
    expect(browser().textContent).not.toContain('Allow site storage')
    expect(browser().textContent).not.toContain('Please confirm')
    expect(browser().querySelector('details')).toBeNull()
    router.dispose()
  })
  it('collapses both setup sections from a Home warning, then expands normal navigation', async () => {
    const router = renderSetup(true)
    expect(guide().open).toBe(false)
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(false)
    expect(host.querySelector('section[aria-label="Daily limits and extension usage"]')!.textContent).toContain('Daily limits sample')
    expect(host.querySelector('footer')).toBeNull()
    expect(host.querySelector('#extension-install')!.textContent).not.toContain('Firefox is a trademark')
    await act(async () => { await router.navigate('/extension') })
    expect(guide().open).toBe(true)
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(true)
  })
  it('opens independent browser management while setup is closed and keeps pending removal', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0')
    const token = {
      id: 'connected-link', label: null, createdAt: '2026-10-08T00:00:00Z', lastUsedAt: '2026-10-12T00:00:00Z',
      client: 'Firefox', extensionVersion: null,
      limits: { recommendationsPerDay: null, savesPerDay: null, timeSecondsPerDay: null, definitionVersion: null, reportedAt: null },
    }
    const report: ExtensionInstallation = { source: 'firefox-install', tokenId: token.id, platform: 'windows', browser: 'firefox', client: 'Firefox', lastSeenAt: new Date().toISOString() }
    const router = renderSetup(false, [report], [token])
    const management = host.querySelector('[aria-label="Connected browsers"]')!
    const connections = management.closest<HTMLDetailsElement>('details')!
    expect(guide().open).toBe(false)
    expect(management.closest('.extension-setup-flow')).toBeNull()
    expect(connections).not.toBe(guide())
    expect(connections.open).toBe(false)
    expect(connections.querySelector('summary')!.textContent).toContain('1 connected browser')
    const limits = host.querySelector('[aria-label="Daily limits and extension usage"]')!
    expect(limits.closest('details')).toBeNull()
    expect(limits.previousElementSibling!.contains(guide())).toBe(true)
    act(() => connections.querySelector('summary')!.click())
    expect(connections.open).toBe(true)
    expect(guide().open).toBe(false)
    expect(management.textContent).toContain('Last heard from')
    const createLink = [...host.querySelectorAll('button')].find(button => button.textContent === 'Create connect link')!
    expect(createLink).toBeDefined()
    expect(connections.contains(createLink)).toBe(false)
    act(() => management.querySelector<HTMLButtonElement>('button[aria-label^="Remove"]')!.click())
    expect(management.textContent).toContain('Its extension stops saving')
    act(() => guide().querySelector('summary')!.click())
    act(() => guide().querySelector('summary')!.click())
    expect(guide().open).toBe(false)
    expect(connections.open).toBe(true)
    act(() => connections.querySelector('summary')!.click())
    act(() => connections.querySelector('summary')!.click())
    expect(host.querySelector('[aria-label="Connected browsers"]')).toBe(management)
    expect(management.textContent).toContain('Its extension stops saving')
    expect(host.querySelector('footer')).toBeNull()
    router.dispose()
  })
  it('includes stale connected browsers in management without counting unused links', () => {
    const report: ExtensionInstallation = { source: 'chrome-install', tokenId: 'used-link', platform: 'windows', browser: 'chromium', client: 'Chrome', lastSeenAt: '2020-01-01T00:00:00Z' }
    const token = { id: 'used-link', label: null, createdAt: '2020-01-01T00:00:00Z', lastUsedAt: '2020-01-01T00:00:00Z', client: 'Chrome', extensionVersion: null,
      limits: { recommendationsPerDay: null, savesPerDay: null, timeSecondsPerDay: null, definitionVersion: null, reportedAt: null } }
    const router = renderSetup(false, [report], [token, { ...token, id: 'unused-link', lastUsedAt: null, client: null }])
    const management = host.querySelector<HTMLDetailsElement>('.extension-connections-disclosure')!
    expect(management.querySelector('summary')?.textContent).toContain('1 connected browser')
    expect(management.textContent).toContain('Unused link')
    expect(host.querySelector('.extension-connected-status')).toBeNull()
    expect(guide().open).toBe(true)
    router.dispose()
  })
  it('remembers the combined disclosure and reopens both stages together', async () => {
    const router = renderSetup()
    act(() => guide().querySelector('summary')!.click())
    await act(async () => { await router.navigate('/extension') })
    expect(guide().open).toBe(false)
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(false)
    act(() => guide().querySelector('summary')!.click())
    const next = [...host.querySelectorAll<HTMLAnchorElement>('a[href="#extension-connect"]')]
    expect(next).toHaveLength(0)
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(true)
  })
  it('opens install advice for a Design preview while keeping real connection checks intact', () => {
    renderSetup(true)
    act(() => { writeDesignPreview(['extension-phone-ios']) })
    expect(guide().open).toBe(true)
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(true)
    expect(host.textContent).toContain('Apple phone advice preview.')
    expect(preference.save).not.toHaveBeenCalled()
  })
  it('copies addresses for a supported browser without launching YouTube from Safari', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X) Version/18.0 Safari/605.1.15')
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    renderSetup()
    const copyButton = (text: string) => [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === text)!
    await act(async () => copyButton('Copy YouTube address').click())
    expect(copy).toHaveBeenLastCalledWith('https://www.youtube.com/')
    expect(browser().textContent).toContain('Paste it into Chrome, Firefox or Edge')
    await act(async () => copyButton('Copy Villow setup address').click())
    expect(copy).toHaveBeenLastCalledWith(`${window.location.origin}/extension`)
    expect(browser().querySelector('a[href*="youtube.com"]')).toBeNull()
    copy.mockRejectedValue(new Error('Clipboard unavailable'))
    await act(async () => copyButton('Copy YouTube address').click())
    expect(browser().querySelector<HTMLInputElement>('input[aria-label="YouTube address"]')!.value).toBe('https://www.youtube.com/')
  })
  it('makes desktop Edge ready without an extra troubleshooting disclosure', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(`${windowsChrome} Edg/140.0.0.0`)
    const report: ExtensionInstallation = { source: 'edge-install', tokenId: 'edge-link', platform: 'windows', browser: 'chromium', client: 'Edge', lastSeenAt: new Date().toISOString() }
    renderSetup(false, [report])
    expect(browser().textContent).toContain('Edge is connected!')
    act(() => browser().querySelector<HTMLAnchorElement>('a[href="https://www.youtube.com/"]')!.click())
    expect(browser().textContent).not.toContain('Yes, it worked')
    expect(localStorage.getItem('villow:extension-browser:user-a')).toBeNull()
    expect(browser().querySelector('details')).toBeNull()
    expect(browser().textContent).not.toContain('Link not opening correctly?')
  })
  it('opens phone connection steps from the Android installation card', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    renderSetup(true)
    act(() => guide().querySelector('summary')!.click())
    expect(browser().closest<HTMLDetailsElement>('.extension-install-step')!.open).toBe(true)
    expect(browser().textContent).toContain('Set up Firefox on Android')
    const launch = browser().querySelector<HTMLAnchorElement>('a[href^="intent://www.youtube.com/"]')!
    expect(launch.textContent).toBe('Open YouTube in Firefox')
    expect(host.querySelector('[aria-label="Installation device"]')?.textContent).toContain('Computer')
  })
  it.each([androidChrome, 'Mozilla/5.0 (Android 15; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0'])(
    'shows Android app-link recovery after a failed test from %s', userAgent => {
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
      const report: ExtensionInstallation = { source: 'phone-firefox', tokenId: 'phone-link', platform: 'android', browser: 'firefox', client: 'Firefox', lastSeenAt: new Date().toISOString() }
      const router = renderSetup(false, [report])
      act(() => browser().querySelector<HTMLAnchorElement>('a[href*="www.youtube.com/"]')!.click())
      expect(browser().textContent).toContain('turn off Open supported links')
      expect(browser().textContent).toContain('turn off Open links in apps')
      expect(browser().textContent).toContain('youtube.com stays in Firefox')
      expect(localStorage.getItem('villow:extension-browser:user-a')).toBeNull()
      router.dispose()
    })
  it('lets a real Android visit try an alternative with the existing account connect flow while keeping Firefox launch checks', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    const copy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const token = {
      id: 'test-link', label: null, createdAt: '2026-10-08T00:00:00Z', lastUsedAt: null,
      client: null, extensionVersion: null,
      limits: { recommendationsPerDay: null, savesPerDay: null, timeSecondsPerDay: null, definitionVersion: null, reportedAt: null },
    }
    const create = vi.spyOn(apiService, 'createExtensionToken').mockResolvedValue({ token, tokens: [token], connectLink: 'https://example.test/connect#test-only-key' })
    renderSetup()
    chooseAndroidBrowser('Quetta (Villow untested)')
    expect(phoneSection().querySelector('a[href="#extension-connect"]')).toBeNull()
    expect(browser().textContent).toContain('Set up Firefox on Android')
    const connect = [...phoneSection().querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'Create connect link')!
    await act(async () => connect.click())
    expect(create).toHaveBeenCalledOnce()
    expect(copy).toHaveBeenLastCalledWith('https://example.test/connect#test-only-key')
    expect(phoneSection().textContent).toContain('Your connect link')
    const copyButton = () => phoneSection().querySelector<HTMLButtonElement>('button[aria-label="Copy connect link"]')!
    expect(copyButton().textContent).toContain('Copied')
    expect(copyButton().textContent).toContain('https://example.test/connect#test-only-key')
    expect(phoneSection().querySelector('.extension-connect-link-actions')).toBeNull()
    await act(async () => {
      copyButton().querySelector('span')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }))
      copyButton().dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    })
    expect(copy).toHaveBeenCalledTimes(2)
    expect(copy).toHaveBeenLastCalledWith('https://example.test/connect#test-only-key')
    copy.mockRejectedValueOnce(new Error('Clipboard unavailable'))
    await act(async () => copyButton().click())
    expect(copyButton().textContent).toBe('Copy')
    const manualLink = phoneSection().querySelector<HTMLInputElement>('input[aria-label="connect link"]')!
    expect(manualLink.value).toBe('https://example.test/connect#test-only-key')
    expect(document.activeElement).toBe(manualLink)
    expect(manualLink.selectionEnd! - manualLink.selectionStart!).toBe(manualLink.value.length)
    expect(phoneSection().textContent).toContain('Select the link and copy it yourself')
    expect(localStorage.getItem('villow:extension-browser:user-a')).toBeNull()
    expect(browser().querySelector<HTMLAnchorElement>('a[href^="intent://www.youtube.com/"]')!.href).toContain('package=org.mozilla.firefox;')
    chooseAndroidBrowser('Firefox (recommended)')
    expect(host.querySelector('a[href="#extension-connect"]')).toBeNull()
  })
  it('does not create connect links from a phone Design preview on an actual Android visit', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(androidChrome)
    renderSetup()
    act(() => writeDesignPreview(['extension-phone-android']))
    chooseAndroidBrowser('Lemur (Villow untested)')
    expect(phoneSection().textContent).not.toContain('Create connect link')
    expect(phoneSection().textContent).toContain('Finish setup in Villow on your phone')
    expect(localStorage.getItem('villow:extension-browser:user-a')).toBeNull()
    expect(preference.save).not.toHaveBeenCalled()
  })
})
