if (!navigator.geolocation) alert("Geolocationは使用不可能です");

/** startでwatchPosition開始、stopで終了 */
class WatchPosition {
  private _watchId!: number;
  private _count!: number;
  private _pos?: GeolocationPosition

  constructor() {
    this._watchId = 0;
    this._count = 0;
  }

  /**
   * テーブル行をループする共通処理。
   * 引数としてループごとのth,tdを使用することができる。
   */
  private tableRowsLoop = (
    func: (th: HTMLTableCellElement, td: HTMLTableCellElement) => any
  ) => {
    const watchPositionTable = document.getElementById(
      "watch-position-table"
    ) as HTMLTableElement;
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
  private writeInfoToTable = () => {
    const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = this._pos!.coords
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
  private writeErrorToTable = (e: GeolocationPositionError) => {
    const errorTd = document.getElementById("error-td") as HTMLTableCellElement;
    errorTd.textContent = e.message;
  };

  // フォームからオプション取得
  private getOptions = () => {
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
    return options;
  };

  // watchPosition開始
  public start = () => {
    const options = this.getOptions();
    this._watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this._pos = pos
        map.setMarkerAndCircle(pos)
        this.writeInfoToTable();
      },
      (e) => this.writeErrorToTable(e),
      options
    );
  };

  // watchPosition終了
  public stop = () => {
    this.tableRowsLoop((_, td) => {
      td.textContent = "";
    });
    navigator.geolocation.clearWatch(this._watchId);
    this._watchId = 0;
    this._count = 0;
    this._pos = undefined
    map.removeMarkerAndCircle()
  };

  /**
   * 現在のlatlngを取得する。
   * posがundefinedの場合はgetCurrentPositionを実行し、その値を返す
   * */
  public get getCurrentLatLngLiteral() {
    let lat = this._pos?.coords.latitude
    let lng = this._pos?.coords.longitude
    console.log(lat, lng)

    return new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
      if (!lat || !lng) { 
        loadingModal.start()
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            map.setMarkerAndCircle(pos)
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            loadingModal.stop()
            resolve({ lat, lng });
          },
          (e) => {
            loadingModal.stop()
            reject(e);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        resolve({ lat, lng });
      }
    });
  }
}

const watchPosition = new WatchPosition();