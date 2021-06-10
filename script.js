const container = document.querySelector(".container"),
    caratulaMusic = container.querySelector(".img_area img"),
    TituloMusic = container.querySelector(".detail_song .player_song"),
    ArtistMusic = container.querySelector(".detail_song .player_artist"),
    progressArea = container.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"), //Podemos usar a progress area por ser un div arriba
    PlayPauseBtn = container.querySelector(".play-pause"),
    AnteriorBtn = container.querySelector("#prev"),
    SiguienteBtn = container.querySelector("#next"),
    AudioMusic = container.querySelector("#main-audio"),
    ListMusic = container.querySelector(".music-list"),

    MasMusicBtn = container.querySelector("#more-music"),
    CerrarMasMusicBtn = container.querySelector("#close");


// all music es el arreglo que tenemos en el script con la musica

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); // indice de una cancion aleatoria 
isMusicPaused = true;
const ulTag = container.querySelector("ul");

// se carga una cancion aleatoria al principio
window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
});

function loadMusic(indexNumb) {
    TituloMusic.innerText = allMusic[indexNumb - 1].name;
    ArtistMusic.innerText = allMusic[indexNumb - 1].artist;
    caratulaMusic.src = `img/${allMusic[indexNumb - 1].src}.jpg`;
    AudioMusic.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// reproducir cancion
function playMusic() {
    container.classList.add("paused");
    PlayPauseBtn.querySelector("i").classList.add('fa-pause');
    AudioMusic.play();

}

// pausar cancion
function PauseMusic() {
    container.classList.remove("paused");
    PlayPauseBtn.querySelector("i").classList.remove('fa-pause');
    PlayPauseBtn.querySelector("i").classList.add('fa-play');
    AudioMusic.pause();

}

// anterior cancion
function prevMusic() {
    musicIndex--; // disminuimos en 1 el indice de la musica
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex; // si es menos -1 pasa al ultimo de la lista
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
//siguiente cancion
function nextMusic() {
    musicIndex++; // se incrementa en 1
    // pero si el siguiente supera el tamaño de la lista para a la primera cancion
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// los eventos
//envento de dar click en pausar y reproducir musica
PlayPauseBtn.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("paused");
    // si nuestra variable es verdadera  llamara a pauseMusic  de lo contrario PlayMusic
    isMusicPlay ? PauseMusic() : playMusic();
    playingSong();
});

AnteriorBtn.addEventListener("click", () => {
    prevMusic();
});

SiguienteBtn.addEventListener("click", () => {
    nextMusic();
});

AudioMusic.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // se obtiene el tiempo trascurrido de la cancion
    const duration = e.target.duration; // obtenemos la duracion total de la cancion que esta sonando

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTIme = container.querySelector(".current-time"),
        musicDuraction = container.querySelector(".max-duration");
    AudioMusic.addEventListener("loadeddata", () => {
        //actualizamos la duracion total de la cancion
        let AudioDuration = AudioMusic.duration;
        let totalMin = Math.floor(AudioDuration / 60);
        let totalSec = Math.floor(AudioDuration % 60);
        if (totalSec < 10) {
            // para colocar 0 antes si los segundos son menor a 10
            totalSec = `0${totalSec}`;
        }
        musicDuraction.innerText = `${totalMin}:${totalSec}`;
    });
    // se actualiza el tiempo trascurrido
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTIme.innerText = `${currentMin}:${currentSec}`;
});

//actualizacion de la barra de musica
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; // se obtiene el ancho de la barra de progreso
    let clickedOffsetX = e.offsetX; // obtenfo cuando de click en alguna parte de la barra
    let songDuration = AudioMusic.duration; // la duracion

    AudioMusic.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); // se llama a la duncion de reproducir musica
    playingSong();

});

//hacer el cambio de loop a shuffle al dar click
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.className; // se obtiene lo que contiene la clase
    switch (getText) {
        case "fa fa-repeat":
            repeatBtn.classList.remove('fa-repeat');
            repeatBtn.classList.add('fa-random');
            repeatBtn.setAttribute("title", "song looped");
            break;

        case "fa fa-random":
            repeatBtn.classList.remove('fa-random');
            repeatBtn.classList.add('fa-repeat');
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// antes de que la musica termine
AudioMusic.addEventListener("ended", () => {

    let getText = repeatBtn.className;

    switch (getText) {

        case "fa fa-repeat":
            nextMusic();
            break;

        case "fa fa-radom":
            let ranIndex = Math.floor((Math.random * allMusic.length) + 1); // se genera un index aleatorio
            do {
                randIndex = Math.floor((Math.random * allMusic.length) + 1);
            } while (musicIndex == ranIndex); // el ciclo es mientras la cancion actual sea la misma que la alatoria
            musicIndex = ranIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }

});

//mostrar lista de musica con un click
MasMusicBtn.addEventListener("click", () => {
    ListMusic.classList.toggle("show");
});
CerrarMasMusicBtn.addEventListener("click", () => {
    MasMusicBtn.click();
});


// creamos lista acorde al array que contiene la musica
for (let i = 0; i < allMusic.length; i++) {
    //pasar el nombre y el artista de la cancion
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); // insertar li dentro de ul
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        };
        liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //se pasa el total de la cancion
        liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); // se adiciona el valor de la duracion al atributo
    });
}
// reproducir musica en particular de la lista
function playingSong() {
    const allLisTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLisTag.length; j++) {
        let audioTag = allLisTag[j].querySelector(".audio-duration"); // es de la clase de la lista añadida

        if (allLisTag[j].classList.contains("playing")) {
            allLisTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        // si li su index es igual al una musica añadida
        if (allLisTag[j].getAttribute("li-index") == musicIndex) {
            allLisTag[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        allLisTag[j].getAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}