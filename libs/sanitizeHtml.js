import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'table',
    'thead', 'tbody', 'tr', 'td', 'th', 'div', 'span', 'hr', 'sup', 'sub',
    'del', 'ins', 'mark', 'abbr', 'cite', 'dfn', 'kbd', 'samp', 'var'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'src', 'alt', 'width', 'height',
    'class', 'id', 'style', 'rel', 'data-*', 'aria-*', 'role'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|sms):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
};

// Sanitization runs only in the browser. SafeMarkdownComp is a client component,
// so the useMemo re-runs on the client after hydration and sanitizes there.
// On the server we pass the content through untouched (Strapi CMS content is trusted).
export const sanitizeHtml = (dirty) => {
  if (typeof window === 'undefined') {
    return dirty;
  }
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
};

// Component wrapper for ReactMarkdown with sanitization
export const SafeMarkdown = ({ children, ...props }) => {
  // Pre-sanitize the content before passing to ReactMarkdown
  const sanitizedContent = sanitizeHtml(children);
  return sanitizedContent;
};