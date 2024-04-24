var ampladaCarta, alcadaCarta;
var alcadaTauler, ampladaTauler;
var separacioH=20, separacioV=20;
var jocCartes = [];
var numCartas;
var nFiles;
var nColumnes;
var contadorClicks = 0;
var chosenDeck;
var maximClicks;
var clicksRestants;
var score = 0;

$(function() {
    $("#deckSelector").append('<div style="background-image: url(images/deck.png); background-position: 0px -480px; width: 80px; height: 120px;" alt="carta cute" class="tipusCartes" id="cute" onclick="chooseDeck(\'cute\', event)"></div>');
    $("#deckSelector").append('<div style="background-image: url(images/pokemon.jpg); background-position: 0px 111px; width: 110px; height: 110px;" alt="carta cute" class="tipusCartes" id="pokemon" onclick="chooseDeck(\'pokemon\', event)"></div>');
    $("#deckSelector").append('<div style="background-image: url(images/poker1.png); background-position: 0px -492px; width: 79px; height: 123px;" alt="carta cute" class="tipusCartes" id="poker" onclick="chooseDeck(\'poker\', event)"></div>');

    $(".tipusCartes").on("mouseenter", function() {
        $(this).toggleClass("hovered");
    });

    $(".tipusCartes").on("mouseleave", function() {
        $(this).toggleClass("hovered");
    });

    $(".tipusCartes").on("click", function() {
        $(".tipusCartes").removeClass("active");
        $(this).addClass("active");
    });
});

function selectorFons() {
    var styleTag = $('<style></style>');
    var css = '';
    switch(chosenDeck) {
        case 'cute':
            css='body { background: #9e9e9e url(images/wallpaper_cute.jpg);\n background-size: cover;\n background-repeat: no-repeat;\n background-position: center;}';
            break;
        case 'pokemon':
            css='body { background: #9e9e9e url(images/wp10311653-pokemon-landscape-wallpapers.jpg);\n background-size: cover;\n background-repeat: no-repeat;\n background-position: center;}';
            break;
        case 'poker':
            css='body { background: #9e9e9e url(images/peakpx.jpg);\n background-size: cover;\n background-repeat: no-repeat;\n background-position: center;}';
            break;
    }

    styleTag.text(css);
    $('head').append(styleTag);
}

function seleccio(dificultat) {
    switch (dificultat) {
        case 'facil':
            numCartas = 4;
            nFiles = 2;
            nColumnes = 2;
            maximClicks = 12;
            break;
        case 'mitjana':
            numCartas = 12;
            nFiles = 3;
            nColumnes = 4;
            maximClicks = 36;
            break;
        case 'alta':
            numCartas = 16;
            nFiles = 4;
            nColumnes = 4;
            maximClicks = 48;
            break;
    }
}

function creacioCartes() {
    var carta;
    var f=1;
    var c=1;
    var i = jocCartes.length

    while (i > 0) {
        
        $("#tauler").append('<div class="carta" id="' + "f"+f+"c"+c + '"> <div class="cara darrera"></div><div class="cara davant"></div>  </div>');
    
        carta = $("#f"+f+"c"+c);
    
        ampladaCarta = carta.width(); 
        alcadaCarta = carta.height();
    
        carta.css({
            "left": ((c-1) * (ampladaCarta + separacioH) + separacioH) + "px",
            "top": ((f-1) * (alcadaCarta + separacioV) + separacioV) + "px"
        });
    
        c++;
        
        if (c > nColumnes) {
            c = 1;
            f++;
        }
    
        i--;
    
        carta.find(".davant").addClass(jocCartes.pop());     
    }
    
}

function repartirCartes() {
    var cartes = $(".carta");
    var index = 0;

    function repartirCarta() {
        if (index < cartes.length) {
            var carta = $(cartes[index]);
            carta.animate({
                left: carta.data('left'),
                top: carta.data('top')
            }, 5000); 
            index++;
            setTimeout(repartirCarta, 2000); 
        }
    }

    cartes.each(function() {
        var left = $(this).position().left;
        var top = $(this).position().top;
        $(this).css({left: left, top: top});
        $(this).data('left', left);
        $(this).data('top', top);
        $(this).css({top: -1000, left: 500});
    });

    repartirCarta();
}


