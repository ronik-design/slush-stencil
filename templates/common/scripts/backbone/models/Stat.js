export default class Stat extends Backbone.Model {

    defaults() {
        return {
            multiplier: 100,
            heading: '',
            description: ''
        };
    }
}
