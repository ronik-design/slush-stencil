import 'knockout-pre-rendered';
import App from './App';


window.App = new App();

function main () {
    $(() => window.App.start());
}

$(main);
