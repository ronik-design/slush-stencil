export default class StatsView extends Backbone.View {

    constructor(options={}) {
        super(options);

        this.template = _.template(options.template);
        this.collection = options.collection;

        this.collection.on('add', this.onAdd.bind(this));
    }

    onAdd(stat) {
        this.$el.append(this.template(stat.toJSON()));
    }

    render() {}
}
