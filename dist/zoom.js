"use strict";

// Copyright (c) 2009 Dario Giovannetti
//
// EFFETTUA UNO ZOOM SU UN ELEMENTO <img>
// img: l'elemento <img> su cui applicare lo zoom
// mag: variazione percentuale di dimensioni dell'oggetto (senza distorsione) (positivo per ingrandimenti, negativo per riduzioni) (AL MOMENTO NON È UTILIZZATA!!!)
// frameW: larghezza del bordo colorato intorno all'immagine
// frameC: colore del bordo intorno all'immagine
// minMarg: margine minimo da garantire intorno all'immagine (in pixel)
// scrBar: ingombro della scroll bar verticale nella finestra del browser (in pixel)
// TODO BUG:
// se si fa lo zoom su un'immagine quando un altro zoom era già aperto, quello precedente dovrebbe chiudersi, invece al momento si accavallano tutti
// onresize window riadattare le dimensioni dell'immagine zoomata
// rendere la pagina intorno all'immagine più opaca
// bordo colorato intorno all'immagine:
//         fare un'ombra?
//         renderlo semitrasparente con un div in secondo piano settato con opacity?
//         stondare gli angoli?
// argomento mag: permettere la scelta di dimensioni fisse (px, pt...) e anche altre (em...)
// argomento mag: permettere variazioni diverse per larghezza e altezza (distorsione)
module.exports = function zoom(img, mag, frameW, frameC, minMarg, scrBar) {
  // Controlla che l'elemento esista e sia un <img>
  if (img && img.tagName === 'IMG') {
    // Crea il nuovo elemento <img>
    var zimg = document.createElement('img'); // Assegna gli attributi

    zimg.id = 'zoom';
    zimg.setAttribute('src', img.getAttribute('src'));
    zimg.setAttribute('alt', img.getAttribute('alt'));
    var rappLatiWin = window.innerWidth / window.innerHeight;
    var winWidth = window.innerWidth;
    var winHeight = window.innerHeight;
    var rappLati = zimg.width / zimg.height; // Ridimensionamento basato sulla larghezza

    if (rappLati >= rappLatiWin && zimg.width + 2 * (frameW + minMarg) + scrBar > winWidth) {
      zimg.width = winWidth - 2 * (frameW + minMarg) - scrBar;
      zimg.height = zimg.width / rappLati; // Ridimensionamento basato sull'altezza
    } else if (rappLati < rappLatiWin && zimg.height + 2 * (frameW + minMarg) > winHeight) {
      zimg.height = winHeight - 2 * (frameW + minMarg);
      zimg.width = zimg.height * rappLati;
    } // Stile dell'immagine zoomata


    zimg.style.position = 'fixed';
    zimg.style.top = '50%';
    zimg.style.marginTop = '-' + (zimg.height / 2 + frameW) + 'px';
    zimg.style.left = '50%';
    zimg.style.marginLeft = '-' + (zimg.width / 2 + frameW) + 'px';
    zimg.style.border = frameW + 'px solid ' + frameC; // Onclick per la chiusura

    zimg.onclick = new Function('this.parentNode.removeChild(this); return false;');
    zimg.style.cursor = 'pointer'; // Rimuovi l'eventuale immagine zoomata precedente

    if (document.getElementById('zoom')) {
      document.body.removeChild(document.getElementById('zoom'));
    } // Appendi la nuova immagine zoomata


    document.body.appendChild(zimg);
  }
};