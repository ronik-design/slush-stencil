import Stat from '../models/Stat';

export default class Stats extends Backbone.Collection {

    constructor() {
        super({ model: Stat });
    }
}
