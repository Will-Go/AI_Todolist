export default function removeHTMLTags(html: string, tag = null) {
  let regex;

  if (tag) {
    // Create a regex to match the specific tag
    regex = new RegExp(`<${tag}\\b[^>]*>|<\/${tag}>`, "gi");
  } else {
    // General regex to match all HTML tags
    regex = /<[^>]*>/g;
  }

  return html.replace(regex, "");
}
