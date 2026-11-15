/* Original accessory drawings and interface icons. No external requests. */
(() => {
  'use strict';
  const iconPaths = {
    crown: '<path d="m3 7 5 5 4-8 4 8 5-5-2 13H5L3 7Z"/><path d="M6 17h12"/><circle cx="3" cy="6" r="1"/><circle cx="21" cy="6" r="1"/>',
    dress: '<path d="m8 3-3 3 3 4-5 11h18L16 10l3-4-3-3c-2 3-6 3-8 0Z"/><path d="M8 10h8M7 17c3 1 7 1 10 0"/>',
    shoes: '<path d="M3 15c3 0 5-2 6-7l4 6c2 1 5 1 7 3l1 3H3v-5ZM9 9l3-4 3 7M4 20v1M18 20v1"/>',
    hair: '<path d="M6 19c-5-6-1-16 6-16s11 10 6 16M7 11c3 0 5-2 6-4 0 3 2 4 4 4M7 12v9M17 12v9M10 18q2 2 4 0"/>',
    mask: '<path d="M2 8c5-2 7 0 10 1 3-1 5-3 10-1l-2 8c-3 3-5-1-8-1s-5 4-8 1L2 8Z"/><path d="M5 11q2-2 4 1-2 3-4-1Zm10 1q2-3 4-1-2 4-4 1Z"/>',
    wings: '<path d="M12 12C-2-5 0 14 8 14c-9 7 0 13 4 0 4 13 13 7 4 0 8 0 10-19-4-2ZM12 10v8"/>',
    story: '<path d="M3 5c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V5ZM12 7v15M6 10h3M6 14h3M15 10h3M15 14h3"/>',
    zoom: '<circle cx="10" cy="10" r="7"/><path d="m16 16 5 5M7 10h6M10 7v6"/>',
    wand: '<path d="m15 3 1.6 3.6 3.9.4-2.9 2.6.9 3.9-3.5-2-3.5 2 .8-3.9L9.5 7l3.9-.4L15 3Z"/><path d="M12 12 3 21M4 5v4M2 7h4M20 16v4M18 18h4"/>',
    scene: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m3 17 5-6 5 5 3-3 5 5"/><circle cx="16" cy="8" r="2"/>',
    flower: '<path d="M12 7c-6-8-10 1-5 5-8 6 1 10 5 5 6 8 10-1 5-5 8-6-1-10-5-5Z"/><circle cx="12" cy="12" r="2.5"/>',
    heart: '<path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2Z"/>',
    camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="4"/><path d="M18 10h.1"/>',
    undo: '<path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14" transform="translate(0 -2)"/>',
    sparkle: '<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z"/>',
    leaf: '<path d="M20 3C9 2 3 7 5 14s13 8 15-11Z"/><path d="M3 21 16 8M9 15v-5M9 15h6"/>',
    album: '<path d="M7 3h13v17H7zM7 6H3v16h14v-2"/><path d="m9 16 3-4 2 2 3-3 1 5"/><circle cx="12" cy="8" r="1"/>',
    expand: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
    collapse: '<path d="M3 8h5V3M21 8h-5V3M8 21v-5H3M16 21v-5h5"/>',
    'sound-on': '<path d="m11 4-5 4H3v8h3l5 4V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
    'sound-off': '<path d="m11 4-5 4H3v8h3l5 4V4ZM16 9l6 6M22 9l-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    none: '<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.sparkle}</svg>`;
  const flower = (x, y, color, size = 1) => `<g transform="translate(${x} ${y}) scale(${size})"><g fill="${color}" stroke="#fff7ed" stroke-width=".8"><ellipse cy="-6" rx="4.5" ry="7"/><ellipse cy="-6" rx="4.5" ry="7" transform="rotate(72)"/><ellipse cy="-6" rx="4.5" ry="7" transform="rotate(144)"/><ellipse cy="-6" rx="4.5" ry="7" transform="rotate(216)"/><ellipse cy="-6" rx="4.5" ry="7" transform="rotate(288)"/></g><circle r="3.5" fill="#e8bd6f"/></g>`;
  const headwearArt = [
    '',
    '<defs><linearGradient id="crown-gold" x2="0" y2="1"><stop stop-color="#ffe5a0"/><stop offset="1" stop-color="#c89346"/></linearGradient></defs><path d="m20 35 25 23 30-41 30 41 25-23-12 42H32Z" fill="url(#crown-gold)" stroke="#bb853f" stroke-width="1.6"/><path d="M33 73q42 8 84 0v10q-42 8-84 0Z" fill="#ecd4a2" stroke="#bc914e" stroke-width="1.3"/><g fill="#fff5d8" stroke="#d2aa67"><circle cx="20" cy="32" r="4"/><circle cx="75" cy="15" r="5"/><circle cx="130" cy="32" r="4"/><circle cx="48" cy="78" r="2.5"/><circle cx="102" cy="78" r="2.5"/></g><path d="m75 43 8 11-8 11-8-11Z" fill="#de99a5" stroke="#fff0d7" stroke-width="2"/>',
    `<path d="M20 68q55-40 110 0" fill="none" stroke="#879f72" stroke-width="7"/><g fill="#8fa77b"><ellipse cx="29" cy="51" rx="6" ry="13" transform="rotate(-35 29 51)"/><ellipse cx="123" cy="52" rx="6" ry="13" transform="rotate(35 123 52)"/><ellipse cx="63" cy="44" rx="5" ry="12" transform="rotate(-20 63 44)"/></g>${flower(31, 59, '#df9aa4', .8)}${flower(57, 46, '#f4c9ca', .95)}${flower(86, 46, '#d98599', 1.1)}${flower(115, 59, '#f1c5cb', .9)}`,
    '<path d="M22 76q53-9 106 0" fill="none" stroke="#abb9d2" stroke-width="6"/><path d="m75 21 7 17 18 2-14 12 4 18-15-9-16 9 4-18-14-12 19-2Z" fill="#d4e5f0" stroke="#a2b7cb" stroke-width="1.5"/><path d="m33 47 5 9 10 1-7 7 1 10-9-5-9 5 2-10-8-7 11-1ZM117 47l5 9 10 1-7 7 1 10-9-5-9 5 2-10-8-7 11-1Z" fill="#e5ebf4" stroke="#a6b9cf"/><g fill="#f9f5e3"><circle cx="47" cy="76" r="3"/><circle cx="102" cy="76" r="3"/><circle cx="75" cy="45" r="3"/></g>',
    '<path d="M29 69q47-25 94 0" fill="none" stroke="#a896c1" stroke-width="4"/><path d="M75 52C49 23 17 31 31 62c5 12 27 8 44-2-14 12-22 25-20 35l20-12 10 13c0-16-3-27-10-36 23 17 45 18 49 2 10-35-26-36-49-10Z" fill="#bdb0d6" stroke="#9c87b7" stroke-width="1.5"/><path d="M75 52 48 47M82 55l23-8" stroke="#e9dff1" stroke-width="2"/><ellipse cx="76" cy="57" rx="9" ry="10" fill="#d9cce5" stroke="#ab95bf"/>',
    `<path d="M27 71q50-32 100 0" fill="none" stroke="#c6b385" stroke-width="4"/><g fill="#9aa778"><ellipse cx="108" cy="45" rx="6" ry="15" transform="rotate(35 108 45)"/><ellipse cx="130" cy="62" rx="5" ry="12" transform="rotate(70 130 62)"/></g>${flower(111, 58, '#fff2c6', 1.55)}${flower(89, 56, '#fffaf0', .75)}`
  ];
  const star = (x, y, color, scale = 1) => `<path d="m0-20 6 13 14 1-11 10 3 15L0 12l-12 7 3-15-11-10 14-1Z" transform="translate(${x} ${y}) scale(${scale})" fill="${color}" stroke="#c7a373" stroke-width="1.5"/>`;
  const accessoryArt = [
    '',
    `<path d="m319 401 14-133" stroke="#c69f70" stroke-width="5" stroke-linecap="round"/><path d="m320 400 14-130" stroke="#f5dfb6" stroke-width="1.5"/>${star(335, 246, '#efc4cc', 1.3)}<path d="M333 275q-22-7-25 15t12 30M335 276q22 6 22 25" fill="none" stroke="#dbb4c9" stroke-width="3"/><circle cx="335" cy="245" r="4" fill="#fff4cf"/>`,
    '<path d="m320 402 14-133" stroke="#a7a0c4" stroke-width="5" stroke-linecap="round"/><path d="M346 224c-36 3-37 48 0 50-17-14-17-35 0-50Z" fill="#f4dca0" stroke="#cfb277" stroke-width="1.5"/><path d="M336 280q-22 8-22 28m23-28q16 19 12 42" fill="none" stroke="#c4b8df" stroke-width="3"/><circle cx="351" cy="251" r="3" fill="#fff3cb"/>',
    `<path d="m319 403 13-81m-13 81-5-75m5 75 32-70" stroke="#82966a" stroke-width="3"/><path d="m302 355 40 4-21 48Z" fill="#e8d8b8" stroke="#c5ae8c"/><g fill="#97a87a"><ellipse cx="307" cy="325" rx="8" ry="16" transform="rotate(-30 307 325)"/><ellipse cx="350" cy="332" rx="7" ry="16" transform="rotate(35 350 332)"/></g>${flower(314, 326, '#e7a8b3', 1.2)}${flower(340, 320, '#faf1db', 1.1)}${flower(330, 304, '#d892a3', 1.1)}<path d="m314 380 17 4-12 7-13-11Z" fill="#c895a1"/>`,
    '<path d="M319 401c-16-55 42-78 15-142" fill="none" stroke="#c5a37e" stroke-width="1.8"/><path d="M334 263c-35-24-54-48-37-68 13-14 29-4 37 7 8-11 25-21 37-7 17 20-2 44-37 68Z" fill="#e7abb9" stroke="#c18d9c" stroke-width="2"/><path d="M304 207q3-13 14-9" fill="none" stroke="#f9e3e4" stroke-width="4" stroke-linecap="round"/><path d="m334 262-4 7h8Z" fill="#ce91a3"/>',
    '<path d="m320 400 13-130" stroke="#a99b7b" stroke-width="4" stroke-linecap="round"/><path d="M331 258c-42-43-52-10-27 7-23 12-6 35 27 0 36 36 52 11 28-1 27-16 12-48-28-6Z" fill="#c8b9df" stroke="#a18eb8" stroke-width="1.5"/><path d="M331 256v18m-1-18-6-8m8 8 6-8" stroke="#b0957b" stroke-width="2" stroke-linecap="round"/><circle cx="332" cy="275" r="2.5" fill="#eee3c6"/>'
  ];
  const headwear = (id, thumbnail = false) => !id ? '' : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? '0 0 150 100' : '0 0 362 724'}" aria-hidden="true">${thumbnail ? headwearArt[id] : `<g transform="translate(106 10)">${headwearArt[id]}</g>`}</svg>`;
  const accessory = (id, thumbnail = false) => !id ? '' : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? '275 175 110 250' : '0 0 362 724'}" aria-hidden="true">${accessoryArt[id]}</svg>`;
  const shoes = (id, thumbnail = false) => {
    const colors = [['#e9adbc', '#b9778d', '#f9d9df'], ['#bdd5e8', '#7d9bb4', '#edf6fb'], ['#f2e7ca', '#b9a37d', '#fffaf0'], ['#e8c777', '#b68c43', '#fff1bd'], ['#afc5a1', '#7b9670', '#e1ebd5'], ['#cdb7df', '#a48aba', '#eee0f7']][id];
    const pair = [161, 201].map((x, index) => `<g transform="translate(${x} 660)">${id === 5 ? '<path d="m-8-30 17 12-18 12m17-24L-7-17 9-6" fill="none" stroke="#b497cd" stroke-width="3"/>' : ''}<path d="M-15-17Q0-8 15-17l4 25c3 12-3 17-19 17S-22 20-19 8Z" fill="url(#shoe-${id})" stroke="${colors[1]}" stroke-width="1.6"/><path d="M-15-17q15 12 30 0" fill="none" stroke="${colors[1]}" stroke-width="2"/><path d="M-14 15q14 9 28 0" fill="none" stroke="${colors[2]}" stroke-width="1.5"/>${id === 0 || id === 5 ? `<path d="M0-2c-21-18-23 9-2 3-4 9 8 11 4 0 22 6 20-21-2-3Z" fill="${colors[2]}" stroke="${colors[1]}" stroke-width="1"/>` : id === 1 ? '<path d="m0-10 8 9-8 9-8-9Z" fill="#f9fcff" stroke="#9bb7d0"/>' : id === 2 ? '<g fill="#fffdf6" stroke="#c8b692"><circle cy="-2" r="5"/><circle cx="-8" cy="-4" r="2"/><circle cx="8" cy="-4" r="2"/></g>' : id === 3 ? star(0, -2, '#fff0af', .45) : '<path d="M-8 4C-9-9 7-11 9-9 10 1 0 9-8 4Z" fill="#e9eed8" stroke="#809d70"/><path d="m-7 4 13-11" stroke="#8aa17b"/>'}</g>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? '130 615 102 80' : '0 0 362 724'}" aria-hidden="true"><defs><linearGradient id="shoe-${id}" x2="0" y2="1"><stop stop-color="${colors[2]}"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient></defs>${pair}</svg>`;
  };
  const maskArt = [
    '',
    '<path d="M181 151c-52-53-91-15-51 28 17 13 33 0 51-6 18 6 34 19 51 6 40-43 1-81-51-28Z" fill="#dfabc8" stroke="#b586a8" stroke-width="1.7"/><path d="m124 144 14 20m97-20-14 20" stroke="#fae0ec" stroke-width="2.5"/><path d="M181 146v28" stroke="#c7a370" stroke-width="3"/>',
    '<path d="m124 153 7-28 24 17q27-5 53 0l23-17 7 28-9 28c-16 12-31-7-47-7s-32 19-49 7Z" fill="#f0d7bd" stroke="#bd9c83" stroke-width="1.6"/><path d="m134 132 3 15 10-5m68 0 11-10-2 15" fill="#e9bdc2"/><path d="m178 169 4 5 4-5Z" fill="#c28b91"/><path d="m133 169-12-1m13 7-12 3m108-9 12-1m-13 7 12 3" stroke="#b39282" stroke-width="1.3"/>',
    `<path d="M126 148q22-19 55 2 33-21 55-2l-8 34q-20 6-47-7-27 13-47 7Z" fill="#aac5dd" stroke="#809fbe" stroke-width="1.5"/>${star(132, 140, '#f8e6b1', .42)}${star(230, 141, '#f8e6b1', .42)}<path d="m177 146 4-8 5 8" fill="#f0e2bd"/>`,
    '<path d="M139 146c-13-38-2-60 9-12 10-47 23-25 13 12m43 0c-11-39 0-59 10-12 13-46 24-22 10 13" fill="#fff4e4" stroke="#d3b9ab" stroke-width="1.8"/><path d="M124 152q23-21 57-3 35-18 58 3l-9 29q-21 7-49-7-28 14-49 7Z" fill="#fff5e7" stroke="#d3b9ab" stroke-width="1.5"/><path d="m178 170 4 4 4-4Z" fill="#dfa9b6"/><g fill="#efc9d0"><ellipse cx="137" cy="174" rx="6" ry="3"/><ellipse cx="225" cy="174" rx="6" ry="3"/></g>',
    `<path d="M126 151q24-19 55-2 31-17 55 2l-8 30q-19 9-47-7-28 16-47 7Z" fill="#c8b4df" stroke="#a28bbe" stroke-width="1.5"/><path d="M184 136c-17-5-28 17-8 24-8-8-2-20 8-24Z" fill="#f3d996"/>${star(136, 143, '#f6e5b7', .3)}${star(226, 144, '#f6e5b7', .3)}`
  ];
  const mask = (id, thumbnail = false) => !id ? '' : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? '112 100 140 100' : '0 0 362 724'}" aria-hidden="true"><defs><mask id="eye-openings-${id}" maskUnits="userSpaceOnUse" x="100" y="90" width="160" height="120"><rect x="100" y="90" width="160" height="120" fill="white"/><ellipse cx="153" cy="158" rx="17" ry="12" fill="black"/><ellipse cx="209" cy="158" rx="17" ry="12" fill="black"/></mask></defs><g mask="url(#eye-openings-${id})">${maskArt[id]}</g></svg>`;
  const wings = (id, thumbnail = false) => {
    if (!id) return '';
    const colors = [['#f2cede', '#c990ae'], ['#d4e8f2', '#94b8d0'], ['#d9e9c7', '#99b17d'], ['#e1d5f1', '#ad95c9'], ['#fff2d5', '#d1b980']][id - 1];
    const shape = id === 5 ? 'M179 325C143 243 88 219 60 186 36 167 34 195 52 212 14 199 18 233 52 250 18 246 26 276 66 292 28 294 47 328 111 344 63 350 82 381 141 367c19-12 29-27 38-42Z' : id === 3 ? 'M178 322C147 207 56 167 23 199c-13 64 41 111 103 124-105 3-117 78-67 102 51 8 92-35 119-103Z' : 'M178 321C118 170 4 152 15 230c4 63 69 93 117 99-130-6-131 106-71 115 55-6 91-62 117-123Z';
    const wing = `<path d="${shape}" fill="${colors[0]}" fill-opacity=".78" stroke="${colors[1]}" stroke-width="2.2"/><path d="M169 317Q79 256 32 212m137 106Q80 331 51 404m117-85L76 230m91 91L80 382" fill="none" stroke="${colors[1]}" stroke-width="1.4" opacity=".58"/><g fill="#fff9ea" opacity=".85"><circle cx="42" cy="234" r="5"/><circle cx="78" cy="261" r="3.5"/><circle cx="78" cy="391" r="4"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? '0 160 362 300' : '0 0 362 724'}" aria-hidden="true">${wing}<g transform="translate(362 0) scale(-1 1)">${wing}</g></svg>`;
  };
  window.PrincessData = Object.freeze({
    icon, headwearSvg: headwear, accessorySvg: accessory, shoesSvg: shoes, maskSvg: mask, wingsSvg: wings,
    hairGeometry: Object.freeze({left: .10, width: .80, height: .82, top: [-.03, -.03, -.03, -.025, -.015, -.018]}),
    hairBackPolygon: [[.29, .15], [.71, .15], [.75, .31], [.65, .38], [.35, .38], [.25, .31]],
    categories: [
      {id: 'dress', name: '裙子', icon: 'dress', hint: '选一条喜欢的裙子吧'},
      {id: 'shoes', name: '鞋子', icon: 'shoes', hint: '给小脚丫挑一双漂亮鞋子'},
      {id: 'hair', name: '发型', icon: 'hair', hint: '卷卷发，还是小辫子呢？'},
      {id: 'headwear', name: '头饰', icon: 'crown', hint: '给小公主戴上小美好'},
      {id: 'mask', name: '面罩', icon: 'mask', hint: '一起参加童话化装舞会吧'},
      {id: 'wings', name: '翅膀', icon: 'wings', hint: '给想象插上一对小翅膀'},
      {id: 'accessory', name: '小物', icon: 'wand', hint: '带上一点点魔法吧'},
      {id: 'scene', name: '仙境', icon: 'scene', hint: '今天，去哪里玩呢？'}
    ],
    dress: [
      {name: '玫瑰公主裙', color: '#fbf0ef'}, {name: '云朵蓝纱裙', color: '#eff3f6'},
      {name: '月光紫罗裙', color: '#f1edf7'}, {name: '暖阳雏菊裙', color: '#fcf5e8'},
      {name: '森林精灵裙', color: '#eef1e7'}, {name: '蜜桃蝴蝶裙', color: '#fcf0e8'}
    ],
    shoes: [
      {name: '玫瑰蝴蝶鞋', color: '#faeaf0'}, {name: '蓝色水晶鞋', color: '#eaf2f8'},
      {name: '奶油珍珠鞋', color: '#fbf5e8'}, {name: '金色星星鞋', color: '#fbf1d9'},
      {name: '森林叶子鞋', color: '#eef3e5'}, {name: '紫色芭蕾鞋', color: '#f3ecf8'}
    ],
    hair: [
      {name: '栗色长卷发', color: '#f7eee4'}, {name: '巧克力双辫', color: '#f3ece5'},
      {name: '金色小短发', color: '#fcf3dc'}, {name: '可爱丸子头', color: '#f5ece4'},
      {name: '蜜糖高马尾', color: '#faede1'}, {name: '黑亮长直发', color: '#efeeee'}
    ],
    mask: [
      {name: '不戴面罩', color: '#f5f1e9'}, {name: '蝴蝶舞会面罩', color: '#faeaf2'},
      {name: '小猫咪面罩', color: '#faf0e4'}, {name: '星星舞会面罩', color: '#edf3fa'},
      {name: '小兔兔面罩', color: '#fcf4ec'}, {name: '月亮舞会面罩', color: '#f1ecf8'}
    ],
    wings: [
      {name: '不戴翅膀', color: '#f5f1e9'}, {name: '花瓣蝴蝶翅', color: '#faedf3'},
      {name: '蓝天精灵翅', color: '#eaf3f8'}, {name: '森林叶子翅', color: '#eff4e5'},
      {name: '月光仙子翅', color: '#f2edf9'}, {name: '暖阳小天使翅', color: '#fcf5e4'}
    ],
    headwear: [
      {name: '轻轻摘下来', color: '#f5f1e9'}, {name: '珍珠小王冠', color: '#fbf3df'},
      {name: '玫瑰小花环', color: '#fbf0ef'}, {name: '星星小皇冠', color: '#eef3fa'},
      {name: '紫色蝴蝶结', color: '#f2eef7'}, {name: '雏菊小发箍', color: '#f9f4e6'}
    ],
    accessory: [
      {name: '轻轻放下来', color: '#f5f1e9'}, {name: '星星魔法棒', color: '#fcf0f1'},
      {name: '月亮魔法棒', color: '#f1eef8'}, {name: '花园小花束', color: '#eff2e9'},
      {name: '爱心小气球', color: '#fbedf0'}, {name: '蝴蝶魔法棒', color: '#f2eef7'}
    ],
    scene: [
      {name: '玫瑰花园', color: '#f2f1e4'}, {name: '云上城堡', color: '#fcf0e7'}, {name: '月光仙境', color: '#eeeaf7'}
    ],
    invitations: [
      {name: '花园茶会', detail: '带上小花束，和蝴蝶喝一杯花茶。', scene: 0, look: {dress: 0, shoes: 0, hair: 1, headwear: 2, mask: 0, wings: 1, accessory: 3, scene: 0}},
      {name: '星光舞会', detail: '戴上舞会面罩，和月亮跳一支舞。', scene: 2, look: {dress: 2, shoes: 5, hair: 4, headwear: 3, mask: 5, wings: 4, accessory: 2, scene: 2}},
      {name: '云端旅行', detail: '穿好小鞋子，去云上的城堡探险。', scene: 1, look: {dress: 1, shoes: 1, hair: 2, headwear: 5, mask: 0, wings: 2, accessory: 1, scene: 1}}
    ],
    defaultLook: Object.freeze({dress: 0, shoes: 0, hair: 0, headwear: 1, mask: 0, wings: 0, accessory: 0, scene: 0})
  });
})();
