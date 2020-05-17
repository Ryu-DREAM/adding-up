'use strict';
const fs = require('fs');
const readline = require('readline');
//fs:FileSystem これはモジュール

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDateMap = new Map();
//以上の部分は popu-pref.csv ファイルから、ファイルを読み込みを行う
//Stream（ストリーム）を生成し、 さらにそれを readline オブジェクトの 
//input として設定し rl オブジェクトを作成しています。
//Stream とは、非同期で情報を取り扱うための概念で、情報自体ではなく情報の流れ



rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns [1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDateMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDateMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDateMap) {
        value.change = value.popu15/value.popu10;
    }
    const rankingArray = Array.from(prefectureDateMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
        );
      });


    console.log(rankingArray);
});
//rl オブジェクトで line というイベントが発生したら この無名関数を呼んでください