function gestioParelles() {
    let selectedCards = [];
    let clicksRestants = maximClicks;
    
    $("#contadorClicks").text("Clicks remaining: " + clicksRestants);

    $(".carta").on("click",function(){


        var cartaSeleccionada = $(this);
        if (cartaSeleccionada.hasClass("carta-girada") || cartaSeleccionada.hasClass("carta-match")) {
            return;
        }

        if (clicksRestants == 0) {
            return; // No permitir más interacciones cuando los clicks restantes sean cero
        }

        clicksRestants--;
        $("#contadorClicks").text("Clicks remaining: " + clicksRestants);
        

        playSoClick();
        
        contadorClicks++;

        cartaSeleccionada.toggleClass("carta-girada");

        selectedCards.push(cartaSeleccionada);

        if (selectedCards.length === 2) {
            var carta1 = selectedCards[0];
            var carta2 = selectedCards[1];

            var carta1Clase = carta1.find(".davant").attr("class");
            var carta2Clase = carta2.find(".davant").attr("class");

            if (carta1Clase === carta2Clase) {
                playSoParella();
                carta1.addClass("carta-match");
                carta2.addClass("carta-match");
                setTimeout(function() {
                    carta1.remove();
                    carta2.remove();
                    numCartas -= 2;
                    score+=2;
                    $("#puntuacio").text("Score: " + score);
                    if (numCartas == 0) {
                        missatgeVictoria(); //PENDING
                    }
                }, 800);
            } else {
                setTimeout(function() {
                    playTurn();
                    carta1.toggleClass("carta-girada");
                    carta2.toggleClass("carta-girada");
                }, 800);
            }

            selectedCards = [];     
        }
        if (clicksRestants == 0) {
            setTimeout(function() {
            popupClicks();
        }, 800);
        }
    });
}

function popupTime() {
    $('.carta').off("click");
    var popup = $('<div class="popup"></div>');
    popup.html(`
        <div class="popup-content">
            <h2>You lost!</h2>
            <p>Run out of time.</p>
            <button id="returnMenu">Return to menu</button>
        </div>
    `);

    $('body').append(popup);

    $('#returnMenu').on('click', function() {
        location.reload();
    });
}

function popupClicks() {
    $('.carta').off("click");
    var popup = $('<div class="popup"></div>');
    popup.html(`
        <div class="popup-content">
            <h2>You lost!</h2>
            <p>No clicks remaining.</p>
            <button id="returnMenu">Return to menu</button>
        </div>
    `);

    $('body').append(popup);

    $('#returnMenu').on('click', function() {
        location.reload();
    });
}

function popupVictoria() {
    $('.carta').off("click");
    var popup = $('<div class="popup"></div>');
    popup.html(`
        <div class="popup-content">
            <h2>You win!</h2>
            <p>Congratulation!</p>
            <button id="returnMenu">Return to menu</button>
        </div>
    `);

    $('body').append(popup);

    $('#returnMenu').on('click', function() {
        location.reload();
    });
}

function tauler() {
       
    switch(chosenDeck) {
        case 'cute':
            ampladaCarta = 80;
            alcadaCarta = 120;
            break;
        case 'pokemon':
            ampladaCarta = 111;
            alcadaCarta = 111;
            break;
        case 'poker':
            ampladaCarta = 79;
            alcadaCarta = 123;
            break;
    }

    ampladaTauler = ampladaCarta + 40;
    alcadaTauler = alcadaCarta + 40;
    // mida del tauler
    $("#tauler").css({
        //modificat perquè la mida del tauler es modifiqui segons el nombre de cartes
        "width" : (ampladaTauler * nColumnes) - separacioH*(nColumnes-1) + "px",
        "height": (alcadaTauler * nFiles) - separacioV*(nFiles-1) + "px"
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fillArrayCartes() {
    var numPairs = (nFiles * nColumnes) / 2;
    var cardIndices = [];
    var size = 52;

    switch(chosenDeck) {
        case 'pokemon':
            size = 23;
            break;
    }

    for (var i = 1; i <= size; i++) {
        cardIndices.push(i);
    }

    //console.log(numPairs);
    //console.log(cardIndices);

    shuffleArray(cardIndices);
    //console.log(cardIndices);

    jocCartes = [];

    for (var j = 0; j < numPairs; j++) {
        jocCartes.push('carta' + cardIndices[j]);
        jocCartes.push('carta' + cardIndices[j]);
        //console.log(jocCartes);
    }

    shuffleArray(jocCartes);
    //console.log(jocCartes);
}

function baralla(event) {
    var carta = document.querySelectorAll(".tipusCartes")
    //console.log(carta);
    carta.forEach(img => img.classList.remove("seleccionat"));
    event.target.classList.add("seleccionat");
}

function dificultat (dificultat, event) {
    var dificultatBotons = document.querySelectorAll(".dificultat")
    //console.log(dificultatBotons);
    dificultatBotons.forEach(btn => btn.classList.remove("seleccionat"));
    event.target.classList.add("seleccionat");

    seleccio(dificultat);
}

function checkButtons() {
    
    var menu = document.getElementById("menu");
    var joc = document.getElementById("joc");

    var dificultatSeleccionada = document.querySelector(".dificultat.seleccionat");
    var cartaSeleccionada = document.querySelector(".tipusCartes.seleccionat");

    if (dificultatSeleccionada && cartaSeleccionada) {
        joc.style.display = "block";
        menu.style.display = "none";

        return true;
    }

}

function comencarJoc () {

    if(checkButtons()) {
        selectorFons();
        fillArrayCartes();
        creacioCartes();
        gestioParelles();
        tauler();
        playMusic();
        temps();
    } else {
        //console.log("Botons no seleccionats");
    }
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);
        timer--;

        if (timer < 0) {
            clearInterval(interval);
            popupTime(); // Mostrar el pop-up
        }
    }, 1000);
}

