const STORAGE_KEY = 'seedAppData';

//初期化
export function initializeData() {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    
    if (!dataStr) {
        console.log('📝 データを初期化します');
        
        const initialData = {
            seeds: [],
            growingIdeas: [],
            witheredIdeas: []
        };
        
        saveData(initialData);
        return initialData;
    }
    
    return JSON.parse(dataStr);
}

//データ取得
export function getData() {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    
    if (!dataStr) {
        console.log('⚠️ データがないので初期化します');
        return initializeData();
    }
    
    try {
        const data = JSON.parse(dataStr);
        console.log('📂 データを読み込みました');
        return data;
    } catch (error) {
        console.error('❌ データの読み込みに失敗しました:', error);
        return initializeData();
    }
}

//データ保存
export function saveData(data) {
    try {
        const jsonString = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, jsonString);
        console.log('💾 データを保存しました');
        return true;
    } catch (error) {
        console.error('❌ 保存に失敗しました:', error);
        alert('データの保存に失敗しました');
        return false;
    }
}

//今日の日付
export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    return `${year}年${month}月${day}日`;
}

//ユニークID生成
export function generateUniqueId() {
    const data = getData();
    let id = Date.now();
    
    // すべてのIDを取得
    const allIds = [
        ...data.seeds.map(s => s.id),
        ...data.growingIdeas.map(s => s.id),
        ...data.witheredIdeas.map(s => s.id)
    ];
    
    // 重複しないまで増やす
    while (allIds.includes(id)) {
        id++;
    }
    
    return id;
}

//種を追加
export function addSeed(text) {
    if (!text || text.trim() === '') {
        alert('アイデアを入力してください');
        return null;
    }
    
    const data = getData();
    
    const newSeed = {
        id: generateUniqueId(),
        text: text.trim(),
        date: getTodayDate(),
        stage: 'seed'
    };
    
    data.seeds.push(newSeed);
    saveData(data);
    
    console.log('✅ 種を追加しました:', newSeed);
    return newSeed;
}

//種をIDで検索
export function findSeedById(seedId) {
    const data = getData();
    
    // すべての配列から検索
    let seed = data.seeds.find(s => s.id === seedId);
    if (seed) return { seed, location: 'seeds' };
    
    seed = data.growingIdeas.find(s => s.id === seedId);
    if (seed) return { seed, location: 'growingIdeas' };
    
    seed = data.witheredIdeas.find(s => s.id === seedId);
    if (seed) return { seed, location: 'witheredIdeas' };
    
    console.error('❌ 種が見つかりません:', seedId);
    return null;
}

//種を「育てる」に移動
export function moveSeedToGrowing(seedId) {
    const data = getData();
    
    // seedsから削除
    const index = data.seeds.findIndex(s => s.id === seedId);
    
    if (index === -1) {
        console.error('❌ 種が見つかりません');
        return false;
    }
    
    const seed = data.seeds.splice(index, 1)[0];
    
    // growingIdeasに追加
    seed.stage = 'growing';
    seed.progress = [];  // 空の進捗配列を初期化
    data.growingIdeas.push(seed);
    
    saveData(data);
    console.log('✅ 種を「育てる」に移動しました:', seed);
    
    return true;
}

//種を「枯れた」に移動
export function moveSeedToWithered(seedId) {
    const data = getData();
    
    // seedsから削除
    const index = data.seeds.findIndex(s => s.id === seedId);
    
    if (index === -1) {
        console.error('❌ 種が見つかりません');
        return false;
    }
    
    const seed = data.seeds.splice(index, 1)[0];
    
    // witheredIdeasに追加
    seed.stage = 'withered';
    data.witheredIdeas.push(seed);
    
    saveData(data);
    console.log('✅ 種を「枯れた」に移動しました:', seed);
    
    return true;
}

//進捗を追加
export function addProgress(seedId, note, rating) {
    if (!note || note.trim() === '') {
        alert('進捗を入力してください');
        return false;
    }
    
    if (rating < 1 || rating > 10) {
        alert('評価は1〜10の範囲で入力してください');
        return false;
    }
    
    const data = getData();
    
    // growingIdeasから検索
    const seed = data.growingIdeas.find(s => s.id === seedId);
    
    if (!seed) {
        console.error('❌ 育てている種が見つかりません');
        alert('種が見つかりません');
        return false;
    }
    
    // progressが無ければ初期化
    if (!seed.progress) {
        seed.progress = [];
    }
    
    // 新しい進捗
    const newProgress = {
        note: note.trim(),
        rating: parseInt(rating),
        date: getTodayDate()
    };
    
    // 先頭に追加（新しい順）
    seed.progress.unshift(newProgress);
    
    saveData(data);
    console.log('✅ 進捗を追加しました:', newProgress);
    
    return true;
}

//統計情報取得
export function getStatistics() {
    const data = getData();
    
    return {
        totalSeeds: data.seeds.length,
        totalGrowing: data.growingIdeas.length,
        totalWithered: data.witheredIdeas.length,
        totalIdeas: data.seeds.length + data.growingIdeas.length + data.witheredIdeas.length,
        totalProgress: data.growingIdeas.reduce((sum, seed) => {
            return sum + (seed.progress ? seed.progress.length : 0);
        }, 0)
    };
}

initializeData();

console.log('📦 storage.js が読み込まれました');
console.log('使える関数:', {
    getData: 'データ取得',
    saveData: 'データ保存',
    addSeed: '種を追加',
    findSeedById: 'IDで検索',
    moveSeedToGrowing: '育てるに移動',
    moveSeedToWithered: '枯れたに移動',
    addProgress: '進捗を追加',
    getStatistics: '統計情報',
    getTodayDate: '今日の日付',
    showDebugInfo: 'デバッグ情報',
    resetAllData: 'データリセット',
    exportData: 'エクスポート',
    importData: 'インポート'
});