/**
 * Instance by DrewIt
 * 
 * domrefresh.js
 */

function refreshScript(id) {
    let script = document.querySelector(`script#${id}`), app = document.querySelector('html');
    if (app.contains(script)) {
        script.remove();
        app.appendChild(script);
    }
    else app.appendChild(script)
}