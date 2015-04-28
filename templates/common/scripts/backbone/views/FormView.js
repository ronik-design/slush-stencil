import Stat from '../models/Stat';

export default class FormView extends Backbone.View {

    constructor(options={}) {
        super(options);

        this.collection = options.collection;
        this.model = new Stat();

        this.$el.on('submit', this.onSubmit.bind(this));
    }

    events() {
        return {
            'change #stat-multiplier': 'onChangeMultiplier',
            'submit': 'onSubmit'
        };
    }

    onChangeMultiplier(event) {
        console.log(event);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log(this.model.toJSON());
        this.render();
    }

    render() {
        this.$el.trigger('reset');
    }
}
