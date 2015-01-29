var footerTpl = `
<hr />
<footer>
    <div>A footer.</div>
</footer>`;

export default class FooterView extends Backbone.View {

    constructor(options) {
        this.el = '#footer';
        this.template = footerTpl;
        super(options);
    }

    render() {
        this.$el.html(_.template(this.template));
    }
}
