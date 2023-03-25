var html = document.documentElement;

var fontsfile = document.createElement('link');
fontsfile.href = pathTemplate + 'css/fonts.css';
fontsfile.rel = 'stylesheet';
document.head.appendChild(fontsfile);

if (sessionStorage.fontsLoaded) {
    html.classList.add('fonts-loaded');
} else {
    var script = document.createElement('script');
    script.src = pathTemplate + 'js/fontfaceobserver.js';
    script.async = true;

    script.onload = function () {
        var CodecPro800 = new FontFaceObserver('CodecPro', {
            weight: '800'
        });
        var Montserrat300 = new FontFaceObserver('Montserrat', {
            weight: '300'
        });
        var Montserrat400 = new FontFaceObserver('Montserrat', {
            weight: 'normal'
        });
        var Montserrat500 = new FontFaceObserver('Montserrat', {
            weight: '500'
        });
        var Montserrat600 = new FontFaceObserver('Montserrat', {
            weight: '600'
        });
        var Montserrat700 = new FontFaceObserver('Montserrat', {
            weight: 'bold'
        });
        var Montserrat900 = new FontFaceObserver('Montserrat', {
            weight: '900'
        });

        Promise.all([
            CodecPro800.load(),
            Montserrat300.load(),
            Montserrat400.load(),
            Montserrat500.load(),
            Montserrat600.load(),
            Montserrat700.load(),
            Montserrat900.load()
        ]).then(function () {
            html.classList.add('fonts-loaded');
            sessionStorage.fontsLoaded = true;
        });
    };
    document.head.appendChild(script);
}