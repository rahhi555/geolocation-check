/**
 * ローディングモーダルに関するクラス
 */
class LoadingModal {
  private _modal: bootstrap.Modal
  private _modalCount: number
  private _modalBody: HTMLElement
  private _intervalId!: number

  constructor() {
    this._modal = new bootstrap.Modal(document.getElementById('loadingModal')!)
    this._modalBody = document.getElementById('loadingModalBody')!
    this._modalCount = 0
  }

  /** ローディング開始 */
  public start() {
    this._modal.show()
    this._intervalId = setInterval(() => {
      this._modalCount++
      this._modalBody.textContent = `${this._modalCount} 秒経過...`
    }, 1000)
  }

  /** ローディング停止 */
  public stop() {
    this._modal.hide()
    clearInterval(this._intervalId)
    this._modalCount = 0
    this._modalBody.textContent = ''
  }
}

const loadingModal = new LoadingModal