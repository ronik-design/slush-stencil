class Demo {

    constructor(options) {
        this.formEl = options.formEl;
        this.statsEl = options.statsEl;
        this.$formEl = $(this.formEl);
        this.$statsEl = $(this.statsEl);
        this.template = _.template(options.template);
    }

    init() {
        this.$formEl.on('submit', this.onSubmit.bind(this));
    }

    onSubmit(event) {
        event.preventDefault();

        let $form = $(event.target);

        let context = {
            multiplier: $form.find('#stat-multiplier').val(),
            heading: $form.find('#stat-heading').val(),
            description: $form.find('#stat-description').val()
        };

        $form.trigger('reset');

        this.renderItem(context);
    }

    renderItem(context) {
        var rendered = this.template(context);
        this.$statsEl.append(rendered);
    }
}

function start() {
    let demo = new Demo({
        formEl: '#stats-form',
        statsEl: '#stats-items',
        template: $('#stats-item-template').html()
    });

    demo.init();
}

export default {
    start: start
};
