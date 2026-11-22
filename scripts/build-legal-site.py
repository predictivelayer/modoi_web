#!/usr/bin/env python3
"""Generate legal pages and patch nav/footer across modoi_web."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent

FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">"""

CSS = """<link rel="stylesheet" href="css/landing.css?v=1">
<link rel="stylesheet" href="blogs/g-blog.css?v=3">
<link rel="stylesheet" href="css/chrome.css?v=1">
<link rel="stylesheet" href="css/subpages.css?v=1">
<link rel="stylesheet" href="css/density.css?v=1">
<link rel="stylesheet" href="css/legal.css?v=1">"""

COPY = "© 2026 Autonome. Modoi is a product of Autonome."

def head(title, desc):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="favicon.ico?v=2" sizes="any">
<link rel="icon" href="favicon.svg?v=2" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png?v=2">
{FONTS}
{CSS}
</head>"""


def header(current=None):
    def cur(k):
        return ' aria-current="page"' if k == current else ""
    return f"""<a class="skip-d" href="#main">Skip to content</a>
<header class="mh">
  <div class="mh-inner">
    <a class="mh-brand" href="index.html" aria-label="Modoi home"><img src="assets/modoi-mark.png" alt="">Modoi</a>
    <nav aria-label="Primary" style="display:contents">
      <ul class="mh-links">
        <li><a href="index.html#how">How it works</a></li>
        <li><a href="privacy.html"{cur("privacy")}>Privacy</a></li>
        <li><a href="blogs/index.html"{cur("blog")}>Blog</a></li>
        <li><a href="blocker.html">Nuclear Blocker</a></li>
        <li><a href="https://modoi.featurebase.app/" target="_blank" rel="noopener noreferrer">Suggest a feature</a></li>
      </ul>
      <a class="mh-cta" href="get.html">Get for Mac</a>
    </nav>
  </div>
</header>"""


def footer(prefix=""):
    p = prefix
    return f"""<footer class="mf">
  <div class="mf-inner">
    <div class="mf-row">
      <a class="mf-brand" href="{p}index.html"><img src="{p}assets/modoi-mark.png" alt="">modoi</a>
      <nav class="mf-links" aria-label="Footer">
        <a href="{p}pricing.html">Pricing</a>
        <a href="{p}terms.html">Terms</a>
        <a href="{p}privacy.html">Privacy</a>
        <a href="{p}refund.html">Refund Policy</a>
        <a href="{p}index.html#how">How it works</a>
        <a href="{p}blocker.html">Nuclear Blocker</a>
        <a href="{p}blogs/index.html">Blog</a>
        <a href="https://modoi.featurebase.app/" target="_blank" rel="noopener noreferrer">Suggest a feature</a>
        <a href="mailto:support@modoi.ai">support@modoi.ai</a>
      </nav>
    </div>
    <div class="mf-base">{COPY}</div>
  </div>
