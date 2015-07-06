import 'knockout-pre-rendered';
import App from './App';
import Demo from './Demo';



function main () {
    if (window.IS_DEMO) {
        $(() => Demo.start());
    } else {
        window.App = new App();
        $(() => window.App.start());
    }
}

$(main);




