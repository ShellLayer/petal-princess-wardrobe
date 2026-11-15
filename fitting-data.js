/* Shared body attachment points for footwear, masks, hats and held objects. */
(() => {
  'use strict';
  const D=window.PrincessData;
  const svg=(body,thumb,box)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumb?box:'0 0 362 724'}" fill="none" stroke="none" aria-hidden="true">${body}</svg>`;
  const inside=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  const fans=new Set([6,7,8,9,10,30,31]);
  const supported=new Set([22,28,37]);
  const gripFor=(index)=>index&&!supported.has(index)?{type:fans.has(index)?'fan':'handle',x:314,y:400,sourceX:index<6?319:310,sourceY:index<6?401:400,angle:fans.has(index)?-13:0}:null;
  const hatFor=index=>index===17?{cutY:123}:index===25?{cutY:121}:null;
  const palettes=[['#d29aab','#956274','#f7d6de'],['#a8c5dc','#66879e','#e4f1f7'],['#e7d5ad','#ab956d','#fff2d1'],['#cead61','#9b773d','#f7e6ad'],['#9eb69a','#6c866b','#d6e1c7'],['#b3a0ca','#87739f','#e7dcf0']];
  const blossom=(color)=>`<g fill="${color}" stroke="#e9d4ad" stroke-width=".65">${Array.from({length:5},(_,i)=>`<ellipse cx="1" cy="12" rx="2.7" ry="4.4" transform="rotate(${72*i} 1 16)"/>`).join('')}<circle cx="1" cy="16" r="2.2" fill="#c6a363"/></g>`;
  function shoes(index,thumb,phase){
    const local=index<6?index:index-6,kind=index<6?0:index<24?D.shoes[index].kind:(index===28||index===33?2:0),boot=kind===2;
    const [base,edge,light]=palettes[index<6?index:[2,0,4,1,5,3][local%6]],id=`fitted-shoe-${index}`;
    if(phase==='skin')return svg(boot?'':[161,201].map((x,i)=>`<g transform="translate(${x} 655) scale(${i?1:-1} 1)"><path d="M-8-2q9 5 17-1l-1 7q-8 5-14-1Z" fill="#e8b996" stroke="${edge}" stroke-width=".7"/></g>`).join(''),thumb,'130 608 104 85');
    const body=boot?'M-10-38q10 4 20-2v37l3 10c4 4 12 6 11 13-2 10-37 11-42 0-3-7 3-15 8-21Z':'M-10-1q10 7 20-2l3 10c4 4 12 6 11 13-2 10-37 11-42 0-3-7 3-15 8-21Z';
    const motif=index<6?[8,9,10,11,6,8][index]:index<24?[10,4,2,0,5,7,2,4,4,10,3,0,2,7,1,9,4,7][local]:local-18;
    const decorations=[
      blossom('#f4dbe1'),'<g fill="#edc98b" stroke="#b7904d"><circle cx="-4" cy="11" r="4"/><circle cx="6" cy="11" r="4"/></g><path d="m-4 17 5 2 5-2" stroke="#8d7049"/>',
      '<path d="M-3 7v14m6-15v14m-9-9h5m2 4h5m-12 3h5" stroke="#e4e8cd" stroke-width="1.2"/>',
      '<path d="M-5 14q2-9 7-2 6-7 7 2-6 9-14 0Z" fill="#c67e7c" stroke="#f2d7b1"/>',
      '<path d="M-8 15q4-9 8-2-2-10 5-7 6 2 2 9 7-4 7 2M-7 21h17" stroke="#f7e4b9" stroke-width="1.2"/>',
      '<path d="M-9 1q12 6 21-2M-9 6q11 6 21-1" stroke="#f7e8d0" stroke-width="1.4"/>'+blossom('#e2b2c4'),
      '<path d="M1 21Q-14 14-6 8q5-3 7 4 4-8 9-4 7 7-9 13Z" fill="#c5d6ae" stroke="#f1e9d1"/><path d="M1 19V11m0 6-6-6m6 6 6-6" stroke="#91a682" stroke-width=".7"/>',
      blossom('#d4a2ac')+'<path d="M-9-2q11 7 21-1" stroke="#f7e7d0" stroke-width="2.8"/>',
      '<path d="M1 14q-12-12-11-2t10 4q-9 9 0 9l2-9q12 10 11 1T1 14Z" fill="#ead6b1" stroke="#fcf0d7" stroke-width=".7"/>',
      '<path d="m1 5 7 9-7 9-7-9Z" fill="#e8e8e3" stroke="#fff4d8" stroke-width="1"/>',
      '<g fill="#fff3db" stroke="#c9b084"><circle cx="1" cy="15" r="4"/><circle cx="-6" cy="11" r="1.7"/><circle cx="8" cy="11" r="1.7"/></g>',
      '<path d="m1 5 3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z" fill="#f2dfae" stroke="#fff3d1" stroke-width=".7"/>'
    ][((motif%12)+12)%12];
    const defs=`<defs><linearGradient id="${id}" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="${light}"/><stop offset=".44" stop-color="${base}"/><stop offset="1" stop-color="${edge}"/></linearGradient><radialGradient id="${id}-shine" cx=".35" cy=".3" r=".7"><stop stop-color="${light}" stop-opacity=".75"/><stop offset="1" stop-color="${base}" stop-opacity="0"/></radialGradient></defs>`;
    return svg(defs+[161,201].map((x,i)=>`<g id="shoe-${i?'right':'left'}" data-foot="${i?'right':'left'}" data-sole="683" data-angle="outward" transform="translate(${x} 655)"><g transform="scale(${i?1:-1} 1)"><path d="${body}" fill="url(#${id})" stroke="${edge}" stroke-width="1.05"/><path d="M-15 21q17 7 36 0" stroke="${light}" stroke-width="1.2"/><path d="M-15 23q17 7 35 0" stroke="${edge}" stroke-width=".9"/>${boot?'<path d="M-9-32q10 3 19-1m-19 6q10 3 19-1" stroke="'+light+'" stroke-width="1.2"/>':'<path d="M-8-2q9 5 17-1l-1 7q-8 5-14-1Z" fill="#e8b996" stroke="'+edge+'" stroke-width=".7"/>'}<path d="M-12 11q14-7 30 5-5 11-24 6-8-3-6-11Z" fill="url(#${id}-shine)"/>${decorations}${index===5?'<path d="m-7-27 13 9-13 11m13-20L-7-17 13-8" stroke="'+edge+'" stroke-width="1.5"/>':''}</g></g>`).join(''),thumb,'130 608 104 85');
  }
  function hat(index,thumb){
    let body='';
    if(index===17)body='<defs><linearGradient id="tiger-silk" x2="0" y2="1"><stop stop-color="#f1d6a5"/><stop offset="1" stop-color="#c69c5f"/></linearGradient></defs><path d="M105 135C89 99 103 44 180 44s91 55 75 91l-14-5q-3-33-61-34-58 1-61 34Z" fill="url(#tiger-silk)" stroke="#b38d54" stroke-width="1.2"/><circle cx="119" cy="57" r="16" fill="#dab77c" stroke="#b38d54"/><circle cx="241" cy="57" r="16" fill="#dab77c" stroke="#b38d54"/><path d="m143 77 12 5m50 0 12-5m-48-9h22m-11 0v20m-12-11h24m-23 13 11 8 11-8" stroke="#826b4a" stroke-width="2.4"/><path d="M109 132q5-39 71-40 66 1 71 40" stroke="#f6e4be" stroke-width="5"/>';
    else body='<path d="M107 126C97 82 124 54 180 53c56 1 83 29 73 73l-13 0q-7-24-60-25-53 1-60 25Z" fill="#c6d1b5" stroke="#95a585" stroke-width="1.2"/><path d="M113 123q7-43 29-25 14-48 38-15 24-33 38 15 22-18 29 25" fill="#e8cdd1" stroke="#b896a0" stroke-width="1.1"/><path d="M119 126q61-27 122 0" stroke="#f6e6d4" stroke-width="4"/>';
    return svg(body,thumb,'89 31 182 115');
  }
  function renderLayer(kind,index,thumb=false,phase){
    if(kind==='shoes')return shoes(index,thumb,phase);
    if(kind==='headwear'&&hatFor(index))return hat(index,thumb);
    let original=D.renderLayer(kind,index,thumb,phase);if(!original)return original;
    if(kind==='mask'&&index<6)original=original.replace('cx="153" cy="158"','cx="151" cy="156"').replace('cx="209" cy="158"','cx="208" cy="156"');
    if(!thumb&&kind==='accessory'){
      const grip=gripFor(index);if(grip){const moved=`<g transform="translate(${grip.x-grip.sourceX} ${grip.y-grip.sourceY}) rotate(${grip.angle} ${grip.sourceX} ${grip.sourceY})">${inside(original)}</g>`;return svg(moved+(fans.has(index)?'<path d="m314 400 10 30" stroke="#b99b71" stroke-width="3" stroke-linecap="round"/>':''),false);}
    }
    return original;
  }
  window.PrincessData=Object.freeze({...D,renderLayer,gripFor,hatFor,rig:Object.freeze({...D.rig,shoeY:655,soleY:683,grip:Object.freeze([314,400])})});
})();

