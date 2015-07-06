$icons = { {% for glyph in glyphs %}
    {{ glyph.name }}: s('"\%s"', ({{ glyph.unicode }})){% endfor %}
}
