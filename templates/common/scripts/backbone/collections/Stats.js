import Stat from '../models/Stat';

export default class Stats extends Backbone.Collection {

    constructor(options) {
        super({ model: State });
    }
}
