import {
    getData,
    moveSeedToGrowing,
    moveSeedToWithered
} from './storage.js';

console.log('📊 evaluate.js が読み込まれました');

let currentSeed = null;
let seedId = null;

window.addEventListener('DOMContentLoaded', function() {
    console.log('評価画面が読み込まれました');
    
    // URLパラメータから種のIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    seedId = parseInt(urlParams.get('id'));
    
    console.log('種のID:', seedId);
    
    // IDが不正な場合
    if (!seedId || isNaN(seedId)) {
        alert('種が選択されていません');
        goBack();
        return;
    }
    
    // 種を読み込む
    loadCurrentSeed();
    
    // 画面を表示
    if (currentSeed) {
        displaySeed();
    }
    
    // イベントリスナーを設定
    setupEventListeners();
});

function loadCurrentSeed() {
    // storage.js の関数を使ってデータ取得
    const data = getData();
    
    // seedsから該当する種を探す
    currentSeed = data.seeds.find(seed => seed.id === seedId);
    
    if (!currentSeed) {
        alert('種が見つかりませんでした');
        goBack();
        return;
    }
    
    console.log('現在の種:', currentSeed);
}

function displaySeed() {
    const display = document.getElementById('seed-to-evaluate');
    
    display.innerHTML = `
        <div class="seed-text">${currentSeed.text}</div>
        <div class="seed-date">${currentSeed.date}</div>
    `;
}

function handlePossible() {
    console.log('実現可能を選択');
    
    // storage.js の関数を使って移動
    const success = moveSeedToGrowing(seedId);
    
    if (success) {
        // 育成画面へ
        window.location.href = `index.html`;
    } else {
        alert('種の移動に失敗しました');
    }
}

function handleImpossible() {
    console.log('実現不可能を選択');
    
    // storage.js の関数を使って移動
    const success = moveSeedToWithered(seedId);
    
    if (success) {
        // ホーム画面へ
        window.location.href = 'index.html';
    } else {
        alert('種の移動に失敗しました');
    }
}

function setupEventListeners() {
    // 実現可能ボタン
    const possibleButton = document.getElementById('possible-button');
    possibleButton.addEventListener('click', handlePossible);
    
    // 実現不可能ボタン
    const impossibleButton = document.getElementById('impossible-button');
    impossibleButton.addEventListener('click', handleImpossible);
}

function goBack() {
    window.location.href = 'index.html';
}

window.goBack = goBack;