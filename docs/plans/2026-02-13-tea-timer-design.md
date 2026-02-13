# Tea Timer - Design Document

## Overview

Windows向けお茶用タイマーアプリ。お茶の種類ごとに煎数に応じた抽出時間を管理し、軽量な小さいウィンドウで表示できる。

## Tech Stack

- Frontend: React + TypeScript
- Backend: Tauri (Rust)
- Build/Release: GitHub Actions (Tauri official action)
- Data: JSON file (Tauri app data folder)
- i18n: react-i18next (ja / en)

## Data Structure

### Tea Preset

```json
{
  "id": "sencha",
  "name": { "ja": "煎茶", "en": "Sencha" },
  "fixedTimes": [60],
  "increment": 10
}
```

- `fixedTimes`: 固定時間リスト（秒）。1煎目から順に設定
- `increment`: fixedTimes以降の煎で前回に加算する秒数

例: fixedTimes=[120, 10], increment=10 の場合
- 1煎目: 120秒、2煎目: 10秒、3煎目: 20秒、4煎目: 30秒...

### Settings (settings.json)

```json
{
  "language": "ja",
  "alwaysOnTop": false,
  "notification": {
    "enabled": true,
    "sound": true,
    "soundType": "default"
  },
  "presets": []
}
```

### Timer State (in-memory)

- 選択中のプリセット
- 現在の煎数
- 現在のタイマー秒数（直接編集可能）
- タイマー状態（idle / running / finished）

## UI Screens

### Main Screen (Timer)

- プリセット選択
- 煎数表示 + 前後ボタン
- タイマー表示（数字入力で編集可能）
- 開始 / 停止 / リセットボタン
- ミニモード切り替えボタン
- 設定画面への遷移

### Mini Mode

- 残り時間表示
- 開始 / 停止ボタン
- 通常モードへの復帰ボタン

### Settings Screen

- プリセット管理（追加・編集・削除）
- 通知設定（音ON/OFF、音の種類、通知ON/OFF）
- 常に最前面 ON/OFF
- 言語切り替え（日本語 / English）

## Timer Behavior

- タイマー完了時: 音 + Windows通知（設定により切替可）
- 完了後: 自動で次の煎に進み、タイマー時間がセットされる（手動スタート）
- 煎数は手動で前後に変更可能

## Window Behavior

- 通常モード ↔ ミニモードの切り替え
- ミニモードは小さいウィンドウにリサイズ
- 設定で常に最前面表示のON/OFF

## Implementation Phases

### Phase 1: Project Foundation
- Tauri + React + TypeScript project setup
- i18n (react-i18next) setup

### Phase 2: Timer Core
- Timer display, start, stop, reset
- Steep count auto-advance + manual adjustment buttons
- Direct number input for timer editing

### Phase 3: Preset Management
- Default presets (sencha, gyokuro, black tea, etc.)
- Add / edit / delete preset UI
- JSON file save / load

### Phase 4: Window Modes
- Normal ↔ mini mode toggle
- Window resize on mini mode
- Always-on-top setting

### Phase 5: Notifications & Settings
- Sound on timer complete
- Windows toast notification
- Settings screen (notification, sound, language, always-on-top)

### Phase 6: GitHub Actions
- Release build automation
