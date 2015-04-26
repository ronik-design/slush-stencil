var headerTpl = `
<nav class="navbar navbar-default">
    <ul class="nav navbar-nav">
        <li>Nav Item</li>
    </ul>
</nav>`;

export default class HeaderView extends Backbone.View {

    constructor(options={}) {
        options = _.extend(options, { el: '#header' });
        super(options);

        this.template = _.template(headerTpl);
    }

    render() {
        $(this.el).html(this.template());
    }
}
