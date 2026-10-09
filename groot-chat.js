const launcher = document.getElementById("groot-launcher");
const panel = document.getElementById("groot-panel");
const closeButton = document.getElementById("groot-close");
const form = document.getElementById("groot-form");
const input = document.getElementById("groot-input");
const sendButton = document.getElementById("groot-send");
const messagesView = document.getElementById("groot-messages");
const modeLabel = document.getElementById("groot-mode");
const footnote = document.getElementById("groot-footnote");
const conversation = [];
const API_BASE = (document.documentElement.dataset.grootApiBase || "").replace(/\/+$/, "");
const DEFAULT_PLACEHOLDER = input.placeholder;
const allowedOfficialHosts = [
  "docs.aws.amazon.com", "kubernetes.io", "developer.hashicorp.com", "docs.docker.com",
  "docs.gitlab.com", "grafana.com", "prometheus.io", "opentelemetry.io",
  "learn.microsoft.com", "docs.github.com", "datatracker.ietf.org", "rfc-editor.org", "help.zoho.com",
];
const QUESTION_LIMIT = 3;
let currentMode = "demo";
let questionsRemaining = QUESTION_LIMIT;
let quotaResetAt = null;
let quotaBlocked = false;
let busy = false;

function trackChatEvent(eventName) {
  try {
    if (window.siteAnalytics && typeof window.siteAnalytics.track === "function") {
      window.siteAnalytics.track(eventName);
    }
  } catch (_) {
    // Analytics must not interfere with chat.
  }
}

function safeOfficialSource(source) {
  try {
    const url = new URL(source.url);
    const hostname = url.hostname.toLowerCase();
    const allowed = url.protocol === "https:" && !url.username && !url.password
      && allowedOfficialHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
    if (!allowed) return null;
    return { url: url.href, title: String(source.title || hostname).slice(0, 120) };
  } catch {
    return null;
  }
}

function scrollMessages() {
  messagesView.scrollTop = messagesView.scrollHeight;
}

function appendMessage(text, role, sources = [], notice = "") {
  const bubble = document.createElement("div");
  bubble.className = `groot-message ${role === "user" ? "groot-user-message" : "groot-assistant-message"}`;
  bubble.textContent = text;
  messagesView.append(bubble);

  const safeSources = sources.map(safeOfficialSource).filter(Boolean).slice(0, 3);
  if (safeSources.length) {
    const sourceList = document.createElement("div");
    sourceList.className = "groot-sources";
    const label = document.createElement("span");
    label.className = "groot-sources-label";
    label.textContent = "Official docs";
    sourceList.append(label);
    for (const source of safeSources) {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.title;
      sourceList.append(link);
    }
    messagesView.append(sourceList);
  }
  if (notice) {
    const noticeElement = document.createElement("div");
    noticeElement.className = "groot-limit-note";
    noticeElement.textContent = notice;
    messagesView.append(noticeElement);
  }
  if (role !== "user") {
    const creditNote = document.createElement("div");
    creditNote.className = "groot-credit-note";
    creditNote.textContent = "Each live answer uses paid API credits (AI tokens). Please use Groot responsibly.";
    messagesView.append(creditNote);
  }
  scrollMessages();
  return bubble;
}

function updateFootnote() {
  if (quotaBlocked) {
    const reset = quotaResetAt ? new Date(quotaResetAt).toLocaleString() : "after 24 hours";
    footnote.textContent = `You’ve used all 3 questions for this IP. The limit resets at ${reset}.`;
    return;
  }
  const usage = `${questionsRemaining} of ${QUESTION_LIMIT} questions left for this IP in the 24-hour window.`;
  footnote.textContent = currentMode === "api"
    ? `${usage} Live answers use paid AI credits. Please use Groot responsibly.`
    : `${usage} Demo replies use no API credits; live answers use paid AI credits.`;
}