function temps() {
    var fiveMinutes = nFiles/2 * 90,
        display = jQuery('#time');
    startTimer(fiveMinutes, display);
};

function chooseDeck(deck, event) {

    var styleElements = document.querySelectorAll("style");

    styleElements.forEach(function(styleElement) {
        styleElement.parentNode.removeChild(styleElement);
    });

    chosenDeck = deck;

    baralla(event)

    var styleTag = $('<style></style>');
    var css = '';
    switch(deck) {
        case 'cute':
            css+='.carta { width: 80px; height: 120px; }\n'
            css+='.darrera { background: #999 url(images/deck.png) 0px -480px }\n.davant { background: #efefef url(images/deck.png);\n transform: rotate3d(0,1,0,-180deg);}\n'
            break;
        case 'pokemon':
            css+='.carta { width: 111px; height: 111px; }\n'
            css+='.darrera { background: #999 url(images/pokemon.jpg) 0px 111px }\n.davant { background: #999 url(images/pokemon.jpg);\n transform: rotate3d(0,1,0,-180deg);}\n'
            break;
        case 'poker':
            css+='.carta { width: 79px;	height: 123px; }\n'
            css+='.darrera { background: #999 url(images/poker1.png) 0px -493px }\n.davant { background: #999 url(images/poker1.png);\n transform: rotate3d(0,1,0,-180deg);}\n'
            break;
    }
    styleTag.text(css);
    $('head').append(styleTag);

    addCSSClassesDeck(deck);
}

function addCSSClassesDeck(deck) {
    var styleTag = $('<style></style>');
    var css = '';
    var num = 1;

    switch(deck) {
        case 'cute':
            while(num <= 52) {
                for (var i = 0; i < 4; i++) {
                    var position2 = i * (-120);
                    for(var j = 0; j < 13; j++) {
                        var position = j * (-80);
                        css += '.carta' + num + ' {background-position: ' + position + 'px ' + position2 + 'px;}\n'; 
                        num++;
                    }
                }
            }
        break;
        
        case 'pokemon':
            while(num < 23) {
                for(var i = 0; i < 3; i++) {
                    var position2 = i * (-111);
                    for(var j = 0; j < 8; j++) {
                        var position = j * (-111);
                        css += '.carta' + num + '{background-position: ' + position + 'px ' + position2 + 'px;}\n';
                        num++;
                    }
                }
            }
        break;

        case 'poker':
            while(num <= 52) {
                for (var i = 0; i < 4; i++) {
                    var position2 = i * (-123);
                    for(var j = 0; j < 13; j++) {
                        var position = j * (-79);
                        css += '.carta' + num + ' {background-position: ' + position + 'px ' + position2 + 'px;}\n'; 
                        num++;
                    }
                }
            }
        break;
    }
    

    styleTag.text(css);
    $('head').append(styleTag);
}

function muteMusic() {
    musica.muted = !musica.muted;    var muteButton = document.getElementById('muteButton');
    if (musica.muted) {
        muteButton.classList.add('muted');
    } else {
        muteButton.classList.remove('muted');
    }
}

var soClick = new Audio('so/tap.mp3');
var soParella = new Audio('so/pair.mp3');
var musica = new Audio('so/music.mp3');
var turn = new Audio('so/turn.mp3');
musica.loop = true;

function playSoClick() {
    soClick.play();
}

function playSoParella() {
    soParella.currentTime = 0;
    soParella.play();
}

function playMusic() {
    musica.play();
}

function playTurn() {
    turn.play();
}