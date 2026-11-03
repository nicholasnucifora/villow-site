const root = document.querySelector<HTMLElement>("[data-support]");
if (root) {
  const copy = JSON.parse(root.dataset.copy || "{}");
  const api = root.dataset.api;
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const checkout = get<HTMLFormElement>("[data-checkout]");
  const pay = get<HTMLButtonElement>("[data-pay]");
  const paymentStatus = get("[data-payment-status]");
  const removal = get<HTMLFormElement>("[data-removal]");
  const custom = get<HTMLInputElement>("#support-amount");
  let enabled = false;
  let token: string | null = null;
  const fragment = new URLSearchParams(location.hash.slice(1));
  if (fragment.has("remove")) {
    token = fragment.get("remove");
    history.replaceState(null, "", location.pathname + location.search);
    get("[data-confirm-panel]").hidden = false;
    get("[data-confirm-title]").focus();
  }
  const returned = new URLSearchParams(location.search).get("payment");
  const returnMessage = returned === "returned" ? copy.returned : returned === "cancelled" ? copy.cancelled : "";
  async function request(action: string, body?: Record<string, unknown>) {
    if (!api) throw new Error(copy.unavailable);
    const response = await fetch(`${api}/v1/projects/villow/${action}`, {
      method: body ? "POST" : "GET", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(20000),
      ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || copy.error);
    return data;
  }
  function changeAmount() {
    const data = new FormData(checkout);
    const once = data.get("kind") === "once";
    if (!once && data.get("amount") === "custom") get<HTMLInputElement>('input[name="amount"][value="10"]').checked = true;
    get("[data-custom-option]").hidden = !once;
    const isCustom = once && new FormData(checkout).get("amount") === "custom";
    get("[data-custom-input]").hidden = !isCustom;
    custom.disabled = !isCustom;
    custom.required = isCustom;
    root!.querySelectorAll<HTMLElement>("[data-per-month]").forEach(el => el.hidden = once);
  }
  checkout.addEventListener("change", changeAmount);
  checkout.addEventListener("submit", async event => {
    event.preventDefault();
    if (!enabled) return;
    const data = new FormData(checkout);
    const amount = data.get("amount") === "custom" ? custom.value : String(data.get("amount"));
    if (!/^\d{1,5}(\.\d{1,2})?$/.test(amount) || Number(amount) < 5 || Number(amount) > 10000) {
      paymentStatus.textContent = copy.invalidAmount; custom.focus(); return;
    }
    pay.disabled = true; paymentStatus.textContent = copy.working;
    try {
      const result = await request("checkout", { kind: data.get("kind"), amount });
      const target = new URL(result.url);
      if (!["https://checkout.stripe.com", "https://buy.stripe.com"].includes(target.origin)) throw new Error(copy.error);
      location.assign(target.href);
    } catch (error) { paymentStatus.textContent = error instanceof Error ? error.message : copy.error; pay.disabled = !enabled; }
  });
  async function loadFeed() {
    const status = get("[data-feed-status]");
    const list = get("[data-supporters]");
    try {
      if (!api) { status.textContent = copy.empty; return; }
      const { supporters } = await request("supporters");
      list.replaceChildren();
      for (const supporter of supporters) {
        const item = document.createElement("li");
        const name = document.createElement("strong");
        name.textContent = supporter.displayName || copy.anonymous;
        item.append(name);
        if (supporter.message) {
          const message = document.createElement("blockquote");
          message.textContent = supporter.message;
          item.append(message);
        }
        const meta = document.createElement("div"); meta.className = "supporter-meta";
        const badge = document.createElement("span");
        badge.textContent = supporter.kind === "once" ? copy.onceBadge : supporter.monthlyStatus === "active" ? copy.monthlyBadge : copy.previousBadge;
        const time = document.createElement("time"); time.dateTime = supporter.date;
        time.textContent = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(supporter.date));
        meta.append(badge, time); item.append(meta); list.append(item);
      }
      status.textContent = supporters.length ? "" : copy.empty;
    } catch { status.textContent = copy.feedError; }
  }
  removal.addEventListener("submit", async event => {
    event.preventDefault();
    const button = removal.querySelector("button")!;
    button.disabled = true;
    const status = get("[data-removal-status]"); status.textContent = copy.sending;
    try {
      const result = await request("removal-request", { email: new FormData(removal).get("email") });
      status.textContent = result.message;
      removal.reset();
    } catch (error) { status.textContent = error instanceof Error ? error.message : copy.error; }
    finally { button.disabled = !api; }
  });
  get("[data-confirm]").addEventListener("click", async () => {
    const button = get<HTMLButtonElement>("[data-confirm]"); button.disabled = true;
    const status = get("[data-confirm-status]"); status.textContent = copy.removing;
    try {
      const result = await request("removal-confirm", { token });
      status.textContent = result.message; token = null;
      await loadFeed();
    } catch (error) { status.textContent = error instanceof Error ? error.message : copy.error; button.disabled = false; }
  });
  get("[data-keep]").addEventListener("click", () => { token = null; get("[data-confirm-panel]").hidden = true; });
  changeAmount();
  void loadFeed();
  void (async () => {
    paymentStatus.textContent = returnMessage || copy.unavailable;
    if (!api) return;
    removal.querySelector("button")!.disabled = false;
    try {
      const config = await request("config");
      enabled = config.enabled === true;
      pay.disabled = !enabled;
      paymentStatus.textContent = [returnMessage, enabled ? config.mode === "test" ? copy.test : copy.ready : copy.unavailable].filter(Boolean).join(" ");
      if (config.portal && new URL(config.portal).origin === "https://billing.stripe.com") {
        const portal = get<HTMLAnchorElement>("[data-portal]"); portal.href = config.portal; portal.hidden = false;
        get("[data-portal-unavailable]").hidden = true;
      }
    } catch { paymentStatus.textContent = returnMessage || copy.error; }
  })();
}
