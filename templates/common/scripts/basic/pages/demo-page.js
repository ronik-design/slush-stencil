import ViewModel from "../core/view-model";


export default class DefaultPage extends ViewModel {

  constructor() {
    super();
    this.observe("stats", []);
  }

  onSubmit(form) {
    const $form = $(form);

    const stat = {
      multiplier: $form.find("#stat-multiplier").val(),
      heading: $form.find("#stat-heading").val(),
      description: $form.find("#stat-description").val()
    };

    $form.trigger("reset");

    this.stats.push(stat);
  }

  destroy() {
    super.destroy();
  }
}
