# Changelog

This changelog covers releases made in this fork ([sohampatwardhan/joplin-outline](https://github.com/sohampatwardhan/joplin-outline)), starting at 1.6.0. For the history of the original project, see the [upstream releases](https://github.com/cqroot/joplin-outline/releases).

## 1.6.0

- Add support for outlining HTML-format notes (`markup_language: 2`), such as notes created from web clips or imported ebook chapters. These previously showed no outline at all.
- Add support for literal HTML headers (`<h1>`-`<h6>`) written inline in a Markdown note.
- Fix clicking an outline item for an HTML-format note to actually scroll to the header, by using an existing id from the source HTML (on the heading itself, or a wrapper element immediately around it) instead of a slug that doesn't exist in the rendered note. Headers without a nearby id in the source still can't be scrolled to, since Joplin's HTML renderer doesn't auto-generate heading anchors the way it does for Markdown.
