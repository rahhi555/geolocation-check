"use strict";
/**
 * ローディングモーダルに関するクラス
 */
class LoadingModal {
    constructor() {
        this._modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        this._modalBody = document.getElementById('loadingModalBody');
        this._modalCount = 0;
    }
    /** ローディング開始 */
    start() {
        this._modal.show();
        this._intervalId = setInterval(() => {
            this._modalCount++;
            this._modalBody.textContent = `${this._modalCount} 秒経過...`;
        }, 1000);
    }
    /** ローディング停止 */
    stop() {
        this._modal.hide();
        clearInterval(this._intervalId);
        this._modalCount = 0;
        this._modalBody.textContent = '';
    }
}
const loadingModal = new LoadingModal;
