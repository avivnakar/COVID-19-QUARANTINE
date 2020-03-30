'use strict';

console.log('uut.js access has been preformed, this unit is used only for testing');

/*insert question*/

//Unit Testing

//------------------------------------------------------------//

// function  funcName( ) {
// }

// var mat=new Array (4);
// var i=4;
// while(i--){
//     mat[i]=new Array(4);
// }

function smileyClicked(){
    restart();
}

// function renderHint(i, j) {

//     for (var idx = i - 1; idx < i + 2; idx++) {
//         for (var jdx = j - 1; jdx < j + 2; jdx++) {
//             if (idx < 0 || jdx < 0 || (idx === i && jdx === j)) continue;
//             if (idx >= gBoard.length || jdx >= gBoard[0].length) continue;
//             var cell = gBoard[idx][jdx];
//             cell.isShown = true;
//             renderCell(getElCell(idx, jdx), idx, jdx);
//             setTimeout(() => {
//                 cell.isShown = false;
//                 renderCell(getElCell(idx, jdx), idx, jdx);
//             }, 1000);
//         }
//     }
// }