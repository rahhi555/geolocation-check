"use strict";
if (!navigator.geolocation)
    alert("Geolocationは使用不可能です");
/** startでwatchPosition開始、stopで終了 */
class WatchPosition {
    constructor() {
        /** テーブル行をループする共通処理。引数にthTextとtdを引数に取る関数を入力する。 */
        this.tableRowsLoop = (func) => {
            const watchPositionTable = document.getElementById("watch-position-table");
            for (let row of watchPositionTable.rows) {
                let thText = row.cells[0].textContent;
                let td = row.cells[1];
                func(thText, td);
            }
        };
        // テーブルに位置情報を書き込む処理
        this.writePosToTable = (pos) => {
            this.tableRowsLoop((thText, td) => {
                switch (thText) {
                    case "lat":
                        td.textContent = String(pos.coords.latitude);
                        break;
                    case "lng":
                        td.textContent = String(pos.coords.longitude);
                        break;
                    case "count":
                        td.textContent = String(this.count++);
                        break;
                }
            });
        };
        // テーブルにエラーを書き込む処理
        this.writeErrorToTable = (e) => {
            const errorTd = document.getElementById("error-td");
            errorTd.textContent = e.message;
        };
        // フォームからオプション取得およびテーブルにオプション書き出し
        this.getAndWriteOptions = () => {
            // @ts-ignore
            const { enableHighAccuracy, timeout, maximumAge } = document.forms.options.elements;
            // ここでvalueを抽出しないと、後のInfinity代入でinputのtype属性が矛盾しエラーになる
            let options = {
                enableHighAccuracy: enableHighAccuracy.checked,
                timeout: timeout.value,
                maximumAge: maximumAge.value,
            };
            // timeoutが0ならInfinity代入
            options.timeout = Number.parseInt(options.timeout) || Infinity;
            // maximumAgeがマイナスならInfinity代入
            options.maximumAge =
                Math.sign(options.maximumAge) === 1 ? options.maximumAge : Infinity;
            this.tableRowsLoop((thText, td) => {
                switch (thText) {
                    case "enableHighAccuracy":
                        td.textContent = enableHighAccuracy.checked;
                        break;
                    case "timeout":
                        td.textContent = options.timeout;
                        break;
                    case "maximumAge":
                        td.textContent = options.maximumAge;
                        break;
                }
            });
            return options;
        };
        // watchPosition開始
        this.start = () => {
            const options = this.getAndWriteOptions();
            console.log(options);
            this.watchId = navigator.geolocation.watchPosition((pos) => this.writePosToTable(pos), (e) => this.writeErrorToTable(e), options);
        };
        // watchPosition終了
        this.stop = () => {
            this.tableRowsLoop((_, td) => {
                td.textContent = '';
            });
            this.watchId = 0;
            this.count = 0;
            navigator.geolocation.clearWatch(this.watchId);
        };
        this.watchId = 0;
        this.count = 0;
    }
}
const watchPosition = new WatchPosition();
