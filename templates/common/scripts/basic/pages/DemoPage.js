import ViewModel from '../core/ViewModel';


export default class DefaultPage extends ViewModel {

    constructor() {
        super();
        this.observe('stats', []);
    }

    onSubmit(form) {
        let $form = $(form);

        let stat = {
            multiplier: $form.find('#stat-multiplier').val(),
            heading: $form.find('#stat-heading').val(),
            description: $form.find('#stat-description').val()
        };

        $form.trigger('reset');

        this.stats.push(stat);
    }

    destroy() {
        super.destroy();
    }
}
