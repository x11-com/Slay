import slayMarkdown from 'slay-markdown/withMentions';

export default function renderWithMentions (text, user) {
  if (!text) return null;
  const env = { userName: user.auth.local.username, displayName: user.profile.name };
  return slayMarkdown.render(String(text), env);
}
