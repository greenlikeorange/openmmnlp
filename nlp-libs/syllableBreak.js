'use strict';

var Cconsonents = [
  '\u1000',  '\u1001',
  '\u1002',  '\u1003',
  '\u1004',  '\u1005',
  '\u1006',  '\u1007',
  '\u1008',  '\u1009',
  '\u1010',  '\u100a',
  '\u100b',  '\u100c',
  '\u100d',  '\u100e',
  '\u100f',  '\u1010',
  '\u1011',  '\u1012',
  '\u1013',  '\u1014',
  '\u1015',  '\u1016',
  '\u1017',  '\u1018',
  '\u1019',  '\u101a',
  '\u101b',  '\u101c',
  '\u101d',  '\u101e',
  '\u101f',  '\u1020',
  '\u1021'
];

//var Cconsonents = /[\u1000-\u1021]/g;

var Mmedials = ['\u103b', '\u103c', '\u103d', '\u103e'];
var VdepVowelSigns = ['\u102b', '\u102c', '\u102d', '\u102e', '\u102f', '\u1030', '\u1031', '\u1032'];
var SmyaSignVirama = '\u1039';
var AmyaSignAsat = '\u103a';
var FdepVariousSigns = ['\u1036', '\u1037', '\u1038'];
var IindepVowels = ['\u1024', '\u1027','\u102A', '\u104C','\u104D','\u104F'];
var EindepVowels = ['\u1023','\u1025','\u1026','\u1029','\u104E'];
var GmyaGreatSa = '\u103f';
var DmyaDigits = ['\u1040','\u1041','\u1042','\u1043','\u1044','\u1045','\u1046','\u1047','\u1048','\u1049' ];
var PpuncMarks = ['\u104A','\u104B' ];
var WwhiteSpace = '\u0020';

var defkeys = ['A','C','D','E','F','G','I','M','P','S','V','W','O'];
var t2keys = ["AC","CC","EC","FC","MC","VC"];
var t3keys = ["ACM","FCM","VCM"];

var B = '\u200b';

