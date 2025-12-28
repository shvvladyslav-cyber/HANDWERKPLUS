# Handwerk+ — Starter Kit (PWA + сайт + кабинет + admin)

Это готовый минимальный “под ключ” старт для сервиса **Handwerk+** в Германии:
- Сайт-лендинг (DE/UA/RU, порядок языков: **DE → UA → RU**)
- PWA (установка на телефон)
- Кабинет клиента (light: просмотр статусов)
- Admin (light: обновление статуса)
- Интеграция с Google Apps Script (API): `leadCreate`, `partnerRequest`, `updateStatus` (+ `listLeads` для кабинета)

> Следующим твоим сообщением ты пришлёшь Apps Script и “мини CRM” в Google Sheets — я сразу подключу сюда и соберу ZIP с CRM (Leads/Partners/Subscribers).

---

## 1) Структура проекта

```
handwerk-plus-starter/
  public/
    index.html
    app.js
    config.js          <-- ВСТАВЬ сюда Apps Script URL
    manifest.json
    sw.js
    assets/styles.css
    i18n/strings.json  <-- все тексты DE/UA/RU
    cabinet/index.html
    admin/index.html
    legal/
      impressum.html
      datenschutz.html
      agb.html
    icons/
      icon-192.png
      icon-512.png
```

---

## 2) Быстрый запуск локально (на ПК)

Самый простой способ: открыть папку `public` через любой “Live Server”.
- VS Code → Extensions → “Live Server” → Open `public/index.html` → Go Live.

---

## 3) Деплой на GitHub Pages (самый простой)

1. Создай репозиторий `handwerkplus` (или любой).
2. Загрузи содержимое папки `public/` **в корень репозитория**.
3. Settings → Pages:
   - Source: `Deploy from a branch`
   - Branch: `main` / root
4. Получишь ссылку вида `https://username.github.io/repo/`

---

## 4) Подключение Apps Script

Открой `public/config.js` и вставь URL деплоя Apps Script:

```js
APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec"
```

После этого:
- форма “Заявка” отправляет `POST {action:'leadCreate', ...}`
- форма “Partner” отправляет `POST {action:'partnerRequest', ...}`
- Admin отправляет `POST {action:'updateStatus', ...}`
- Кабинет делает `GET ?action=listLeads&phone=...&token=...`

---

## 5) Франшиза / логика масштабирования

В CRM у каждого лида/партнёра можно хранить:
- `region` / `city`
- `partnerId`
- `status`
- SLA по тарифу (Standard/Premium/VIP)
- распределение лидов на партнёров по городу

В этом старт-ките уже есть экран “Franchise/Partner” и отдельная таблица Partners (сделаем в Sheets).

---

## 6) Юридические страницы (DE)

Файлы:
- `public/legal/impressum.html`
- `public/legal/datenschutz.html`
- `public/legal/agb.html`

Сейчас там заглушки. Для Германии обязательно заполнить корректно.

---

## 7) Следующий шаг (твое следующее сообщение)

Ты пришлёшь:
- готовый Apps Script: `leadCreate`, `partnerRequest`, `updateStatus` (+ желательно `listLeads`)
- структуру мини-CRM Google Sheets: `Leads`, `Partners`, `Subscribers`

И я:
- подключу endpoints,
- добавлю “секрет” для admin,
- сделаю шаблон таблиц,
- соберу новый ZIP “сайт + PWA + CRM”.
