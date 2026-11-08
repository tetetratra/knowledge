---
tags: "WAV, RIFF, 音声, ファイル形式"
---

# WAVファイルの構造

- WAVファイルはRIFF形式で、先頭12バイトのヘッダーの後に「チャンク」と呼ばれる区画が並ぶ
  - ヘッダーは `"RIFF"`、ファイル全体のサイズ−8、`"WAVE"` の3つで、各4バイト
  - どのチャンクも「名前4バイト＋サイズ4バイト＋中身」の形で、数値はすべてリトルエンディアン
  - 中身が奇数バイトのときは、チャンクを偶数バイト境界に揃えるため、末尾に1バイトの詰め物が入る
- 主なチャンクは2つで、それ以外（`LIST` などのメタ情報）は読み飛ばしてよい
  - `fmt `（末尾に空白を含む4文字）：音声の形式。形式コード（1は無圧縮PCM）、チャンネル数、サンプルレート、1秒あたりのバイト数、1サンプルのバイト数、ビット数
  - `data`：音声本体のPCM
- PCMは、音の波の高さを一定間隔で測った数値（サンプル）を時間順に並べたもの
  - 16bitなら1サンプルは−32768〜32767の符号付き整数で、ステレオではL、Rが交互に並ぶ
  - 1秒あたりのバイト数は「サンプルレート×1サンプルのバイト数」で決まるので、一定の長さで切っても再生でき、ストリーミング用の短いフレームに分割できる
- 読み取りは、ヘッダーを確認したあと、チャンクの見出しを順にたどって `fmt ` で形式を確認し、`data` を取り出す

出典
- [Resource Interchange File Format (RIFF) - Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/xaudio2/resource-interchange-file-format--riff-)
- [WAVEFORMATEX structure - Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/mmeapi/ns-mmeapi-waveformatex)