</footer>"""

PADDLE_MOR = (
    "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record "
    "for all our orders. Paddle provides all customer service inquiries and handles returns."
)

terms_body = f"""
<main class="legal-page g-blog-article" id="main">
  <p class="blog-kicker">Legal</p>
  <h1>Terms of Service</h1>
  <p class="blog-meta"><span>Last updated: November 21, 2026</span><span>Autonome</span></p>

  <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of software and services offered by <strong>Autonome</strong>, a company registered in the People&rsquo;s Republic of China (&ldquo;Autonome,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). <strong>Modoi</strong> and <strong>Nuclear Blocker</strong> are products of Autonome. By downloading, installing, or using our products, you agree to these Terms.</p>

  <h2>Merchant of record</h2>
  <p>{PADDLE_MOR}</p>

  <h2>License</h2>
  <p>We grant you a personal, non-exclusive, non-transferable license to install and use our software on devices you own or control, subject to these Terms and any plan limits that apply. You may not reverse engineer, resell, sublicense, or use the software to build a competing product. You keep ownership of your content; we keep ownership of the software.</p>

  <h2>Subscriptions and billing</h2>
  <p><strong>Modoi</strong> is offered as a subscription at <strong>$15 per month</strong> after a <strong>7-day free trial</strong>. You may cancel at any time; cancellation stops future charges but does not automatically refund past periods unless our <a href="refund.html">Refund Policy</a> applies. Billing, trials, and renewals for web and Mac purchases processed through Paddle are handled under Paddle&rsquo;s checkout terms. Prices may change with notice; continued use after a change means you accept the new price for the next renewal.</p>
  <p><strong>Nuclear Blocker</strong> on iPhone and iPad may use Apple&rsquo;s App Store billing. Mac distribution and licensing for Nuclear Blocker are described on the product pages and may use Paddle where checkout is offered.</p>

  <h2>Acceptable use</h2>
  <p>Use our products lawfully and do not interfere with other users or our systems. Do not attempt to bypass payment, licensing, or security controls. Do not use the software to harass others or violate third-party rights.</p>

  <h2>Disclaimers</h2>
  <p>The software is provided &ldquo;as is.&rdquo; To the fullest extent permitted by law, we disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Modoi and Nuclear Blocker are productivity and self-control tools; they do not guarantee specific work outcomes, health results, or uninterrupted blocking on every device or network.</p>

  <h2>Limitation of liability</h2>
  <p>To the fullest extent permitted by law, Autonome and its affiliates are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill. Our total liability for any claim relating to the software or these Terms is limited to the greater of (a) amounts you paid us for the product in the twelve months before the claim or (b) fifty U.S. dollars.</p>

  <h2>Termination</h2>
  <p>You may stop using the software at any time. We may suspend or end access if you materially breach these Terms. Sections that by nature should survive (license limits, disclaimers, liability limits, and governing law) survive termination.</p>

  <h2>Changes</h2>
  <p>We may update these Terms. We will post the new version on this page and update the date above. Material changes may also be noted in the app or by email where we have your address. Continued use after the effective date means you accept the revised Terms.</p>

  <h2>Contact</h2>
  <p>Questions about these Terms: <a href="mailto:support@modoi.ai">support@modoi.ai</a>.</p>
  <p>See also our <a href="privacy.html">Privacy Policy</a> and <a href="refund.html">Refund Policy</a>.</p>
</main>
"""

privacy_body = """
<main class="legal-page g-blog-article" id="main">
  <p class="blog-kicker">Legal</p>
  <h1>Privacy Policy</h1>
  <p class="blog-meta"><span>Last updated: November 21, 2026</span><span>Autonome</span></p>

  <p>This Privacy Policy describes how <strong>Autonome</strong> (&ldquo;we,&rdquo; &ldquo;us&rdquo;), a company registered in the People&rsquo;s Republic of China, processes information when you use <strong>Modoi</strong>, <strong>Nuclear Blocker</strong>, and modoi.ai. Our registered address is 北京市朝阳区林翠西里11-4-601, 100192 (Chaoyang District, Beijing, China). Contact: <a href="mailto:support@modoi.ai">support@modoi.ai</a>.</p>

  <h2>Modoi on your Mac</h2>
  <p>Modoi is built to keep your work context on your computer:</p>
  <ul>
    <li>Screen activity is processed on your Mac by a local model (~2&nbsp;GB).</li>
    <li>AI runs on your computer. It even works without Wi‑Fi. Nothing is sent to Claude, OpenAI, or the like.</li>
    <li>Nothing leaves the computer except optional calendar sync with Google or Outlook when you connect those services.</li>
    <li>Offline use works without Wi‑Fi; online access is needed only for that calendar sync.</li>
  </ul>
  <p>Compared with many productivity apps, Modoi does not send your screen activity to our servers or to third-party model APIs for core features. Product-specific details for Nuclear Blocker (Screen Time, iCloud sync, and Mac filtering) are in the <a href="blocker-privacy.html">Nuclear Blocker Privacy Policy</a>.</p>

  <h2>This website</h2>
  <p>When you use <a href="get.html">Get for Mac</a>, we collect what you submit in the form: email, first and last name, which product you are interested in, whether you want email updates, and optional comments. We use this to provide downloads, respond to you, and improve the product. We do not sell this information.</p>

  <h2>Payments</h2>
  <p>When you buy a subscription or license through our checkout, <a href="https://www.paddle.com/legal/privacy" rel="noopener noreferrer" target="_blank">Paddle.com</a> is the Merchant of Record. Paddle receives payment and billing data and processes it under <a href="https://www.paddle.com/legal/privacy" rel="noopener noreferrer" target="_blank">Paddle&rsquo;s privacy policy</a>. We receive limited order metadata needed to fulfill the license, not your full card number.</p>

  <h2>Retention</h2>
  <p>App data on your devices stays until you delete it or uninstall the app. Website form submissions and support email are kept as long as needed for support, legal compliance, and product operations, then deleted or anonymized when no longer required.</p>

  <h2>Your rights</h2>
  <p>Depending on where you live, you may have rights to access, correct, delete, or export personal data we hold about you, or to object to certain processing. Email <a href="mailto:support@modoi.ai">support@modoi.ai</a> with your request. We will verify your identity before acting on it.</p>

  <h2>International transfers</h2>
  <p>Autonome is based in China. If you contact us from another country, information you send may be processed there and in countries where our processors (such as Paddle or email providers) operate. We use appropriate safeguards where required by law.</p>

  <h2>Children</h2>
  <p>Our products are not directed at children under 13. We do not knowingly collect personal information from children. Contact us if you believe a child has provided data.</p>

  <h2>Changes</h2>
  <p>We may update this policy. We will post changes here and update the date above.</p>

  <h2>Contact</h2>
  <p><a href="mailto:support@modoi.ai">support@modoi.ai</a></p>
