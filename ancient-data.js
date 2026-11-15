/* Chinese costume collection. Names denote artistic inspirations, not replicas. */
(() => {
  'use strict';
  const L = window.PrincessData;
  const RIG=Object.freeze({width:362,height:724,footX:Object.freeze([161,201]),shoeY:657,soleY:681,garmentTop:214,garmentBottom:640});
  const palette = ['#f8eee2','#eaf1e7','#f8e8e5','#eaf1f5','#f2ecf8','#fcf2dd'];
  const items = (entries) => entries.map((entry, index) => ({name: entry[0], era: entry[1] || '古风', group: entry[2] || 'ancient', color: palette[index % palette.length], kind: entry[3] || 0}));
  const legacy = (entries) => entries.map((entry) => ({...entry, era: '童话', group: 'fairytale'}));
  const dress = [...legacy(L.dress), ...items([
    ['商周·云纹衣裳','商周','preqin'],['春秋·青黛衣裳','春秋','preqin'],['战国·楚韵长衣','战国','preqin'],
    ['秦风·玄色长袍','秦','qinhan'],['西汉·云气曲裾','西汉','qinhan'],['东汉·兰芽襦裙','东汉','qinhan'],
    ['三国·紫苏襦裙','三国','weijin'],['西晋·竹影宽袖','西晋','weijin'],['东晋·清风衣裙','东晋','weijin'],
    ['南朝·流霞杂裾','南朝','northsouth'],['北魏·云纹袍裙','北魏','northsouth'],['北齐·间色长裙','北齐','northsouth'],
    ['隋·杏雨间色裙','隋','suitang'],['初唐·半臂春衫','初唐','suitang'],['盛唐·海棠高腰裙','盛唐','suitang'],
    ['晚唐·月白大袖','晚唐','suitang'],['五代·烟霞衣裙','五代','suitang'],['敦煌·莲华舞衣','神话','myth'],
    ['北宋·茶青褙子','北宋','songyuan'],['南宋·桂香罗衫','南宋','songyuan'],['辽·雁锦长袍','辽','songyuan'],
    ['西夏·沙柳衣裙','西夏','songyuan'],['金·紫金袍裙','金','songyuan'],['元·云锦腰线袍','元','songyuan'],
    ['明·兰庭袄裙','明','mingqing'],['明·桃夭马面裙','明','mingqing'],['明·葵花比甲','明','mingqing'],
    ['清·玉兰旗装','清·旗装','mingqing'],['清·海棠袄裙','清·汉女','mingqing'],['嫦娥·桂月仙裙','神话','myth']
  ])];
  const shoes = [...legacy(L.shoes), ...items([
    ['素绢圆头履','秦汉','ancient',0],['云纹翘头履','汉唐','ancient',1],['青竹软底履','古风','ancient',0],
    ['桃花绣鞋','古风','ancient',3],['莲瓣锦鞋','古风','ancient',1],['桂花绣鞋','古风','ancient',3],
    ['辽风锦童靴','辽风','ancient',2],['草原织锦靴','草原','ancient',2],['元风云纹靴','元风','ancient',2],
    ['月白绢履','古风','ancient',0],['朱砂如意履','古风','ancient',1],['海棠花鞋','古风','ancient',3],
    ['明风兰草鞋','明风','ancient',3],['清风软绣鞋','清风','ancient',3],['儿童虎头鞋','童趣','ancient',4],
    ['锦鲤绣花鞋','节令','ancient',3],['金线云头履','古风','ancient',1],['踏雪暖绒靴','冬日','ancient',2]
  ])];
  const hair = [...legacy(L.hair), ...items([
    ['墨色双丫髻','古风'],['灵巧双环髻','古风'],['清雅低绾髻','古风'],['小小单螺髻','古风'],
    ['垂辫双髻','古风'],['飞仙双鬟','神话'],['双螺小发髻','古风'],['轻垂双鬟','古风'],
    ['三环小高髻','古风'],['宋韵低髻','宋风'],['明韵盘髻','明风'],['清韵辫髻','清风']
  ])];
  const headwear = [...legacy(L.headwear), ...items([
    ['白玉兰簪'],['碧玉双钗'],['桃花步摇'],['金叶步摇'],['珠翠小冠'],['莲花额饰'],
    ['红梅发簪'],['竹叶银簪'],['桂花绒花'],['牡丹花钗'],['小兔绒花','童趣'],['祥瑞虎头帽','童趣'],
    ['锦绒小花球'],['锦缎发带'],['蝶恋花额饰'],['宋风珠冠','宋风'],['明风凤钗','明风'],['双燕金簪'],
    ['云纹小冠'],['莲瓣小帽'],['盘长发结'],['海棠花簪'],['珍珠流苏'],['小鹿绒角','神话']
  ])];
  const mask = [...legacy(L.mask), ...items([
    ['瑞兔月宫面罩','节令'],['小狮迎春面罩','节令'],['锦鲤戏水面罩','节令'],['荷莲花瓣面罩','节令'],
    ['青云小龙面罩','神话'],['熊猫竹影面罩','童趣'],['丹顶鹤羽面罩','神话'],['玄鸟云纹面罩','古风'],
    ['祥瑞虎头面罩','节令'],['灵鹿花枝面罩','神话'],['彩蝶绣纹面罩','节令'],['童趣戏曲面罩','戏曲']
  ])];
  const wings = [...legacy(L.wings), ...items([
    ['桃花轻披帛'],['青莲流云帛'],['桂月蓝纱帛'],['朱砂长披帛'],['竹影翠披帛'],['杏雨织金帛'],
    ['紫藤双绸带'],['月白云锦帛'],['海棠绣斗篷'],['梅雪暖斗篷'],['竹青小披风'],['锦绒冬披风'],
    ['四合如意云肩'],['莲瓣小云肩'],['金绣花云肩'],['玉兰珠云肩'],['桂月仙纱','神话'],['祥云羽衣','神话']
  ])];
  wings[0]={...wings[0],name:'轻轻取下',era:'自由搭配'};
  const accessory = [...legacy(L.accessory), ...items([
    ['荷花小团扇'],['梅花小团扇'],['竹叶小团扇'],['金边小折扇'],['双燕小折扇'],['元宵圆灯笼'],
    ['六角宫灯'],['荷花小花灯'],['桃花油纸伞'],['青竹收拢伞'],['碧玉小如意'],['白玉小如意'],
    ['一枝红梅'],['一枝桂花'],['亭亭小荷花'],['春日小花篮'],['月宫布偶兔','神话'],['小小拨浪鼓'],
    ['文房小毛笔'],['锦绣小书卷'],['平安中国结'],['蝴蝶小纸鸢'],['绣球蹴鞠'],['锦囊玉佩']
  ])];
  const scene = [...legacy(L.scene), ...items([
    ['竹林小径'],['荷塘水榭'],['宫苑牡丹'],['宋院茶亭','宋风'],['江南小桥'],['塞北草原'],
    ['元宵灯街','节令'],['梅雪庭院','冬日'],['月宫桂树','神话']
  ])].map((entry,index)=>({...entry,focusY:[2,11].includes(index)?.08:.5}));
  const svg = (body, thumbnail, box) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${thumbnail ? box : '0 0 362 724'}" aria-hidden="true">${body}</svg>`;
  const flower = (x,y,color='#dca4aa',scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><g fill="${color}" stroke="#fff4dc" stroke-width=".7">${Array.from({length:5},(_,i)=>`<ellipse cy="-5" rx="4" ry="6.4" transform="rotate(${i*72})"/>`).join('')}</g><circle r="3" fill="#e2bd73"/><circle r="1" fill="#fff5cd"/></g>`;
  const leaf = (x,y,color='#8da582',turn=0) => `<path d="M0 0Q-10-15 0-23 12-12 0 0Z" transform="translate(${x} ${y}) rotate(${turn})" fill="${color}" stroke="#9da97c" stroke-width=".8"/>`;
  const tassel = (x,y,color='#c39085',length=27) => `<g stroke="${color}" stroke-linecap="round"><path d="M${x} ${y}v${length-9}" stroke-width="1.5"/><circle cx="${x}" cy="${y+length-10}" r="3" fill="#e2c286"/>${[-3,-1,1,3].map((dx)=>`<path d="M${x} ${y+length-8}l${dx} 14" stroke-width="1.3"/>`).join('')}</g>`;
  const gold = '<defs><linearGradient id="china-gold" x2="0" y2="1"><stop stop-color="#f5e1ab"/><stop offset=".5" stop-color="#d5b46c"/><stop offset="1" stop-color="#b78d4e"/></linearGradient></defs>';
  const shoeColors = [['#f3e4c7','#bfa67c'],['#e5b4b7','#b27b81'],['#afc5ad','#718e76'],['#b6cedd','#829bae'],['#d1bdde','#9d83b6'],['#e4c784','#b4914e']];
  function renderShoes(index, thumbnail) {
    const local = index < 6 ? index : index - 6;
    const kind = index < 6 ? [3,0,0,1,0,3][index] : shoes[index].kind;
    const [color,edge] = shoeColors[local % shoeColors.length];
    const shape = kind === 2 ? 'M-11-38h22v35l5 14q2 12-16 13-18-1-16-13l5-14Z' : kind === 1 ? 'M-13-10q13 9 26 0l4 18q6 8-1 12-16 8-32 0-7-4-1-12Z' : 'M-13-11q13 8 26 0l3 21q3 14-16 14-19 0-16-14Z';
    const motif = local % 6;
    const decoration = kind === 4 ? '<g fill="#e1bc71" stroke="#b58b4e"><circle cx="-8" cy="-10" r="5"/><circle cx="8" cy="-10" r="5"/></g><path d="m-9 5 5 3-5 1m18-4-5 3 5 1" fill="none" stroke="#916847" stroke-width="1.5"/><path d="m-3 10 3 3 3-3" fill="#88644c"/>' : motif === 0 ? `${flower(0,5,'#f7edce',.5)}` : motif === 1 ? '<path d="M-10 8q5-11 10-2 5-9 10 0m-17 7q7-7 13 0" fill="none" stroke="#f5e6ba" stroke-width="1.7"/>' : motif === 2 ? `${leaf(0,12,'#dee8cc',-25)}` : motif === 3 ? `${flower(0,5,'#f6d5da',.6)}` : motif === 4 ? '<path d="m0-4 9 10-9 9-9-9Z" fill="#e7dceb" stroke="#f8eed0"/>' : '<path d="M-9 5q9-12 18 0-9 14-18 0Z" fill="#e9b595" stroke="#f7ddb9"/><path d="m9 5 5-6v12Z" fill="#e9b595"/>';
    const body = `<defs><linearGradient id="aligned-shoe-${index}" x2="0" y2="1"><stop stop-color="#fff2da"/><stop offset=".33" stop-color="${color}"/><stop offset="1" stop-color="${edge}"/></linearGradient></defs>${RIG.footX.map((x,side)=>`<g id="shoe-${side ? 'right':'left'}" data-foot="${side ? 'right':'left'}" data-sole="${RIG.soleY}" transform="translate(${x} ${RIG.shoeY})"><path d="${shape}" fill="url(#aligned-shoe-${index})" stroke="${edge}" stroke-width="1.3"/><path d="M-13-10q13 8 26 0M-13 18q13 7 26 0" fill="none" stroke="#fff2d8" stroke-width="1.2"/>${kind===2?'<path d="M-10-30h20M-10-24h20" stroke="#e6cca0" stroke-width="1.4"/>':''}${decoration}</g>`).join('')}`;
    return svg(body, thumbnail, '132 613 98 83');
  }
  function renderHead(index, thumbnail) {
    const n=index-6;
    let art='';
    const stick='<path d="M119 92q60 12 124-4" fill="none" stroke="#c1a065" stroke-width="3"/>';
    if ([0,2,6,8,9,10,12,21].includes(n)) {
      art=stick+leaf(226,94,'#94ad88',42)+flower(226,85,n===6?'#bd777e':n===0?'#f7eed9':n===9?'#d69ca8':'#edc8b7',n===9?1.6:1.1)+flower(242,96,'#f2dfc9',.65);
      if(n===2||n===8)art+=tassel(246,103,'#c7a06f',33)+tassel(254,104,'#d6b978',22);
      if(n===10)art+='<g fill="#fbefdb" stroke="#d7bba0"><ellipse cx="223" cy="67" rx="3" ry="10" transform="rotate(-18 223 67)"/><ellipse cx="232" cy="65" rx="3" ry="10" transform="rotate(15 232 65)"/><ellipse cx="229" cy="80" rx="9" ry="7"/></g>';
      if(n===12)art+='<g fill="#d9b78b"><circle cx="132" cy="84" r="8"/><circle cx="143" cy="76" r="6"/></g>';
    } else if(n===1||n===7||n===3) {
      art='<path d="m117 99 125-17M123 110l121-18" stroke="#b8a575" stroke-width="2.5"/>'+leaf(232,80,n===7?'#cbd3ce':'#a8bdab',35)+leaf(238,89,n===7?'#d5d9d2':'#a8bdab',75);
      if(n===3)art+=tassel(241,98,'#c9a35f',34)+flower(235,87,'#e6c17c',.65);
    } else if([4,15,18].includes(n)) {
      art='<path d="M132 95q49-11 98 0l-7-29-18 15-24-28-24 28-18-15Z" fill="url(#china-gold)" stroke="#b89559" stroke-width="1.3"/><path d="M134 96q47 6 94 0" fill="none" stroke="#e9d9ad" stroke-width="5"/>';
      for(let i=0;i<7;i++)art+=`<circle cx="${140+i*14}" cy="${92-Math.sin(i/6*Math.PI)*9}" r="2.6" fill="#fff5d8" stroke="#c4ae7e" stroke-width=".6"/>`;
      art+=flower(181,78,n===15?'#b4c8c0':'#dfadb7',.7);
    } else if(n===5||n===14) {
      art='<path d="M122 109q59 16 118 0" fill="none" stroke="#d8bb7e" stroke-width="2"/>'+flower(181,119,n===5?'#edc2c9':'#d59fa9',.7);
      if(n===14)art+='<path d="M181 108q-17-18-22-7t22 12q22-1 22-12t-22 7" fill="#c6b6d4" stroke="#a58cb9"/>';
    } else if(n===11) {
      art='<path d="M119 117q-6-62 62-62t62 62q-62-15-124 0Z" fill="#dab470" stroke="#b99151" stroke-width="1.5"/><g fill="#f5d8a3" stroke="#ba9254"><circle cx="128" cy="63" r="14"/><circle cx="234" cy="63" r="14"/></g><path d="m151 88 13 5m34 0 13-5m-42 12 12 9 12-9" stroke="#7e654b" stroke-width="3" fill="none"/><path d="m145 104 17 2m38 0 17-2" stroke="#fff1d1" stroke-width="3"/>';
    } else if(n===13||n===20) {
      art='<path d="M122 101q59-15 118 0" fill="none" stroke="#bb7c87" stroke-width="8"/><path d="M180 95c-30-30-40-5-8 7-21 22 2 32 10 8 12 24 32 8 10-9 33-9 19-36-12-6Z" fill="#dca8b2" stroke="#b87f8b" stroke-width="1"/>';
      if(n===20)art+='<path d="m181 103-7 16 14 0-7-16Z" fill="#d9b775"/>';
    } else if(n===16||n===17) {
      art=stick+'<path d="M214 84q10-22 16-8l17 12-20-3q-9 17-26 6l14-2Z" fill="url(#china-gold)" stroke="#b18c51" stroke-width="1"/>'+tassel(229,98,'#c7a265',27);
      if(n===17)art+='<path d="M141 91q-12-14-18-4l-12 6 17-1q7 9 17 4Z" fill="#d2b475"/>';
    } else if(n===19) {
      art='<path d="M129 111q-1-48 52-51 53 3 52 51Z" fill="#c1cdb0" stroke="#9aa77d"/><path d="M132 108q12-38 25-25 24-45 48 0 15-15 26 25" fill="#f0d9d1" stroke="#b99891" stroke-width="1.2"/>'+flower(181,85,'#f8e8d4',.9);
    } else if(n===22) {
      art='<path d="M126 97q55 17 110 0" fill="none" stroke="#dccba2" stroke-width="2"/>';
      for(let i=0;i<8;i++)art+=`<circle cx="${132+i*14}" cy="${105+Math.sin(i/7*Math.PI)*13}" r="3" fill="#fff5df" stroke="#d3c09b" stroke-width=".6"/>`;
      art+=tassel(239,112,'#d8bf8f',31);
    } else {
      art='<path d="M135 98q-12-21-9-40m8 19-15-9m11-4 9-13m89 47q12-21 9-40m-8 19 15-9m-11-4-9-13" fill="none" stroke="#c6ad87" stroke-width="6" stroke-linecap="round"/>'+flower(131,97,'#e6b3bd',.65)+flower(231,97,'#f3dfcb',.65);
    }
    return svg(gold+art,thumbnail,'100 37 163 165');
  }
  function renderMask(index, thumbnail) {
    const n=index-6;
    const colors=[['#f8e7da','#d0a99d'],['#e4bc76','#ba8c4e'],['#e4ad9f','#b87f76'],['#e2bdcf','#b28fa5'],['#b8cdb6','#7d9f83'],['#ebe8dc','#9b9a8c'],['#e6e0d3','#ad9e88'],['#a8bec9','#718f9c'],['#ddba80','#af8c56'],['#d0ba9b','#a48b6c'],['#c8b8dc','#9d86b7'],['#e4a79e','#a56c66']][n];
    let shape='M123 147q24-18 58 1 34-19 58-1l-10 33q-21 9-48-7-27 16-48 7Z';
    let art='';
    if(n===0)art+='<path d="M139 146c-17-50 2-59 12-10 10-49 28-34 10 12m42-2c-17-50 2-59 12-10 10-49 28-34 10 12" fill="#f5e8d9" stroke="#d1b1a2" stroke-width="1.4"/>';
    if(n===1||n===8||n===5)art+=`<g fill="${n===5?'#686a65':colors[0]}" stroke="${colors[1]}" stroke-width="1.2"><circle cx="135" cy="137" r="13"/><circle cx="227" cy="137" r="13"/></g>`;
    if(n===4||n===9)art+='<path d="M135 146q-11-20-8-37m5 17-13-7m11-3 7-12m88 42q11-20 8-37m-5 17 13-7m-11-3-7-12" fill="none" stroke="#b5a17d" stroke-width="4" stroke-linecap="round"/>';
    art+=`<path d="${shape}" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="1.6"/>`;
    if(n===3||n===10)art+=flower(181,140,'#e4b2bf',.75)+leaf(134,159,'#c1cfaf',-40)+leaf(228,159,'#c1cfaf',40);
    else if(n===2)art+='<path d="m126 155-12-12v29l12-6m110-11 12-12v29l-12-6" fill="#efccad" stroke="#c18e7a"/><path d="m173 144 8-8 8 8" fill="#efcfb2"/>';
    else if(n===6||n===7)art+='<path d="m123 151-17-6 11 15-15 0 21 10m116-19 17-6-11 15 15 0-21 10" fill="#e9e6d8" stroke="#aab1ad" stroke-width="1.2"/>';
    else if(n===11)art+='<path d="M137 143q17 1 23 14m65-14q-17 1-23 14m-31 19q10-10 20 0" fill="none" stroke="#fff6dc" stroke-width="4"/><path d="m176 143 5-7 5 7" fill="#cf7b72"/>';
    else art+='<path d="m174 170 7 5 7-5" fill="#b68682"/><path d="M133 173h11m74 0h11" stroke="#d59e9b" stroke-width="2"/>';
    const id=`antique-eye-${n}`;
    return svg(`<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="90" y="90" width="190" height="110"><rect x="90" y="90" width="190" height="110" fill="white"/><ellipse cx="151" cy="156" rx="16" ry="11" fill="black"/><ellipse cx="208" cy="156" rx="16" ry="11" fill="black"/></mask></defs><g mask="url(#${id})">${art}</g>`,thumbnail,'98 92 166 110');
  }
  function renderShawl(index, thumbnail, phase) {
    const n=index-6; const [color,edge]=shoeColors[n%6];
    let back='',front='';
    if(n<8) {
      back=`<path d="M127 242C74 247 39 311 48 380c8 59 47 85 12 161l27-11c32-49 19-94-1-143-20-52 3-111 48-125m101-20c53 5 88 69 79 138-8 59-47 85-12 161l-27-11c-32-49-19-94 1-143 20-52-3-111-48-125" fill="${color}" fill-opacity=".83" stroke="${edge}" stroke-width="1.2"/><path d="M121 251C79 271 64 327 69 369m172-118c42 20 57 76 52 118" fill="none" stroke="#f9e5bd" stroke-width="1.5"/>`;
      front=`<path d="M131 245q50 52 100 0" fill="none" stroke="${color}" stroke-width="11" opacity=".85"/><path d="M133 245q48 47 96 0" fill="none" stroke="#ead3aa" stroke-width="1"/>`;
    } else if(n<12) {
      back=`<path d="M128 239Q60 301 45 580q136 57 272 0-15-279-83-341Z" fill="${color}" stroke="${edge}" stroke-width="1.7"/><path d="M64 574q117 39 234 0" fill="none" stroke="#eddbb6" stroke-width="6"/>`;
      front=`<path d="M128 240q53 41 106 0" fill="none" stroke="${n===9||n===11?'#f5e9d6':edge}" stroke-width="10"/>${flower(130,247,'#ebc4c5',.7)}${flower(232,247,'#ebd7b8',.7)}`;
    } else if(n<16) {
      front=`<path d="M130 230q-14 22-28 40 16 20 38 17 17 22 41 5 24 17 41-5 22 3 38-17-14-18-28-40-50 44-102 0Z" fill="${color}" stroke="${edge}" stroke-width="1.6"/>${flower(126,270,'#f6e6cf',.8)}${flower(181,282,'#e0b4bd',.8)}${flower(236,270,'#f4dfba',.8)}${tassel(148,286,'#ccb174',20)}${tassel(214,286,'#ccb174',20)}`;
    } else if(n===16) {
      back='<circle cx="181" cy="203" r="134" fill="#f7e7b9" fill-opacity=".25" stroke="#dfc57e" stroke-width="2"/><circle cx="181" cy="203" r="126" fill="none" stroke="#f1dba7" stroke-width="1"/>';
    } else {
      back='<path d="M131 241C81 212 20 248 39 323c-24 53 9 120 48 119l40-100m108-101c50-29 111 7 92 82 24 53-9 120-48 119l-40-100" fill="#d5e3dc" fill-opacity=".65" stroke="#acbfb2" stroke-width="1.5"/><path d="M47 312q21-20 48 0m172 0q27-20 48 0" fill="none" stroke="#f5e9c9" stroke-width="3"/>';
    }
    return svg(thumbnail || !phase ? back+front : phase==='front'?front:back, thumbnail,'20 205 322 400');
  }
  function renderProp(index, thumbnail) {
    const n=index-6; let art='';
    const handle='<path d="m310 401-6-69" stroke="#b8996c" stroke-width="3" stroke-linecap="round"/>';
    if(n<3) {
      art=handle+`<circle cx="300" cy="306" r="38" fill="#fbf0d8" stroke="#bda476" stroke-width="2"/><circle cx="300" cy="306" r="34" fill="none" stroke="#e3cda5" stroke-width="1"/>`;
      if(n===0)art+='<path d="M300 329v-22m-1 7q-24 6-19-12 12-9 21 6 9-15 20-6 4 18-20 12Z" fill="#a8bc96" stroke="#91a77e"/>'+flower(301,298,'#e2b5c0',1.05);
      else if(n===1)art+='<path d="m282 327 33-44m-21 27-10-3m18-10 11-1" stroke="#9b7d65" stroke-width="2"/>'+flower(292,315,'#d2a0a7',.65)+flower(308,292,'#e4b6bb',.65);
      else art+='<path d="M299 331v-49m1 20q-21-5-16-14 14-1 16 14m-1 13q20-4 20-14-13-2-20 14" stroke="#88a080" fill="#9eaf8b" stroke-width="1.3"/>';
    } else if(n<5) {
      art='<path d="m310 401-7-69" stroke="#bba174" stroke-width="3"/><path d="M249 322q49-71 100 0l-46 37Z" fill="#f1e2be" stroke="#bca072" stroke-width="1.5"/>';
      for(let i=0;i<7;i++)art+=`<path d="m303 358 ${-50+i*16} -38" stroke="#c7b28a" stroke-width=".8"/>`;
      art+=n===3?flower(302,323,'#d7adb3',.9):'<path d="m279 324 13-8 12 8m6-11 10-7 10 7" fill="none" stroke="#8f9d91" stroke-width="2"/>';
    } else if(n<8) {
      art='<path d="M309 399q-17 15 8 30" fill="none" stroke="#b99a6d" stroke-width="2"/>';
      if(n===5)art+='<ellipse cx="321" cy="458" rx="29" ry="34" fill="#dfae90" stroke="#bd876f" stroke-width="1.5"/><path d="M302 431q-8 27 0 54m19-60v66m19-60q8 27 0 54" fill="none" stroke="#f8dca5" stroke-width="1.3"/>';
      else if(n===6)art+='<path d="m302 430 37 0 10 16-10 42h-37l-10-42Z" fill="#e8c993" stroke="#bfa272" stroke-width="1.5"/><path d="M302 431v57m37-57v57m-46-41h55" stroke="#f4e5bd" stroke-width="2"/>';
      else art+='<path d="M321 488c-48-16-40-62-16-49 3-26 27-26 32 0 25-10 32 33-16 49Z" fill="#e4b7c0" stroke="#bd95a4" stroke-width="1.5"/><path d="M321 486v-43m-12 37-7-33m30 33 8-33" stroke="#f7ddcf" stroke-width="1.4"/>';
      art+=tassel(321,489,'#c8a46e',21)+'<path d="M302 427h37m-37 63h37" stroke="#b9965b" stroke-width="4"/>';
    } else if(n===8) {
      art='<path d="m310 401-17-143" stroke="#b09365" stroke-width="3"/><path d="M215 265q74-116 136 0-72-27-136 0Z" fill="#e8bfba" stroke="#c29e8f" stroke-width="1.6"/><path d="m291 214-67 47m67-47-25 43m25-43 25 43m-25-43 52 47" stroke="#c9a89b" stroke-width="1"/>'+flower(263,251,'#f7e8d1',.7);
    } else if(n===9) {
      art='<path d="m310 401 10-163" stroke="#a58861" stroke-width="3"/><path d="m320 248-16 90 10 28 20-27Z" fill="#b6c8ae" stroke="#8fa583" stroke-width="1.4"/><path d="m320 250-6 108m6-108 7 88" stroke="#dce3c5" stroke-width="1"/>';
    } else if(n<12) {
      art=`<path d="m310 401 13-82q-30-37 2-37 32 0 5 30l-20 89" fill="none" stroke="${n===10?'#a8c3af':'#e2d4b1'}" stroke-width="10" stroke-linecap="round"/><path d="M314 291q12-12 23 0" fill="none" stroke="#f9eed0" stroke-width="2"/>`;
    } else if(n<15) {
      art='<path d="M310 401q-6-55 11-98m-8 61-17-17m22-2 16-17" fill="none" stroke="#8fa077" stroke-width="2.5"/>';
      art+=n===12?flower(321,304,'#c7838b',1)+flower(300,345,'#dba2aa',.65)+flower(332,328,'#e1b7ba',.75):n===13?flower(319,306,'#efd59a',.75)+flower(327,319,'#e9cc81',.65)+flower(302,343,'#f1dcab',.65):'<path d="M320 315q-28-4-24-22 15 0 24 14 9-14 23-14 4 18-23 22Z" fill="#e2acbd" stroke="#bc8d9e"/>';
    } else if(n===15) {
      art='<path d="M310 400q-36 16-26 41h56q10-25-30-41Z" fill="none" stroke="#b29a6d" stroke-width="3"/><path d="M281 433h61l-10 39h-41Z" fill="#d7ba89" stroke="#b29b71" stroke-width="1.5"/><path d="M288 445h47m-45 10h42" stroke="#eddbb4" stroke-width="2"/>'+flower(302,429,'#dfaeb4',.9)+flower(323,427,'#f4e6ce',.9)+leaf(317,429,'#9fb28d',15);
    } else if(n===16) {
      art='<g fill="#f6ead9" stroke="#cdb4a1" stroke-width="1.3"><ellipse cx="320" cy="439" rx="24" ry="31"/><ellipse cx="316" cy="412" rx="23" ry="20"/><ellipse cx="305" cy="386" rx="6" ry="22" transform="rotate(-13 305 386)"/><ellipse cx="322" cy="383" rx="6" ry="23" transform="rotate(8 322 383)"/></g><g fill="#9e7a6b"><circle cx="309" cy="412" r="2"/><circle cx="323" cy="412" r="2"/></g><path d="m314 420 3 3 3-3" fill="#d7a3a8"/>';
    } else if(n===17) {
      art='<path d="m310 401 8-75" stroke="#b99a6b" stroke-width="4"/><circle cx="320" cy="316" r="24" fill="#e4c692" stroke="#b38560" stroke-width="3"/><circle cx="320" cy="316" r="19" fill="#f5e4be" stroke="#b38560"/><path d="m297 309-11-10m56 10 11-10" stroke="#c19b70" stroke-width="2"/><circle cx="283" cy="297" r="4" fill="#c58d81"/><circle cx="357" cy="297" r="4" fill="#c58d81"/>'+flower(320,316,'#d8a3a8',.6);
    } else if(n===18) {
      art='<path d="m310 401 17-113" stroke="#8a775e" stroke-width="5"/><path d="m328 283 4-22-12 18Z" fill="#656661"/><path d="m310 401-2 15" stroke="#dec69b" stroke-width="6"/>';
    } else if(n===19) {
      art='<path d="m279 388 63 10-9 36-62-10Z" fill="#dfcc9f" stroke="#b49b70" stroke-width="1.7"/><path d="m280 387-8 37m68-27-8 38" stroke="#bc9761" stroke-width="7"/><path d="m294 397 27 5m-29 3 25 5m-27 3 23 4" stroke="#a1a184" stroke-width="1"/>';
    } else if(n===20) {
      art='<path d="m310 400 10 23m0 0-14 15 14 15 14-15-14-15Zm0 13-15-14m15 14 15-14m-15 14-15 14m15-14 15 14" fill="none" stroke="#c89187" stroke-width="4"/>'+tassel(320,455,'#c89187',23);
    } else if(n===21) {
      art='<path d="M310 401q-23-56 7-113" fill="none" stroke="#b8a47d" stroke-width="1.2"/><path d="M317 277c-38-38-42-4-15 7-29 18-7 34 15 2 22 32 44 16 15-2 27-11 23-45-15-7Z" fill="#c2b5da" stroke="#9e90b6" stroke-width="1.5"/><path d="M317 278v15" stroke="#c8ae77" stroke-width="2"/>';
    } else if(n===22) {
      art='<circle cx="318" cy="414" r="29" fill="#d9c097" stroke="#b59d76" stroke-width="1.6"/><path d="m317 397 14 10-5 17h-18l-5-17Zm-14 10-13 3m36 14 9 12m-27-12-9 12" fill="none" stroke="#a99470" stroke-width="1.5"/>';
    } else {
      art='<path d="M310 401q-18 17 11 30" fill="none" stroke="#bf9e76" stroke-width="1.8"/><path d="m302 430 34 0 6 35-23 15-22-16Z" fill="#c5b7cf" stroke="#a192ae" stroke-width="1.5"/><circle cx="320" cy="450" r="12" fill="#b2c6b1" stroke="#8aa58c"/><circle cx="320" cy="450" r="4" fill="#d2c3ca"/>'+tassel(320,480,'#bd9b79',16);
    }
    return svg(art,thumbnail,'205 205 157 310');
  }
  function renderLayer(kind, index, thumbnail=false, phase) {
    if(kind==='shoes')return renderShoes(index,thumbnail);
    if(index<6) {
      if(kind==='wings' && phase==='front')return '';
      return ({headwear:L.headwearSvg, mask:L.maskSvg, wings:L.wingsSvg, accessory:L.accessorySvg}[kind])(index,thumbnail);
    }
    return ({headwear:renderHead,mask:renderMask,wings:renderShawl,accessory:renderProp}[kind])(index,thumbnail,phase);
  }
  const icon = (name) => name==='shawl' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5C3 6 1 11 3 17l4 3 1-5M16 5c5 1 7 6 5 12l-4 3-1-5M8 5q4 4 8 0M8 8q4 4 8 0"/></svg>' : L.icon(name);
  const groups = [
    {id:'preqin',name:'先秦衣裳',detail:'商周、春秋、战国',dress:6},
    {id:'qinhan',name:'秦汉长衣',detail:'秦风、西汉、东汉',dress:10},
    {id:'weijin',name:'三国两晋',detail:'三国、西晋、东晋',dress:14},
    {id:'northsouth',name:'南北朝风',detail:'南朝、北魏、北齐',dress:17},
    {id:'suitang',name:'隋唐五代',detail:'隋、初唐、盛唐、晚唐、五代',dress:20},
    {id:'songyuan',name:'宋辽夏金元',detail:'北宋、南宋、辽、西夏、金、元',dress:26},
    {id:'mingqing',name:'明清华服',detail:'袄裙、比甲、马面裙与旗装',dress:31},
    {id:'myth',name:'神话仙衣',detail:'敦煌、嫦娥的童话灵感',dress:35},
    {id:'fairytale',name:'童话衣橱',detail:'保留原有童话裙装',dress:0}
  ];
  const orderedIndices = (kind, group) => {
    const entries={dress,shoes,hair,headwear,mask,wings,accessory,scene}[kind];
    if(group && kind==='dress')return entries.flatMap((item,index)=>item.group===group?[index]:[]);
    const removable=['headwear','mask','wings','accessory'].includes(kind);
    const firstNew=kind==='scene'?3:6;
    return [...(removable?[0]:[]),...entries.flatMap((_,index)=>index>=firstNew?[index]:[]),...entries.flatMap((_,index)=>index<firstNew && (!removable||index>0)?[index]:[])].filter((value,index,all)=>all.indexOf(value)===index);
  };
  const makeLook=(dress,shoes,hair,headwear,accessory,scene,wings=0,mask=0)=>({dress,shoes,hair,headwear,accessory,scene,wings,mask});
  const invitations=[
    {name:'汉风春游',detail:'穿上云气长衣，去荷塘找一朵小荷花。',scene:4,look:makeLook(10,6,6,6,20,4)},
    {name:'晋风竹林',detail:'带上小书卷，听竹叶沙沙唱歌。',scene:3,look:makeLook(14,8,8,13,25,3)},
    {name:'隋朝踏青',detail:'穿上间色裙，去小桥边看看春天。',scene:7,look:makeLook(18,9,7,8,18,7,6)},
    {name:'唐苑赏花',detail:'带一把小团扇，去牡丹花园做客。',scene:5,look:makeLook(20,10,11,15,6,5,7)},
    {name:'宋院茶亭',detail:'给小花闻闻香，在院子里讲个故事。',scene:6,look:makeLook(25,11,15,21,19,6)},
    {name:'塞北小游',detail:'穿好小靴子，去草原追一阵轻轻的风。',scene:8,look:makeLook(26,12,10,7,28,8)},
    {name:'明风游园',detail:'穿上桃夭马面裙，去桥边看看小燕子。',scene:7,look:makeLook(31,18,16,22,10,7,18)},
    {name:'元宵灯会',detail:'提上一盏小花灯，去找最喜欢的月亮。',scene:9,look:makeLook(34,19,17,17,12,9,14)},
    {name:'月宫做客',detail:'带上布偶小兔，去桂花树下听童话。',scene:11,look:makeLook(35,15,11,11,22,11,22)},
    ...L.invitations
  ];
  window.PrincessData=Object.freeze({...L,icon,dress,shoes,hair,headwear,mask,wings,accessory,scene,groups,orderedIndices,renderLayer,invitations,
    categories:L.categories.map((entry)=>entry.id==='dress'?{...entry,name:'衣裳',hint:'点一件喜欢的衣裳，穿上就出发'}:entry.id==='wings'?{...entry,name:'披帛',icon:'shawl',hint:'披帛、云肩、斗篷，轻轻搭一件'}:entry.id==='hair'?{...entry,hint:'给小公主梳一个漂亮的发髻'}:entry.id==='scene'?{...entry,name:'场景'}:entry),
    defaultLook:Object.freeze(makeLook(10,6,6,6,6,4)),
    rig:RIG
  });
})();
