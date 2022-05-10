"use strict";
var W = 10;		//幅
var H = 10;		//高さ
var BOMB = 10;	//爆弾数
var cell = [];	//タイル
var opened = 0;	//開いたタイル数

//読み込み時実行関数
function init() {
	//mainIDを持つtable要素への参照を取得
	var main = document.getElementById("main");
	//tr要素(行)を動的に作成
	for (var i = 0; i < H; i++) {
		cell[i] = [];
		var tr = document.createElement("tr");
		//td要素(列)を動的に作成
		for (var j = 0; j < W; j++) {
			var td = document.createElement("td");
			//ハンドラーを登録
			td.addEventListener("click", click);
			//スタイルを適用するようclass属性を指定
			td.className = "cell";
			//どこがクリックされたか判定用にyプロパティ及びxプロパティを追加
			td.y = i;
			td.x = j;
			cell[i][j] =td;
			tr.appendChild(td);
		}
		main.appendChild(tr);
	}

	//爆弾を配置
	for (var i = 0; i < BOMB; i++) {
		while (true) {
			var x = Math.floor(Math.random() * W);
			var y = Math.floor(Math.random() * H);
			if (!cell[x][y].bomb) {
				cell[x][y].bomb = true;
				//cell[x][y].textContent = "*";
				break;
			}
		}
	}
}

//座標の周囲にいくつの爆弾があるか返す
function count(x, y) {
	var b = 0;
	for (var j = y - 1; j <= y + 1; j++) {
		for (var i = x - 1; i <= x + 1; i++) {
			//iとjがマス目の外になった場合に爆弾を数えない
			if (cell[j] && cell[j][i]) {
				if (cell[j][i].bomb) b++;
			}
		}
	}
	return b;
}

//x,yの場所のマスを開く
function open(x, y) {
	for (var j = y - 1; j <= y + 1; j++) {
		for (var i = x - 1; i <= x + 1; i++) {
			if (cell[j] && cell[j][i]) {
				var c = cell[j][i];
				//既に開かれているもしくは爆弾が存在する場合は何もせず処理継続
				if (c.opened || c.bomb) {
					continue;
				}
				flip(c);
				//座標周囲の爆弾の数を調べる
				var n = count(i, j);
				//爆弾が0
				if (n == 0) {
					open(i, j);
				} else {
					c.textContent = n;
				}
			}
		}
	}
}

//マス目を開く
function flip(cell) {
	//「td.cell{…}」と「td.open{…}」の両方のスタイルを適用
	cell.className = "cellopen";
	cell.opened = true;
	//すべてのマスをオープンできた場合
	if (++opened >= (W * H - BOMB)) {
		document.getElementById("title").textContent = "Good Job!";
	}
}

//イベントハンドラー
function click(e) {
	var src = e.currentTarget;
	//もし爆弾があった場合
	if (src.bomb) {
		//すべてのセルをチェックして爆弾がある箇所に「+」を表示
		cell.forEach(function(tr) {
			tr.forEach(function (td) {
				if (td.bomb) {
					td.textContent = "+";
				}
			})
		});
		//タイトルを変更
		document.getElementById("title").textContent = "Game Over";
	} else {
		open(src.x, src.y);
	}
}
