var footerTpl = `
<hr />
<footer>
    <div>A footer.</div>
</footer>`;

export default class FooterView extends Backbone.View {

    constructor(options={}) {
        options = _.extend(options, { el: '#footer' });
        super(options);

        this.template = _.template(footerTpl);
    }

    render() {
        this.$el.html(this.template());
    }
}
