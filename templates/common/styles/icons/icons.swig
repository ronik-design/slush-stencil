icons = { {% for icon in icons %}
    {{ icon.name }}: {{ icon.codepoint.toString(16) }}{% endfor %}
}
