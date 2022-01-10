import slayMarkdown from 'slay-markdown';

export default function markdown (el, { value, oldValue }) {
  if (value === oldValue) return;

  if (value) {
    el.innerHTML = slayMarkdown.render(String(value));
  } else {
    el.innerHTML = '';
  }

  el.classList.add('markdown');
}
