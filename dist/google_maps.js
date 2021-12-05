"use strict";
class GoogleMap {
    constructor() {
        this._map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: { lat: 35.68141047521827, lng: 139.76712479779854 },
            disableDefaultUI: true,
        });
        this.initCurrentPositionButton();
    }
    /** 現在地ボタンを作成し、マップコントロールに表示させる */
    initCurrentPositionButton() {
        const currentPositionButton = document.createElement("button");
        currentPositionButton.classList.add("btn", "btn-danger");
        currentPositionButton.textContent = "現在位置に移動";
        currentPositionButton.addEventListener("click", () => {
            watchPosition.getCurrentLatLngLiteral
                .then((latlng) => this._map.setCenter(latlng))
                .catch((e) => alert(e.message));
        });
        this._map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(currentPositionButton);
    }
    /** 現在地マーカーをセットする(マーカーが存在しなければ初期化、そうでなければ移動させる) */
    setCurrentPositionMarker(pos) {
        const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const svgMarker = {
            path: "m12 7.27 4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2 4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z",
            fillColor: "blue",
            fillOpacity: 0.6,
            strokeWeight: 0,
            rotation: pos.coords.heading,
            scale: 1,
        };
        if (!this._marker) {
            this._marker = new google.maps.Marker({
                position,
                map: this._map,
                icon: svgMarker,
            });
        }
        else {
            this._marker.setPosition(position);
            this._marker.setIcon(svgMarker);
        }
    }
    /** 誤差サークルをセットする(サークルが存在しなければ初期化、そうでなければ移動させる) */
    setAccuracyCircle(pos) {
        const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!this._circle) {
            this._circle = new google.maps.Circle({
                map: this._map,
                radius: pos.coords.accuracy,
                strokeColor: "#0088ff",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#0088ff",
                fillOpacity: 0.2,
                center
            });
        }
        this._circle.setCenter(center);
    }
    /** マーカーセットとサークルセットを合わせたメソッド */
    setMarkerAndCircle(pos) {
        this.setCurrentPositionMarker(pos);
        this.setAccuracyCircle(pos);
    }
    /** マーカーとサークル削除 */
    removeMarkerAndCircle() {
        var _a, _b;
        (_a = this._marker) === null || _a === void 0 ? void 0 : _a.setMap(null);
        (_b = this._circle) === null || _b === void 0 ? void 0 : _b.setMap(null);
        this._marker = undefined;
        this._circle = undefined;
    }
}
let map;
function initMap() {
    map = new GoogleMap();
}