//letter sequence table
var lstable1 = [
  ['-1','1','1','1','0','-1','1','0','1','0','0','1','1'],
  ['0', 'U', '1', '1', '0', '0', '1', '0', '1', '0', '0', '1','1'],
  ['-1', '1', '0', '1', '-1', '-1', '1', '-1', '1', '-1', '-1', '1','1'],
  ['-1', 'U', '1', '1', '2', '0', '1', '-1', '1', '-1', '0', '1','1'],
  ['0', '1', '1', '1', '2', '-1', '1', '-1', '1', '-1', '-1', '1','1'],
  ['-1', '1', '1', '1', '0', '-1', '1', '-1', '1', '-1', '0', '1','1'],
  ['-1', '1', '1', '1', '-1', '-1', '1', '-1', '1', '-1', '-1', '1','1'],
  ['2', 'U', '1', '1', '0', '0', '1', '0', '1', '-1', '0', '1','1'],
  ['-1','1', '1', '1', '-1', '-1', '1','-1', '1', '-1', '-1', '1','1'],
  ['-1', '0', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1','1'],
  ['2', 'U', '1' ,'1','0' ,'0' ,'1', '-1', '1', '-1','0', '1','1'],
  ['-1', '1', '1', '1', '-1', '-1', '1', '-1', '1', '-1', '-1', '0', '1'],
  ['1' ,'1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0']
];
//UPDATE
//fa => 0 from -1 to support ့် and ့်
//ac => 1 from U to support ချစ်လျှက်

var lstable2 = [
  ['3', '1', '1', '1', '1', '1', '1', 'U', '1', '1', '1', '1', '1'],
  ['0', '1', '1', '1', '1', '1', '1', '1', '1', '0', '1', '1', '1'],
  ['0', '1', '1', '1', '1', '1', '1', '1', '1', '0', '1', '1', '1'],
  ['3', '1', '1', '1', '1', '1', '1', 'U', '1', '1', '1', '1', '1'],
  ['0', '1', '1', '1', '1', '1', '1', '1', '1', '0', '1', '1', '1'],
  ['0', '1', '1', '1', '1', '1', '1', 'U', '1', '0', '1', '1', '1']
];

var lstable3 = [
  ['4' ,'1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['4' ,'1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
  ['4' ,'1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1']
];

function processSegmentation(R){
  var L = "";
  var searchWordCount = 2;

  while(true){
    if(R === null || R.length === 0){
      // console.log("R length is zero")
      // console.log("Result : " + L);
      return L;
    }

    if(R.length === 1){
      L = L + R[0] + B;
      R = null;
      // console.log("R length is one");
      // console.log("Result : " + L);
      return L;
    }

    var val = calculateVal(R, L, searchWordCount);

    //if 'U' continue
    switch(val){
      case '-1':
        L = L + R[0] + R[1] + '?';
        R.shift();
        break;

      case '0':
        L = L + R[0];
        R.shift();
        break;

      case '1':
        L = L + R[0] + B;
        R.shift();
        break;

      case '2':
        L = L + R[0] + R[1] + B;
        R.shift();
        R.shift();
        break;

      case '3':
        L = L + R[0] + R[1] + R[2] + B;
        R.shift();
        R.shift();
        R.shift();
        break;

      default:
        //no more to do
        if(searchWordCount === 4){
          L = L +R[0] + R[1] + R[2] + R[3] + B;
          R.shift();
          R.shift();
          R.shift();
          R.shift();
        }
    }
    if(val === 'U'){
      searchWordCount++;
    }else{
      searchWordCount = 2;
    }

  }
}

function calculateVal(R, L, searchWordCount){
  var index1, index2;
  var val;
  var k1, k2, k3, k4;
  if(searchWordCount === 2){
    k1 = getKey(R[0]);
    k2 = getKey(R[1]);
    index1 = defkeys.indexOf(k1);
    index2 = defkeys.indexOf(k2);
    val = lstable1[index1][index2];
    if(R.length <= 2 && val === 'U'){
      val = '1';
    }

  }else if(searchWordCount === 3){
    k1 = getKey(R[0]);
    k2 = getKey(R[1]);
    k3 = getKey(R[2]);
    index1 = t2keys.indexOf(k1+k2);
    index2 = defkeys.indexOf(k3);

    val = lstable2[index1][index2];

    if(R.length <= 3 && val === 'U'){
      val = '1';
    }

  }else if(searchWordCount === 4){
    k1 = getKey(R[0]);
    k2 = getKey(R[1]);
    k3 = getKey(R[2]);
    k4 = getKey(R[3]);
    index1 = t3keys.indexOf(k1+k2+k3);
    index2 = defkeys.indexOf(k4);
    val = lstable3[index1][index2];
  }

  return val;
}

//'A','C','D','E','F','G','I','M','P','S','V','W'
function getKey(k){
  if(AmyaSignAsat === k){
    return 'A';
  }
  else if(Cconsonents.includes(k)){
    return 'C';
  }
  else if(DmyaDigits.includes(k)){
    return 'D';
  }
  else if(EindepVowels.includes(k)){
    return 'E';
  }
  else if(FdepVariousSigns.includes(k)){
    return 'F';
  }
  else if(GmyaGreatSa === k){
    return 'G';
  }
  else if(IindepVowels.includes(k)){
    return 'I';
  }
  else if(Mmedials.includes(k)){
    return 'M';
  }
  else if(PpuncMarks.includes(k)){
    return 'P';
  }
  else if(SmyaSignVirama === k){
    return 'S';
  }
  else if(VdepVowelSigns.includes(k)){
    return 'V';
  }
  else if(WwhiteSpace === k){
    return 'W';
  }else{
    return 'O';//for other characters
  }
}

const rules = [
  [/(\u103A)(\u1037)/g, "$2$1"],
  [/([\u1000-\u1021\u1023-\u1027\u1029\u102a\u103f\u104c-\u104f])/g, "\u200B$1"],
  [/([\u0009-\u000d\u0020\u00a0\u2000-\u200a\u2028\u2029\u202f]|>|\u201C|\u2018|\-|\(|\[|{|[\u2012-\u2014]|\u1039)\u200B([\u1000-\u1021])/g, "$1$2"],
  [/\u200B(\u1004\u103A\u1039)/g, "$1"],
  [/\u200B([\u1000-\u1021]\u103A)/g, "$1"],
  [/(\s|\n)\u200B([\u1000-\u1021\u1023-\u1027\u1029\u102a\u103f\u104c-\u104f])/g, "$1$2"]
];

const syllBreak = (text) => {
  rules.forEach((rule) => {
    text = text.replace(rule[0], rule[1]);
  });
  return text;
}

module.exports = (text) => {
  return processSegmentation(text.split(''))
  // return syllBreak(text);
}
