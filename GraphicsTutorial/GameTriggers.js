

function changeTextRules() {

    var info = document.getElementById('info');
    var rules = document.getElementById('hiddenrules');
    info.style.visibility = 'hidden';
    rules.style.visibility = 'visible';
}


function changeTextOriginal() {
    var info = document.getElementById('info');
    var rules = document.getElementById('hiddenrules');
    var countdown = document.getElementById('countdown');
    info.style.visibility = 'visible';
    rules.style.visibility = 'hidden';
    countdown.style.visibility = 'hidden';

}
