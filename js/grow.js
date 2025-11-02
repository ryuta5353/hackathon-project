import {
    getData,
    addProgress,
} from './storage.js';

let currentSeed = null;
let seedId = null;

window.addEventListener('DOMContentLoaded', function() {
    console.log('育成画面が読み込まれました');
    
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
        displayProgress();
    }
    
    // イベントリスナーを設定
    setupEventListeners();
});

function loadCurrentSeed() {
    // storage.js の関数を使ってデータ取得
    const data = getData();
    
    // growingIdeasから該当する種を探す
    currentSeed = data.growingIdeas.find(seed => seed.id === seedId);
    
    if (!currentSeed) {
        alert('種が見つかりませんでした');
        goBack();
        return;
    }
    
    console.log('現在の種:', currentSeed);
    
    // progressが無ければ初期化
    if (!currentSeed.progress) {
        currentSeed.progress = [];
    }
}

function displaySeed() {
    const display = document.getElementById('seed-display');
    
    display.innerHTML = `
        <div class="seed-text">${currentSeed.text}</div>
        <div class="seed-date">${currentSeed.date}</div>
    `;
}

function displayProgress() {
    const list = document.getElementById('progress-list');
    list.innerHTML = '';
    
    // 進捗がない場合
    if (!currentSeed.progress || currentSeed.progress.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 40px 20px; font-size: 16px;">まだ記録がありません</div>';
        return;
    }
    
    // 進捗を表示
    currentSeed.progress.forEach(item => {
        const card = createProgressCard(item);
        list.appendChild(card);
    });
    
    console.log('進捗を表示しました:', currentSeed.progress.length + '件');
}

function createProgressCard(text, rating) {
    
    const card = document.createElement('div');
    card.className = 'progress-item';
    
    
    let dots = '';
    for (let i = 1; i <= 10; i++) {
        if (i <= rating) {
            
            dots += '<div class="rating-dot filled"></div>';
        } else {
            
            dots += '<div class="rating-dot"></div>';
        }
    }
    
    
    card.innerHTML = `
        <div class="progress-text">${text}</div>
        <div class="progress-rating">
            <div class="rating-dots">${dots}</div>
            <span class="rating-score">${rating}/10</span>
        </div>
    `;
    
    
    return card;
}

function handleAddProgress() {
    const input = document.getElementById('progress-input');
    const slider = document.getElementById('rating-slider');
    
    const text = input.value.trim();
    const rating = parseInt(slider.value);
    
    // 入力チェック
    if (!text) {
        alert('❌ 進捗や意見を入力してください!');
        return;
    }
    
    console.log('進捗を追加:', text, '評価:', rating);
    
    // storage.js の関数を使って保存
    const success = addProgress(seedId, text, rating);
    
    if (success) {
        // currentSeedを再読み込み
        loadCurrentSeed();
        
        // 画面を更新
        displayProgress();
        
        // 入力欄をクリア
        input.value = '';
        slider.value = 5;
        document.getElementById('rating-display').textContent = 5;
        
        console.log('✅ 進捗を追加しました');
    }
}

function setupEventListeners() {
    // スライダーが動いたとき
    const slider = document.getElementById('rating-slider');
    const display = document.getElementById('rating-display');
    
    slider.addEventListener('input', function() {
        display.textContent = this.value;
    });
    
    // 記録を追加ボタン
    const addButton = document.getElementById('add-progress-button');
    addButton.addEventListener('click', handleAddProgress);
}

function goBack() {
    window.location.href = 'home.html';
}

window.goBack = goBack;


