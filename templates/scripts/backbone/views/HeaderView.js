var headerTpl = `
<nav class="navbar navbar-default">
    <ul class="nav navbar-nav">
        <li>Nav Item</li>
    </ul>
</nav>`;

export default class HeaderView extends Backbone.View {

    constructor(options) {
        this.el = '#header';
        this.template = headerTpl;
        super(options);
    }

    render() {
        $(this.el).html(_.template(this.template));
    }
}
