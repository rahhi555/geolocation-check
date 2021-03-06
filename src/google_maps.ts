class GoogleMap {
  private _map: google.maps.Map;
  private _marker?: google.maps.Marker;
  private _circle?: google.maps.Circle;

  constructor() {
    this._map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 17,
        center: { lat: 35.68141047521827, lng: 139.76712479779854 },
        disableDefaultUI: true,
      }
    );
    this.initCurrentPositionButton();
  }

  /** 現在地ボタンを作成し、マップコントロールに表示させる */
  private initCurrentPositionButton() {
    const currentPositionButton = document.createElement("button");
    currentPositionButton.classList.add("btn", "btn-danger");
    currentPositionButton.textContent = "現在位置に移動";

    currentPositionButton.addEventListener("click", () => {
      watchPosition.getCurrentLatLngLiteral
        .then((latlng) => this._map.setCenter(latlng))
        .catch((e: GeolocationPositionError) => alert(e.message));
    });
    this._map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      currentPositionButton
    );
  }

  /** 現在地マーカーをセットする(マーカーが存在しなければ初期化、そうでなければ移動させる) */
  private setCurrentPositionMarker(pos: GeolocationPosition) {
    const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };

    const svgMarker: google.maps.Symbol = {
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
    } else {
      this._marker.setPosition(position);
      this._marker.setIcon(svgMarker);
    }
  }

  /** 誤差サークルをセットする(サークルが存在しなければ初期化、そうでなければ移動させる) */
  private setAccuracyCircle(pos: GeolocationPosition) {
    const center = { lat: pos.coords.latitude, lng: pos.coords.longitude }

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
    this._circle.setCenter(center)
  }

  /** マーカーセットとサークルセットを合わせたメソッド */
  public setMarkerAndCircle(pos: GeolocationPosition) {
    this.setCurrentPositionMarker(pos)
    this.setAccuracyCircle(pos)
  }

  /** マーカーとサークル削除 */
  public removeMarkerAndCircle() {
    this._marker?.setMap(null)
    this._circle?.setMap(null)
    this._marker = undefined
    this._circle = undefined
  }
}

let map: GoogleMap;

function initMap() {
  map = new GoogleMap();
}
