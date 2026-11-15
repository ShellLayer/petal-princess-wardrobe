/* Expanded child-friendly styles, makeup and independently saved colour choices. */
(() => {
  'use strict';
  const D=window.PrincessData;
  const add=(entries)=>entries.map(([name,era='古风',group='ancient'],i)=>({name,era,group,color:['#f8eee2','#eaf1e7','#f8e8e5','#eaf1f5','#f2ecf8','#fcf2dd'][i%6]}));
  const dress=[...D.dress,...add([
    ['战国·青竹长衣','战国','preqin'],['东汉·朱华襦裙','东汉','qinhan'],['东晋·青岚广袖','东晋','weijin'],
    ['北朝·杏锦圆领袍','北朝','northsouth'],['隋·碧波间色裙','隋','suitang'],['唐·蹴鞠圆领袍','唐','suitang'],
    ['宋·菊香短褙子','宋','songyuan'],['辽·丹霞雁锦袍','辽','songyuan'],['元·青玉长比甲','元','songyuan'],
    ['明·玉兰圆领袍','明','mingqing'],['清·迎春小马甲','清·汉童','mingqing'],['花神·莲心仙裙','神话','myth']
  ])];
  const hair=[...D.hair,...add([
    ['轻刘海长直发'],['细辫双垂发'],['清风低马尾'],['小小单环髻'],['俏皮双束发'],['编辫绕冠髻'],
    ['半绾双丸髻'],['莲心小发髻'],['一侧小长辫'],['叠云小盘髻'],['轻盈齐耳发'],['回环小发髻']
  ])];
  const shoes=[...D.shoes,...add([
    ['玉兰软绢履'],['绒球锦童鞋'],['竹纹小方履'],['红豆结绣鞋'],['祥云织锦靴'],['桃瓣双带履'],
    ['荷叶小绢鞋'],['梅花暖绒履'],['蝴蝶结绣鞋'],['石榴花童靴'],['如意盘扣履'],['燕尾小云履']
  ])];
  const headwear=[...D.headwear,...add([
    ['杏花双簪'],['莲叶小钗'],['石榴花发梳'],['海棠双绒花'],['竹节玉簪'],['金鱼小发钗'],
    ['银杏叶发冠'],['小燕衔花簪'],['牡丹绒花冠'],['点翠灵感花梳'],['红绳双穗结'],['玉兔小发冠','神话']
  ])];
  const mask=[...D.mask,...add([
    ['海棠绣纹面罩'],['银杏叶面罩'],['荷叶小蛙面罩','童趣'],['云月小狐面罩','神话'],['桃枝花面罩'],['星河小鱼面罩','神话']
  ])];
  const wings=[...D.wings,...add([
    ['银杏叶轻披帛'],['荷叶小披肩'],['春燕双绸带'],['石榴花云肩'],['桃枝薄纱帛'],['小兔暖斗篷','童趣']
  ])];
  const accessory=[...D.accessory,...add([
    ['银杏叶小团扇'],['桃花小折扇'],['兔子小花灯','节令'],['锦鲤小花灯','节令'],['莲叶小纸伞'],['春燕小纸鸢'],
    ['荷包小香囊'],['小熊猫布偶','童趣'],['一串冰糖葫芦','童趣'],['小小竹笛'],['如意小风车','童趣'],['荷叶小花篮']
  ])];
  const makeup=add([
    ['素颜','轻轻取下'],['桃花淡颊','淡妆'],['杏子淡颊','淡妆'],['樱桃点唇','淡妆'],
    ['桃花花钿','花钿'],['梅心花钿','花钿'],['月牙花钿','花钿'],['莲瓣花钿','花钿'],
    ['小小雀斑','童趣'],['星星贴画','童趣'],['花瓣贴画','童趣'],['蝶翼贴画','童趣'],
    ['春日桃花妆','组合'],['杏雨梨花妆','组合'],['月宫小仙妆','神话'],['元宵梅花妆','节令']
  ]);
  const fabric=[['原色',null],['丹砂','#c45f52'],['胭脂','#d695a8'],['竹青','#739b7e'],['晴蓝','#799fbc'],['藤紫','#ab8ebb'],['杏金','#d4b167'],['月白','#d9ddd4'],['墨青','#566e7b']];
  const hairColors=[['原色',null],['墨黑','#292a2a'],['乌棕','#48372d'],['栗棕','#82513a'],['茶褐','#a07b53'],['银灰','#b7bab6'],['桑紫','#756178'],['雾蓝','#657d8a']];
  const makeupColors=[['原色',null],['桃粉','#d58c9a'],['杏橘','#d89b77'],['朱红','#bd6366'],['蔷薇','#b87996'],['紫荷','#a88ab1']];
  const colorPalettes=Object.freeze(Object.fromEntries(['dress','shoes','hair','headwear','mask','wings','accessory','makeup'].map((id)=>[id,(id==='hair'?hairColors:id==='makeup'?makeupColors:fabric).map(([name,color])=>({name,color}))])));
  const defaultColors=Object.freeze(Object.fromEntries(Object.keys(colorPalettes).map((id)=>[id,0])));
  const svg=(body,thumbnail,box)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail?box:'0 0 362 724'}" fill="none" stroke="none" aria-hidden="true">${body}</svg>`;
  const blossom=(x,y,color='#d99ca7',s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><g fill="${color}" stroke="#f9e5c7" stroke-width=".8">${Array.from({length:5},(_,i)=>`<ellipse cy="-5" rx="4" ry="6" transform="rotate(${i*72})"/>`).join('')}</g><circle r="2.8" fill="#dab865"/></g>`;
  const leaf=(x,y,turn=0,color='#99b18b')=>`<path d="M0 0Q-13-11 0-24Q13-11 0 0Z" transform="translate(${x} ${y}) rotate(${turn})" fill="${color}" stroke="#859977" stroke-width="1"/>`;
  const star=(x,y,r=5,color='#e4c281')=>`<path d="${Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.44:r;return `${i?'L':'M'}${x+Math.cos(a)*rr},${y+Math.sin(a)*rr}`;}).join('')}Z" fill="${color}"/>`;
  const bead=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#fff4db" stroke="#d3b982" stroke-width=".7"/>`;
  function renderMakeup(index,thumbnail=false){
    if(!index)return svg('',thumbnail,'108 106 146 112');
    const cheek=index===1||index===2||index>=12;
    const lip=index===3||index>=12;
    const tone=index===2||index===13?'#dfab88':'#df95a2';
    let art=`<defs><radialGradient id="soft-cheek"><stop stop-color="${tone}" stop-opacity=".42"/><stop offset=".6" stop-color="${tone}" stop-opacity=".22"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/></radialGradient></defs>`;
    if(cheek)art+='<ellipse cx="136" cy="181" rx="16" ry="9" fill="url(#soft-cheek)"/><ellipse cx="224" cy="181" rx="16" ry="9" fill="url(#soft-cheek)"/>';
    if(lip)art+='<path d="M171 194q5-3 9-1 4-2 9 1-9 5-18 0Z" fill="#bd717a" opacity=".48"/>';
    if(index===4||index===12)art+=blossom(180,119,'#cf8898',.32);
    if(index===5||index===15)art+=blossom(180,119,'#b9767e',.3);
    if(index===6||index===14)art+='<path d="M183 113a6 6 0 1 0 3 9 6 6 0 0 1-3-9Z" fill="#dfbc71"/>';
    if(index===7)art+='<path d="M180 125q-8-5-3-10 3 1 3 5 0-4 3-5 5 5-3 10Z" fill="#cf8b9e"/>';
    if(index===8)art+=[[-2,-1],[3,2],[7,-2]].map(([x,y])=>`<g fill="#b58b74" opacity=".55"><circle cx="${133+x}" cy="${180+y}" r=".9"/><circle cx="${225-x}" cy="${180+y}" r=".9"/></g>`).join('');
    if(index===9)art+=star(135,180,4)+star(226,180,4);
    if(index===10)art+=blossom(133,181,'#d69ca8',.27)+blossom(227,181,'#d69ca8',.27);
    if(index===11)art+='<path d="M134 180q-8-9-9-2t9 4q7 9 9 2t-9-4m92 0q-8-9-9-2t9 4q7 9 9 2t-9-4" fill="#bba4ca" opacity=".8"/>';
    if(index===13)art+=blossom(180,119,'#eee2bb',.3);
    if(index===14)art+=star(133,181,3.5)+star(227,181,3.5);
    return svg(art,thumbnail,'108 106 146 112');
  }
  function extraShoes(n,thumbnail){
    const colors=['#cdb7cb','#d9bc8b','#afc3aa','#d49b9c','#a9becb','#d5b4be'];
    const c=colors[n%6],boot=n===4||n===9;
    const shape=boot?'M-11-38h22v35l5 14q2 12-16 13-18-1-16-13l5-14Z':'M-13-11q13 8 26 0l3 21q3 14-16 14-19 0-16-14Z';
    const motifs=[
      blossom(0,6,'#f6e9cf',.55),
      '<circle cy="5" r="6" fill="#f7e6ca" stroke="#d0b78b"/><path d="m-3 1 6 8m-7-3 8-1m-5-6 2 12" stroke="#e2cb9f"/>',
      '<path d="M-4-3v17m8-18v17m-11-11h6m2 4h6m-15 5h6" stroke="#e7e5c6" stroke-width="1.7"/><path d="m4 4 6-5m-14 9-6-5" stroke="#e7e5c6" stroke-width="1.3"/>',
      '<g fill="#b96566" stroke="#efcfaa" stroke-width=".8"><ellipse cx="-4" cy="6" rx="3" ry="5" transform="rotate(-28 -4 6)"/><ellipse cx="4" cy="6" rx="3" ry="5" transform="rotate(28 4 6)"/></g><path d="M0-3v15m-4-13 4 3 4-3" stroke="#e6c699"/>',
      '<path d="M-11 7q3-9 8-2-3-13 5-10 8 0 5 10 8-5 6 3M-9 13h18" stroke="#f3dfb3" stroke-width="1.5"/>',
      '<path d="M-12-5q12 9 24 0m-23 7q11 9 22 0" stroke="#f6e8ca" stroke-width="2"/>'+blossom(0,9,'#f1c5ca',.4),
      '<path d="M0 12Q-19 4-8-4q5-2 8 6 3-8 8-6 11 8-8 16Z" fill="#c6d5b2" stroke="#edf0d7"/><path d="M0 12V1m0 8-8-7m8 7 8-7" stroke="#9db18d" stroke-width=".7"/>',
      blossom(0,5,'#dfa9b4',.55)+'<path d="M-11-6q11 6 22 0" stroke="#fff0d9" stroke-width="3"/>',
      '<path d="M0 5q-13-13-12-2t11 5q-11 10-1 9l3-9q12 10 12 0t-12-3" fill="#ead7b5" stroke="#f9ecd1" stroke-width=".9"/><path d="M0 1v13m0-13-4-4m4 4 4-4" stroke="#ba9672"/>',
      '<path d="M-7 1-9-5l6 2 3-5 3 5 6-2-2 6q6 14-7 16-13-2-7-16Z" fill="#d79b8c" stroke="#f6ddb6"/><path d="M-6 6H6m-6 0v7" stroke="#f8e4bf" stroke-width="1.2"/>',
      '<path d="M0 3c-12-11-17 3-5 5-10 12 4 15 5 3 11 11 17-3 5-5 10-12-4-15-5-3Z" stroke="#f3dfb6" stroke-width="2"/>',
      '<path d="m-11 1 8 3 3-9 3 9 8-3-6 8 3 7-8-4-8 4 3-7Z" fill="#ede2c4" stroke="#f8eeda" stroke-width=".7"/>'
    ];
    let detail=motifs[n];
    if(boot)detail+='<path d="M-10-30h20m-20 5h20" stroke="#f3dfb4" stroke-width="2"/>';
    const body=`<defs><linearGradient id="extra-shoe" x2="0" y2="1"><stop stop-color="#fbedd9"/><stop offset=".4" stop-color="${c}"/><stop offset="1" stop-color="#a6907b"/></linearGradient></defs>`+D.rig.footX.map((x,i)=>`<g data-foot="${i?'right':'left'}" data-sole="681" transform="translate(${x} 657)"><path d="${shape}" fill="url(#extra-shoe)" stroke="#ad977e" stroke-width="1.3"/><path d="M-13-10q13 8 26 0M-13 18q13 7 26 0" stroke="#fff1d8" stroke-width="1.2"/>${detail}</g>`).join('');
    return svg(body,thumbnail,'132 613 98 83');
  }
  function extraHead(n,thumbnail){
    let a='<path d="M124 97q57-9 114-3" stroke="#bea16c" stroke-width="2.6"/>';
    if(n===0)a+=blossom(127,91,'#edc1c2',.8)+blossom(235,89,'#edc1c2',.8);
    if(n===3)a+=blossom(122,92,'#d99eae',.65)+blossom(133,85,'#e7b7c5',.6)+blossom(144,93,'#d99eae',.65)+blossom(218,92,'#d99eae',.65)+blossom(229,85,'#e7b7c5',.6)+blossom(240,93,'#d99eae',.65);
    if(n===1)a+=leaf(222,94,45)+leaf(235,92,75)+blossom(235,82,'#deb9c4',.65);
    if(n===4)a+='<path d="m123 99 116-18m-116 10 116-18" stroke="#a2b6a3" stroke-width="5"/><path d="m158 89 2 8m30-13 2 8m28-13 2 8" stroke="#73947f" stroke-width="1.2"/>'+leaf(231,80,45);
    if(n===2||n===8){a+='<path d="M143 94q37-23 75 0" stroke="#c3a16c" stroke-width="6"/>';[151,181,211].forEach((x)=>a+=blossom(x,x===181?73:84,n===2?'#c78079':'#dbb0bf',x===181?1:.7));}
    if(n===5)a+='<path d="M220 85q18-19 24 0-9 18-24 0l-9-9v18Z" fill="#deb67c" stroke="#b09064"/>'+bead(236,84);
    if(n===6){a+='<path d="M139 93q42-18 84 0" stroke="#cab17b" stroke-width="3"/>';for(let i=0;i<5;i++)a+=`<g transform="translate(${151+i*15} 88)"><path d="M0 0-12-17q5-5 12-2 7-3 12 2Z" fill="#e8cc87" stroke="#bea267"/><path d="M0-1v-16m0 16-7-15m7 15 7-15" stroke="#bea267" stroke-width=".6"/></g>`;}
    if(n===7)a+='<path d="m217 86 10-12 4 13 14 4-13 4-5 12-4-14-14-3Z" fill="#b6c6bb" stroke="#8d9c91"/>'+blossom(243,95,'#e1b4b9',.55);
    if(n===9){a+='<path d="M150 92q32-31 64 0" fill="#92b8b1" stroke="#739b98" stroke-width="2"/>';[157,173,189,205].forEach((x)=>a+=leaf(x,91,0,'#b3c9bf'));a+=blossom(181,77,'#e5c8c7',.6);}
    if(n===10)a+='<path d="M129 91c-15-18-22 1-2 6-4 22 11 21 8 0 20-5 13-24-6-6m104 0c-15-18-22 1-2 6-4 22 11 21 8 0 20-5 13-24-6-6" fill="#c8898f" stroke="#af717a"/><path d="m131 101-3 23m106-23 3 23" stroke="#c8898f" stroke-width="3"/>';
    if(n===11)a+='<path d="M163 88q-13-34-5-35 11 2 15 30m18 0q4-28 14-30 10 1-5 35" fill="#f7e7d0" stroke="#c8af91"/><path d="M151 94q30-27 60 0" fill="#f1ddba" stroke="#c6a876"/>'+blossom(181,84,'#d9aab6',.75);
    return svg(a,thumbnail,'105 42 150 115');
  }
  function extraMask(n,thumbnail){
    const colors=['#dfbdc9','#d1c58d','#a9c7a7','#dec7b0','#e2b8bc','#afc5d5'];
    let art=`<path d="M122 148q30-19 59-2 29-17 59 2l-11 28q-23 9-48-5-25 14-48 5Z" fill="${colors[n]}" stroke="#af9984" stroke-width="1.3"/>`;
    if(n===0)art+=blossom(181,142,'#f2e2cc',.7);
    if(n===4)art+='<path d="m123 164 21-18m74 26 21-18" stroke="#b89580" stroke-width="1.4"/>'+blossom(135,153,'#f7dfd1',.55)+blossom(227,163,'#f7dfd1',.55);
    if(n===1)art+=leaf(181,150,0,'#edddaa');
    if(n===2)art+='<g fill="#a9c7a7" stroke="#8aa385"><circle cx="141" cy="140" r="11"/><circle cx="221" cy="140" r="11"/></g>';
    if(n===3)art+='<path d="m129 151-5-27 25 15m64 0 25-15-5 27" fill="#dec7b0" stroke="#af9984"/>';
    if(n===5)art+=star(181,142,8)+'<path d="m122 154-12-7v25l12-7m118-11 12-7v25l-12-7" fill="#d1dae0"/>';
    return svg(`<defs><mask id="extra-eyes"><rect x="90" y="90" width="180" height="100" fill="white"/><ellipse cx="151" cy="156" rx="16" ry="11" fill="black"/><ellipse cx="208" cy="156" rx="16" ry="11" fill="black"/></mask></defs><g mask="url(#extra-eyes)">${art}</g>`,thumbnail,'104 113 154 78');
  }
  function extraShawl(n,thumbnail,phase){
    const c=['#dbca8a','#a9c1aa','#a9bfd2','#d19aa2','#dfb8ca','#ece1ce'][n];
    let back='',front='';
    if(n===0||n===2||n===4){back=`<path d="M128 242C62 252 44 353 77 412q27 57-6 124l26-13c35-73 0-107-6-153-9-55 4-91 44-110m99-18c66 10 84 111 51 170-27 57 6 124 6 124l-26-13c-35-73 0-107 6-153 9-55-4-91-44-110" fill="${c}" fill-opacity=".78" stroke="#b5a18a" stroke-width="1.2"/>`;front=`<path d="M131 246q50 38 100 0" stroke="${c}" stroke-width="9"/>`;for(const [x,y]of [[77,320],[88,425],[285,320],[274,425]])back+=n===0?leaf(x,y,15,'#f3e6bb'):n===2?`<path d="m${x-7} ${y} 7-6 7 6m-7-4v8" stroke="#f4e8d3" stroke-width="1.5"/>`:blossom(x,y,'#f3d9d7',.45);}
    else if(n===5){back=`<path d="M129 241Q65 313 48 578q133 53 266 0-17-265-81-337Z" fill="${c}" stroke="#c0ac91" stroke-width="1.5"/>`;front='<path d="M129 241q52 45 104 0" stroke="#fff2de" stroke-width="12"/>'+blossom(130,249,'#dfbdc3',.7)+blossom(232,249,'#dfbdc3',.7);}
    else {front=`<path d="M130 231q-13 22-29 39 22 23 44 15 16 20 36 6 20 14 36-6 22 8 44-15-16-17-29-39-51 41-102 0Z" fill="${c}" stroke="#ab9c7c" stroke-width="1.5"/>`+[126,181,236].map((x)=>blossom(x,x===181?282:267,n===1?'#e5d5b1':'#efc7c8',.7)).join('');}
    return svg(thumbnail||!phase?back+front:phase==='front'?front:back,thumbnail,'28 211 306 385');
  }
  function extraProp(n,thumbnail){
    let a='';
    const stick='<path d="m310 400-7-68" stroke="#b4956c" stroke-width="3" stroke-linecap="round"/>';
    if(n===0){a=stick+'<circle cx="301" cy="301" r="37" fill="#faf0d9" stroke="#bea77a" stroke-width="2"/>'+leaf(302,324,0,'#e3ce8e')+leaf(303,309,-40,'#d5c38a')+leaf(303,309,40,'#d5c38a');}
    if(n===1)a=stick+'<path d="M253 322q48-68 95 0l-45 34Z" fill="#f4e0d2" stroke="#bfa283" stroke-width="1.5"/>'+blossom(302,318,'#d99aaa',1.05);
    if(n===2||n===3){a='<path d="M309 399q-16 15 6 31" stroke="#b4956c" stroke-width="2"/>';if(n===2)a+='<path d="M300 449q-8-43 3-43 12 0 12 40m13 0q0-40 12-40 11 0 3 43" fill="#f6e5cd" stroke="#c8ad8d"/><ellipse cx="322" cy="461" rx="29" ry="25" fill="#f7e8d3" stroke="#c8ad8d"/>'+blossom(322,462,'#d6a9b3',.7);else a+='<path d="M298 457q30-37 51 0-25 37-51 0l-11-15v30Z" fill="#dca892" stroke="#b98b76"/><circle cx="336" cy="453" r="2.4" fill="#776451"/>';}
    if(n===4)a='<path d="M310 400V253" stroke="#a58c66" stroke-width="3"/><path d="M225 267q84-97 137 0-67-23-137 0Z" fill="#b5c8a8" stroke="#8fa883" stroke-width="1.5"/><path d="m310 224-48 37m48-37 20 37" stroke="#dce5c6" stroke-width="1.5"/>';
    if(n===5)a='<path d="M309 399q-48-42 5-113" stroke="#b4a183" stroke-width="1.2"/><path d="m315 257-32 21 23 4 9 23 10-23 24-4Z" fill="#b7c8d2" stroke="#92a7b3" stroke-width="1.5"/><path d="m315 304-5 23 11-5-8 19" stroke="#c68e98" stroke-width="2"/>';
    if(n===6)a='<path d="M311 399q-15 10-19 31l8 42q16 13 33 0l8-42q-4-21-19-31Z" fill="#d9b6c0" stroke="#b28d99" stroke-width="1.6"/><path d="M295 428q20 10 42 0m-20-13v59" stroke="#e8d19c" stroke-width="2"/>'+blossom(317,449,'#f1e0c1',.7);
    if(n===7)a='<g stroke="#b3ab98" stroke-width="1.2"><circle cx="284" cy="358" r="11" fill="#6f736c"/><circle cx="328" cy="358" r="11" fill="#6f736c"/><ellipse cx="306" cy="403" rx="28" ry="33" fill="#f4ecdb"/><circle cx="306" cy="379" r="26" fill="#f4ecdb"/><ellipse cx="295" cy="378" rx="8" ry="10" fill="#727970"/><ellipse cx="317" cy="378" rx="8" ry="10" fill="#727970"/></g><path d="m301 388 5 4 5-4" fill="#77776b"/>';
    if(n===8)a='<path d="m310 399-10-110" stroke="#c2a16e" stroke-width="3"/>'+[304,326,348,370].map((y,i)=>`<circle cx="${301+(y-289)*.087}" cy="${y}" r="11" fill="${i%2?'#d18c7d':'#c87e72'}" stroke="#edc99a" stroke-width="1.4"/><path d="m${298+(y-289)*.087} ${y-5} 3-2" stroke="#f5d9b5" stroke-width="2"/>`).join('');
    if(n===9)a='<path d="m309 401-14-114" stroke="#c3ab73" stroke-width="10" stroke-linecap="round"/><path d="m300 311-7 1m10 16-7 1m9 16-7 1m10 16-7 1m-1-69-8 1" stroke="#907e50" stroke-width="2.5"/>';
    if(n===10){a=stick;for(let i=0;i<4;i++)a+=`<path d="M303 310q-30-34-27-2l27 2Z" transform="rotate(${i*90} 303 310)" fill="${['#dca6b5','#d9c487','#a5bfa7','#a8bfd1'][i]}" stroke="#b7a183"/>`;a+='<circle cx="303" cy="310" r="5" fill="#e8d2a2"/>';}
    if(n===11)a='<path d="M288 410q-2-63 45-1" stroke="#ae9570" stroke-width="3"/><path d="m280 407 61 0-8 44q-22 13-45 0Z" fill="#d8bd8d" stroke="#b39769" stroke-width="1.7"/>'+leaf(300,416,-30)+leaf(322,416,30)+blossom(310,400,'#ddb4c1',1.25);
    const boxes=['252 252 100 162','244 273 112 136','284 388 77 109','276 390 86 103','214 208 148 204','265 245 93 165','278 388 72 99','269 339 72 108','280 277 54 134','282 275 44 137','260 266 86 144','269 368 83 98'];
    return svg(a,thumbnail,boxes[n]);
  }
  function renderLayer(kind,index,thumbnail=false,phase){
    if(kind==='makeup')return renderMakeup(index,thumbnail);
    if(index<D[kind]?.length)return D.renderLayer(kind,index,thumbnail,phase);
    const f={shoes:extraShoes,headwear:extraHead,mask:extraMask,wings:extraShawl,accessory:extraProp}[kind];
    return f?f(index-D[kind].length,thumbnail,phase):'';
  }
  const categories=D.categories.flatMap((c)=>c.id==='hair'?[c,{id:'makeup',name:'妆容',icon:'makeup',hint:'淡淡的红脸颊，点一朵小花钿'}]:[c]);
  const icon=(name)=>name==='makeup'?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17c-4-7 0-14 7-14s11 7 7 14M8 12h.01M16 12h.01M9 17q3 2 6 0M3 15h4m10 0h4M11 5l1-2 1 2-1 2Z"/></svg>':D.icon(name);
  const collections={dress,shoes,hair,headwear,mask,wings,accessory,makeup,scene:D.scene};
  const orderedIndices=(kind,group)=>{
    const entries=collections[kind];if(group&&kind==='dress')return entries.flatMap((v,i)=>v.group===group?[i]:[]);
    if(kind==='makeup')return entries.map((_,i)=>i);
    const removable=['headwear','mask','wings','accessory'].includes(kind),first=kind==='scene'?3:6;
    return [...(removable?[0]:[]),...entries.flatMap((_,i)=>i>=first?[i]:[]),...entries.flatMap((_,i)=>i<first&&(!removable||i>0)?[i]:[])];
  };
  const complete=(look)=>({...look,makeup:0,colors:{...defaultColors}});
  window.PrincessData=Object.freeze({...D,...collections,categories,icon,orderedIndices,renderLayer,colorPalettes,defaultColors,
    defaultLook:Object.freeze(complete(D.defaultLook)),invitations:D.invitations.map((v)=>({...v,look:complete(v.look)})),
    rig:Object.freeze({...D.rig,eyes:Object.freeze([[151,156],[208,156]]),chinY:218,portraitMode:'integrated-head'})
  });
})();