function applyQuota(quota) {
  if (!quota || !Number.isInteger(quota.questionsRemaining)) return;
  questionsRemaining = Math.max(0, Math.min(QUESTION_LIMIT, quota.questionsRemaining));
  quotaResetAt = quota.resetAt || null;
  quotaBlocked = questionsRemaining === 0;
  input.disabled = busy || quotaBlocked;
  sendButton.disabled = busy || quotaBlocked;
  for (const button of document.querySelectorAll("[data-groot-prompt]")) {
    button.disabled = busy || quotaBlocked;
  }
  input.placeholder = quotaBlocked ? "Question limit reached" : DEFAULT_PLACEHOLDER;
  updateFootnote();
}

function lastQuestionNotice(quota) {
  if (!quota?.finalQuestion) return "";
  const reset = quota.resetAt ? new Date(quota.resetAt).toLocaleString() : "after 24 hours";
  return `That was your third and final question from this IP for now. The limit resets at ${reset}.`;
}

function setBusy(value) {
  busy = value;
  input.disabled = value || quotaBlocked;
  sendButton.disabled = value || quotaBlocked;
  for (const button of document.querySelectorAll("[data-groot-prompt]")) button.disabled = value || quotaBlocked;
  sendButton.innerHTML = value ? "…" : 'Send <span aria-hidden="true">↑</span>';
}

async function refreshMode() {
  try {
    const response = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    if (!response.ok) throw new Error("Service unavailable");
    const status = await response.json();
    currentMode = status.mode;
    modeLabel.dataset.mode = status.mode;
    modeLabel.textContent = status.mode === "api" ? "Live answers · official documentation" : "Demo mode · sample answers";
    updateFootnote();
  } catch {
    currentMode = "offline";
    modeLabel.dataset.mode = "offline";
    modeLabel.textContent = "Groot service is unavailable";
    footnote.textContent = "Groot is temporarily unavailable. Please try again later.";
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/api/usage`, { cache: "no-store" });
    if (response.ok) applyQuota(await response.json());
  } catch {
    // This display-only request can fail; /api/chat still enforces the limit.
  }
}

async function submitQuestion(event) {
  event.preventDefault();
  const question = input.value.trim();
  if (!question || busy) return;

  trackChatEvent("chat_message_sent");
  appendMessage(question, "user");
  conversation.push({ role: "user", content: question });
  input.value = "";
  setBusy(true);
  const typing = document.createElement("div");
  typing.className = "groot-message groot-assistant-message groot-typing";
  typing.textContent = "Groot is looking in the docs…";
  messagesView.append(typing);
  scrollMessages();

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation.slice(-8) }),
    });
    const data = await response.json();
    typing.remove();
    if (!response.ok) {
      trackChatEvent("chat_error");
      applyQuota(data.quota);
      const notice = data.quota?.limitReached
        ? `Try Groot again after ${data.quota.resetAt ? new Date(data.quota.resetAt).toLocaleString() : "the 24-hour limit resets"}.`
        : "";
      appendMessage(data.error || "Groot could not answer that. Please try again later.", "assistant", [], notice);
      return;
    }
    trackChatEvent("chat_response_received");
    applyQuota(data.quota);
    const answer = typeof data.answer === "string" ? data.answer : "Groot could not read that answer.";
    appendMessage(answer, "assistant", Array.isArray(data.sources) ? data.sources : [], lastQuestionNotice(data.quota));
    conversation.push({ role: "assistant", content: answer });
  } catch (error) {
    trackChatEvent("chat_error");
    typing.remove();
    appendMessage(error.message || "Groot could not answer that. Please try again later.", "assistant");
  } finally {
    setBusy(false);
    input.focus();
  }
}

launcher.addEventListener("click", () => {
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  launcher.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    trackChatEvent("chat_open");
    refreshMode();
    input.focus();
  }
});

closeButton.addEventListener("click", () => {
  panel.hidden = true;
  launcher.setAttribute("aria-expanded", "false");
  launcher.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panel.hidden) closeButton.click();
});

document.querySelectorAll("[data-groot-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    if (busy) return;
    input.value = button.dataset.grootPrompt || "";
    form.requestSubmit();
  });
});

form.addEventListener("submit", submitQuestion);
refreshMode();
