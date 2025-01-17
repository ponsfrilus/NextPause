JSON.parse(localStorage.getItem('nextPause'));

function getNewTime(pauseList, dateActuelle) {

    for (let time of pauseList) {
        let [hours, minutes] = time.split(':').map(parseFloat);
        let newDateActuelle = new Date(dateActuelle);

        newDateActuelle.setHours(hours);
        newDateActuelle.setMinutes(minutes);

        if (newDateActuelle > dateActuelle) {
            return time.split(':');
        }
    }
}

function update() {
    const dateActuelle = new Date();

    let pauseList = JSON.parse(localStorage.getItem('NextPauseData'))[localStorage.getItem('NextPauseChoice')];

    let newTime = getNewTime(pauseList, dateActuelle);

    if (newTime === undefined) {
        document.getElementById('h1').innerHTML = '...';
        return;
    }

    let hour = newTime[0];
    let minute = newTime[1];

    const heureASoustraire = new Date();
    heureASoustraire.setHours(hour);
    heureASoustraire.setMinutes(minute);
    heureASoustraire.setSeconds(0);

    const resultat = new Date(heureASoustraire - dateActuelle);

    resultat.setHours(resultat.getHours() - 1);

    document.getElementById('h1').innerHTML = `${setStyle(resultat.getHours())}:${setStyle(resultat.getMinutes())}:${setStyle(resultat.getSeconds())}`;
}

function setStyle(str) {
    return (str + "").padStart(2, "0");
}

async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    localStorage.setItem('NextPauseData', JSON.stringify(data));
    return data;
}

async function setOption() {
    let data = await fetchData();
    let choice = '';

    for (let school in data) {
        const option = document.createElement('option');
        option.text = school;
        option.value = school;
        const select = document.getElementById('selectBox');
        if (localStorage.getItem('NextPauseChoice') && localStorage.getItem('NextPauseChoice') === school) {
            option.selected = true;
        }
        select.appendChild(option);

        if (choice === '') {
            choice = school;
        }
    }

    if (!localStorage.getItem('NextPauseChoice')) {
        localStorage.setItem('NextPauseChoice', choice);
    }

    update();
}

setOption();

$(document).ready(function () {
    $('#selectBox').change(async function () {
        localStorage.setItem('NextPauseChoice', $(this).find('option:selected').attr('value'));
    });
});

setInterval(() => {
    update();
}, 1000);

