import Stat from '../models/Stat';

export default class FormView extends Backbone.View {

    constructor(options={}) {
        super(options);
        this.collection = options.collection;
        this.model = new Stat();
    }

    events() {
        return {
            'change #stat-multiplier': 'onChangeMultiplier',
            'change #stat-heading': 'onChangeHeading',
            'change #stat-description': 'onChangeDescription',
            'submit': 'onSubmit'
        };
    }

    onChangeMultiplier(event) {
        var val = $(event.currentTarget).val();
        this.model.set({ 'multiplier': +val });
    }

    onChangeHeading(event) {
        var val = $(event.currentTarget).val();
        this.model.set({ 'heading': val });
    }

    onChangeDescription(event) {
        var val = $(event.currentTarget).val();
        this.model.set({ 'description': val });
    }

    onSubmit(event) {
        event.preventDefault();
        this.collection.add(this.model);
        this.reset();
    }

    reset() {
        this.model = new Stat();
        this.$el.trigger('reset');
    }

    render() {}
}
