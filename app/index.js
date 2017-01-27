// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// require('./startup');
const nlp = require('../nlp-libs');
const db  = require('./db');

// const menu = document.getElementById('ctmu');
// function getPosition(e) {
//   var posx = 0;
//   var posy = 0;
//
//   if (!e) var e = window.event;
//
//   if (e.pageX || e.pageY) {
//     posx = e.pageX;
//     posy = e.pageY;
//   } else if (e.clientX || e.clientY) {
//     posx = e.clientX + document.body.scrollLeft +
//                        document.documentElement.scrollLeft;
//     posy = e.clientY + document.body.scrollTop +
//                        document.documentElement.scrollTop;
//   }
//
//   return {
//     x: posx,
//     y: posy
//   }
// }
//
// function positionMenu(e) {
//   clickCoords = getPosition(e);
//   clickCoordsX = clickCoords.x;
//   clickCoordsY = clickCoords.y;
//
//   menuWidth = menu.offsetWidth + 4;
//   menuHeight = menu.offsetHeight + 4;
//
//   windowWidth = window.innerWidth;
//   windowHeight = window.innerHeight;
//
//   if ( (windowWidth - clickCoordsX) < menuWidth ) {
//     menu.style.left = windowWidth - menuWidth + "px";
//   } else {
//     menu.style.left = clickCoordsX + "px";
//   }
//
//   if ( (windowHeight - clickCoordsY) < menuHeight ) {
//     menu.style.top = windowHeight - menuHeight + "px";
//   } else {
//     menu.style.top = clickCoordsY + "px";
//   }
// }
//
// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.style.visibility = 'visible';
//   // menu.popup(remote.getCurrentWindow())
// }, false)

window.hst = nlp.hash_table;

var app = new Vue({
  el: '#app',
  data: {
    show_gram: '1',
    analyize_sentence: 'နိုင်ငံတော်အမှတ်တံဆိပ်',
    analyized_sentence: ''
  },

  methods: {

    hlightlight: function (syllables, color) {
      color = color || 'yellow';
      if (parseInt(this.show_gram) <= syllables.length)
        return `<span class='hl ${color}'>${syllables.join('')}</span>`;
      else
        return syllables.join('')
    },
    analyize: function () {
      // return '';
      var sentence = nlp.syllable(this.analyize_sentence);
      var space_break = sentence.split(' ');

      space_break = space_break.map((small_sentence) => {
        let prep = '';
        let syllables = small_sentence.split('\u200b');

        let tempRef;
        let temp = [];
        let subgram = [];

        let i = 0;

        while (syllables.length > 0) {
          let f = syllables.slice(0,1);
          let fmatch;

          i++;
          if (i > 20000){
            console.log(f)
            console.log(temp)
            console.log(subgram)
            console.log(prep);
            break;
          }


          // console.log(f);
          // console.log(temp.join('|'), subgram)
          // console.log(prep);

          if (!tempRef) {
            // First time
            fmatch = nlp.hash_table[f];

            if (fmatch) {
              temp.push(syllables.shift()); // remove and continue
              tempRef = fmatch;
              continue;
            } else {

              // Output uni-gram case only
              // prep += this.hlightlight([f]);
              prep += f;

              // Reset temps
              tempRef = null;
              temp = [];
              subgram = [];

              syllables.shift(); // remove and continue
              continue;
            }

          } else {
            // Find on reference
            fmatch = tempRef[f];

            if (subgram.length === 0 && (!fmatch || !fmatch.isOwnGram) && tempRef.isOwnGram)
              subgram = temp.slice();

            // When nested found
            if (fmatch) {
              temp.push(syllables.shift()); // remove and continue
              tempRef = fmatch;
              continue;
            } else {
              // Nested not found

              if (tempRef.isOwnGram) {
                // Add to result
                prep += this.hlightlight(temp);;

                // Reset temps
                tempRef = null;
                temp = [];
                subgram = []; // TODO: when hight both possibility, subgram cant' be ignore here
                // syllables.shift(); // without remove, but continue
                continue;
              } else {

                if (subgram.length > 0) {

                  prep += this.hlightlight(subgram);
                  syllables = (temp.slice(subgram.length)).concat(syllables);

                  // Reset temps
                  tempRef = null;
                  temp = [];
                  subgram = [];

                  // syllables = syllables.slice(0, subgram.length);
                  continue;
                } else {

                  prep += temp.join('');

                  // Reset temps
                  tempRef = null;
                  temp = [];
                  subgram = [];
                  continue;
                }

                // syllables = temp.concat(syllables);
                // // Concat again
                //
                // // Reset temps
                // tempRef = null;
                // temp = [];
                // // syllables.shift(); // without remove, but continue
                // continue;
              }
            }
          }
        }

        return prep;
      })

      return space_break.join(' ');
    },
    add_selected: () => {

    }
  }
})
