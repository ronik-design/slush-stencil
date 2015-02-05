import Model from '../models/Model';

export default class Models extends Backbone.Collection {

    constructor(options) {
        super(options);
        this.model = Model;
    }
}
