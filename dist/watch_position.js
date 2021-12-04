"use strict";
if (!navigator.geolocation)
    alert("Geolocationは使用不可能です");
/** startでwatchPosition開始、stopで終了 */
class WatchPosition {
    constructor() {
        /**
         * テーブル行をループする共通処理。
         * 引数としてループごとのth,tdを使用することができる。
         */
        this.tableRowsLoop = (func) => {
            const watchPositionTable = document.getElementById("watch-position-table");
            for (let row of watchPositionTable.rows) {
                let th = row.cells[0];
                let td = row.cells[1];
                func(th, td);
            }
        };
        /**
         * tdにwatch情報を書き込む処理。現在の書き込み対象は下記の通り
         * 行 | 値
         * lat = this._position.lat
         * lng = this._position.lng
         * count = this._count
         * */
        this.writeInfoToTable = () => {
            const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = this._pos.coords;
            this.tableRowsLoop((th, td) => {
                switch (th.textContent) {
                    case "lat":
                        td.textContent = String(latitude);
                        break;
                    case "lng":
                        td.textContent = String(longitude);
                        break;
                    case "accuracy":
                        td.textContent = String(accuracy);
                        break;
                    case "heading":
                        td.textContent = String(heading);
                        break;
                    case "altitude":
                        td.textContent = String(altitude);
                        break;
                    case "altitudeAccuracy":
                        td.textContent = String(altitudeAccuracy);
                        break;
                    case "speed":
                        td.textContent = String(speed);
                        break;
                    case "count":
                        td.textContent = String(this._count++);
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
            this.tableRowsLoop((th, td) => {
                switch (th.textContent) {
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
            this._watchId = navigator.geolocation.watchPosition((pos) => {
                this._pos = pos;
                map.setMarkerAndCircle(pos);
                this.writeInfoToTable();
            }, (e) => this.writeErrorToTable(e), options);
        };
        // watchPosition終了
        this.stop = () => {
            this.tableRowsLoop((_, td) => {
                td.textContent = "";
            });
            navigator.geolocation.clearWatch(this._watchId);
            this._watchId = 0;
            this._count = 0;
            this._pos = undefined;
        };
        this._watchId = 0;
        this._count = 0;
    }
    /**
     * 現在のlatlngを取得する。
     * posがundefinedの場合はgetCurrentPositionを実行し、その値を返す
     * */
    get getCurrentLatLngLiteral() {
        var _a, _b;
        let lat = (_a = this._pos) === null || _a === void 0 ? void 0 : _a.coords.latitude;
        let lng = (_b = this._pos) === null || _b === void 0 ? void 0 : _b.coords.longitude;
        return new Promise((resolve, reject) => {
            if (!lat || !lng) {
                loadingModal.start();
                navigator.geolocation.getCurrentPosition((pos) => {
                    map.setMarkerAndCircle(pos);
                    lat = pos.coords.latitude;
                    lng = pos.coords.longitude;
                    loadingModal.stop();
                    resolve({ lat, lng });
                }, (e) => {
                    loadingModal.stop();
                    reject(e);
                }, { enableHighAccuracy: true, timeout: 10000 });
            }
            else {
                resolve({ lat, lng });
            }
        });
    }
}
const watchPosition = new WatchPosition();