</main>
"""

refund_body = """
<main class="legal-page g-blog-article" id="main">
  <p class="blog-kicker">Legal</p>
  <h1>Refund Policy</h1>
  <p class="blog-meta"><span>Last updated: November 21, 2026</span><span>Autonome</span></p>

  <p>Autonome wants you to be satisfied with Modoi and other paid products. This policy explains how refunds work for purchases handled by Autonome and our Merchant of Record, Paddle.</p>

  <h2>30-day money-back guarantee</h2>
  <p>If you are not satisfied with a Modoi subscription or other eligible purchase made through Paddle within <strong>30 days</strong> of payment, contact us for a refund. We will work with Paddle to process qualifying requests promptly.</p>

  <h2>How to request a refund</h2>
  <ul>
    <li>Use Paddle&rsquo;s customer portal at <a href="https://paddle.net" rel="noopener noreferrer" target="_blank">paddle.net</a> (sign in with the email used at checkout), or</li>
    <li>Email <a href="mailto:support@modoi.ai">support@modoi.ai</a> from the same address with your order details.</li>
  </ul>
  <p>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.</p>

  <h2>Apple App Store</h2>
  <p>Purchases of <strong>Nuclear Blocker on iOS or iPadOS</strong> made through Apple&rsquo;s App Store are billed by Apple. Refunds for those purchases are handled by Apple under <a href="https://support.apple.com/118223" rel="noopener noreferrer" target="_blank">Apple&rsquo;s refund policy</a>, not by Autonome or Paddle.</p>

  <h2>Subscriptions</h2>
  <p>You may cancel Modoi at any time to stop future billing. Cancel through Paddle&rsquo;s customer portal or the link in your receipt. Canceling does not automatically refund the current period unless this policy or Paddle&rsquo;s terms allow it.</p>

  <h2>Contact</h2>
  <p>Questions: <a href="mailto:support@modoi.ai">support@modoi.ai</a>.</p>
</main>
"""

pricing_body = """
<main class="legal-page g-blog-article pricing-page" id="main">
  <p class="blog-kicker">Pricing</p>
  <h1>Simple plans</h1>
  <p class="lede">Modoi is a subscription on your Mac. Try it free, then pay monthly if you keep using it. Checkout through Paddle is coming soon; for now, start with the Mac download.</p>

  <div class="pricing-cards">
    <article class="pricing-card">
      <p class="blog-kicker">Modoi</p>
      <p class="pricing-price">$15<small>/month</small></p>
      <p class="pricing-note"><strong>7-day free trial</strong> · Cancel anytime</p>
      <p>AI focus calendar for Mac: local activity capture, ticket-aware day view, and focus nudges. Billed through Paddle when checkout is live.</p>
    </article>
    <article class="pricing-card">
      <p class="blog-kicker">Nuclear Blocker</p>
      <h2>iPhone &amp; iPad</h2>
      <p class="pricing-note">Pricing follows the App Store in your region.</p>
      <p>Mac pricing for Nuclear Blocker has not been announced yet.</p>
    </article>
  </div>

  <div class="pricing-cta">
    <a class="btn btn-dark" href="get.html">Get Modoi for Mac</a>
    <a class="btn btn-ghost" href="blocker.html">Nuclear Blocker overview</a>
  </div>
  <p class="pricing-note" style="margin-top:20px">See <a href="terms.html">Terms</a>, <a href="privacy.html">Privacy</a>, and <a href="refund.html">Refund Policy</a>.</p>
</main>
"""

pages = {
    "terms.html": ("Terms of Service · Modoi", "Terms of Service for Modoi and Nuclear Blocker by Autonome.", terms_body, "terms"),
    "privacy.html": ("Privacy Policy · Modoi", "How Autonome handles data for Modoi, Nuclear Blocker, and modoi.ai.", privacy_body, "privacy"),
    "refund.html": ("Refund Policy · Modoi", "30-day money-back guarantee and refund instructions for Modoi.", refund_body, "refund"),
    "pricing.html": ("Pricing · Modoi", "Modoi subscription pricing: $15/month after a 7-day free trial.", pricing_body, "pricing"),
}

for fname, (title, desc, body, cur) in pages.items():
    html = head(title, desc) + f'\n<body class="get-page">\n' + header(cur) + body + footer() + "\n</body>\n</html>\n"
    (ROOT / fname).write_text(html)

# Patch all live HTML
FOOTER_OLD = re.compile(
    r'<nav class="mf-links" aria-label="Footer">.*?</nav>\s*</div>\s*<div class="mf-base">[^<]*</div>',
    re.S,
)

def patch_file(path: Path):
    t = path.read_text()
    prefix = "../" if path.parent.name == "blogs" else ""
    new_footer = f"""<nav class="mf-links" aria-label="Footer">
        <a href="{prefix}pricing.html">Pricing</a>
        <a href="{prefix}terms.html">Terms</a>
        <a href="{prefix}privacy.html">Privacy</a>
        <a href="{prefix}refund.html">Refund Policy</a>
        <a href="{prefix}index.html#how">How it works</a>
        <a href="{prefix}blocker.html">Nuclear Blocker</a>
        <a href="{prefix}blogs/index.html">Blog</a>
        <a href="https://modoi.featurebase.app/" target="_blank" rel="noopener noreferrer">Suggest a feature</a>
        <a href="mailto:support@modoi.ai">support@modoi.ai</a>
      </nav>
    </div>
    <div class="mf-base">{COPY}</div>"""
    if FOOTER_OLD.search(t):
        t = FOOTER_OLD.sub(new_footer, t, count=1)
    t = t.replace(f'href="{prefix}index.html#privacy"', f'href="{prefix}privacy.html"')
    t = t.replace('href="index.html#privacy"', 'href="privacy.html"')
    t = t.replace('href="../index.html#privacy"', 'href="../privacy.html"')
  # blocker nav used blocker-privacy for Privacy link
    t = re.sub(r'href="blocker-privacy\.html"([^>]*?)>Privacy</a>', f'href="{prefix}privacy.html"\\1>Privacy</a>', t)
    t = re.sub(
        r'<div class="mf-base">\s*(?:&copy;|©)\s*Modoi 2026\s*</div>',
        f'<div class="mf-base">{COPY}</div>',
        t,
    )
    broken = "      </nav>\n    <div class=\"mf-base\">"
    fixed = "      </nav>\n    </div>\n    <div class=\"mf-base\">"
    if broken in t:
        t = t.replace(broken, fixed, 1)
    path.write_text(t)

for html in ROOT.rglob("*.html"):
    if "demos" in html.parts or "modoi-demo" in html.parts:
        continue
    if html.name in pages:
        continue
    patch_file(html)

print("built legal pages and patched", len(list(ROOT.rglob('*.html'))), "html files")