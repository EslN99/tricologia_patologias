(function(){
  var doc=document;
  /* menu mobile */
  var mnav=doc.getElementById('mnav');
  function menu(open){mnav.classList.toggle('open',open);mnav.setAttribute('aria-hidden',open?'false':'true');doc.body.style.overflow=open?'hidden':'';}
  doc.getElementById('menuOpen').addEventListener('click',function(){menu(true);});
  doc.getElementById('menuClose').addEventListener('click',function(){menu(false);});
  mnav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu(false);});});

  /* cards de tratamento e acordeão da história */
  doc.querySelectorAll('.js-toggle').forEach(function(b){
    b.addEventListener('click',function(){
      var box=b.closest('.tcard')||b.closest('.acc');
      var open=!box.classList.contains('open');
      if(box.classList.contains('tcard')){
        doc.querySelectorAll('.tcard.open').forEach(function(o){if(o!==box){o.classList.remove('open');var ob=o.querySelector('.js-toggle');ob.setAttribute('aria-expanded','false');ob.querySelector('span').textContent=ob.dataset.closed;}});
        b.querySelector('span').textContent=open?b.dataset.open:b.dataset.closed;
      }
      box.classList.toggle('open',open);
      b.setAttribute('aria-expanded',open?'true':'false');
    });
  });

  /* FAQ: um aberto por vez */
  doc.querySelectorAll('.fq-b').forEach(function(b){
    b.addEventListener('click',function(){
      var item=b.parentElement,open=!item.classList.contains('open');
      doc.querySelectorAll('.fq.open').forEach(function(o){o.classList.remove('open');o.querySelector('.fq-b').setAttribute('aria-expanded','false');});
      item.classList.toggle('open',open);b.setAttribute('aria-expanded',open?'true':'false');
    });
  });

  /* revelar ao rolar */
  var items=doc.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){io.observe(el);});
  }else{items.forEach(function(el){el.classList.add('in');});}

  /* header sólido e parallax */
  var hdr=doc.getElementById('hdr'),pxs=doc.querySelectorAll('.px'),tick=false;
  function onScroll(){
    if(tick)return;tick=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||doc.documentElement.scrollTop;
      hdr.classList.toggle('solid',y>40);
      pxs.forEach(function(el){var r=el.parentElement.getBoundingClientRect(),vh=window.innerHeight;if(r.bottom<0||r.top>vh)return;var sp=parseFloat(el.dataset.speed)||.1;var slack=(el.offsetHeight-r.height)/2;var t=-(r.top+r.height/2-vh/2)*sp;t=Math.max(-slack,Math.min(slack,t));el.style.transform='translate3d(0,'+t.toFixed(1)+'px,0)';});
      tick=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* carrosséis: botões, arraste com mouse e swipe com dedo */
  function cards(tr){return Array.prototype.slice.call(tr.querySelectorAll('.card-s'));}
    /* posição de cada card dentro do trilho, independente do layout da página */
  function pos(tr,c){
    var raw=c.getBoundingClientRect().left-tr.getBoundingClientRect().left+tr.scrollLeft;
    if((getComputedStyle(c).scrollSnapAlign||'').indexOf('center')>-1) return raw-(tr.clientWidth-c.offsetWidth)/2;
    return raw-(parseFloat(getComputedStyle(tr).paddingLeft)||0);
  }
  function nearest(tr){
    var best=0,d=1e9;
    cards(tr).forEach(function(c,i){var x=Math.abs(pos(tr,c)-tr.scrollLeft);if(x<d){d=x;best=i;}});
    return best;
  }
  function goTo(tr,i){
    var list=cards(tr);if(!list.length)return;
    var max=tr.scrollWidth-tr.clientWidth;
    i=Math.max(0,Math.min(list.length-1,i));
    tr.scrollTo({left:Math.max(0,Math.min(pos(tr,list[i]),max)),behavior:'smooth'});
  }
  function slide(id,dir){
    var tr=doc.getElementById(id);if(!tr)return;
    var max=tr.scrollWidth-tr.clientWidth;
    if(dir>0&&tr.scrollLeft>=max-4){tr.scrollTo({left:0,behavior:'smooth'});return;}
    if(dir<0&&tr.scrollLeft<=4){tr.scrollTo({left:max,behavior:'smooth'});return;}
    goTo(tr,nearest(tr)+dir);
  }
  doc.querySelectorAll('[data-track]').forEach(function(b){b.addEventListener('click',function(){slide(b.dataset.track,parseInt(b.dataset.dir,10));});});

  doc.querySelectorAll('.track').forEach(function(tr){
    tr.querySelectorAll('img').forEach(function(im){im.setAttribute('draggable','false');});
    tr.setAttribute('tabindex','0');
    var bar=doc.querySelector('.prog[data-for="'+tr.id+'"] span');
    var raf=0;
    function upd(){
      raf=0;if(!bar)return;
      var max=tr.scrollWidth-tr.clientWidth;
      var vis=Math.max(tr.clientWidth/tr.scrollWidth*100,12);
      var p=max>0?tr.scrollLeft/max:1;
      bar.style.width=(vis+(100-vis)*p)+'%';
    }
    tr.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
    window.addEventListener('resize',upd);upd();

    /* teclado: setas quando o carrossel está em foco */
    tr.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();slide(tr.id,1);}
      if(e.key==='ArrowLeft'){e.preventDefault();slide(tr.id,-1);}
    });

    /* mouse: arrastar com inércia e encaixe no card mais próximo.
       Toque usa a rolagem nativa do navegador, mais fluida no celular. */
    var down=false,moved=false,sx=0,sl=0,lx=0,lt=0,v=0;
    tr.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      down=true;moved=false;sx=lx=e.clientX;sl=tr.scrollLeft;lt=performance.now();v=0;
    });
    window.addEventListener('pointermove',function(e){
      if(!down)return;
      var dx=e.clientX-sx;
      if(!moved&&Math.abs(dx)>6){moved=true;tr.classList.add('drag');}
      if(!moved)return;
      var now=performance.now();v=(e.clientX-lx)/Math.max(now-lt,1);lx=e.clientX;lt=now;
      tr.scrollLeft=sl-dx;
    });
    window.addEventListener('pointerup',function(){
      if(!down)return;down=false;
      if(!moved)return;
      tr.classList.remove('drag');
      var i=nearest(tr),dx=tr.scrollLeft-sl;
      /* gesto rápido ou arraste curto já avança um card */
      if((v<-0.35||dx>40)&&pos(tr,cards(tr)[i])<=sl+2)i++;
      if((v>0.35||dx<-40)&&pos(tr,cards(tr)[i])>=sl-2)i--;
      goTo(tr,i);
      setTimeout(function(){moved=false;},0);
    });
    tr.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();}},true);

    /* roda do mouse/trackpad na horizontal */
    tr.addEventListener('wheel',function(e){
      if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
      if(!e.shiftKey)return;
      e.preventDefault();tr.scrollLeft+=e.deltaY;
    },{passive:false});
  });

  /* antes e depois: galeria em movimento contínuo, com swipe, arraste e botões */
  (function(){
    var tr=doc.getElementById('res-track');if(!tr)return;
    var row=tr.querySelector('.res-row');
    var orig=Array.prototype.slice.call(row.children);
    orig.forEach(function(el){var c=el.cloneNode(true);c.setAttribute('aria-hidden','true');c.querySelectorAll('img').forEach(function(i){i.alt='';});row.appendChild(c);});
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var btn=doc.getElementById('res-play');
    var userPaused=reduce,hold=false,resume,x=0,last=0,speed=0.035; /* px por ms */
    function half(){return row.scrollWidth/2;}
    function wrap(){var h=half();if(tr.scrollLeft>=h)tr.scrollLeft-=h;else if(tr.scrollLeft<=0)tr.scrollLeft+=h;}
    function setBtn(){btn.classList.toggle('paused',userPaused);btn.setAttribute('aria-label',userPaused?'Reproduzir galeria':'Pausar galeria');}
    setBtn();
    function tick(t){
      var dt=last?Math.min(t-last,50):16;last=t;
      if(!userPaused&&!hold&&!doc.hidden&&visible){x+=speed*dt;if(x>=1){var s=Math.floor(x);tr.scrollLeft+=s;x-=s;wrap();}}
      requestAnimationFrame(tick);
    }
    var visible=true;
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){visible=e[0].isIntersecting;}).observe(tr);}
    tr.scrollLeft=1;requestAnimationFrame(tick);
    function pause(){hold=true;clearTimeout(resume);}
    function later(ms){clearTimeout(resume);resume=setTimeout(function(){hold=false;},ms||2500);}
    tr.addEventListener('mouseenter',pause);
    tr.addEventListener('mouseleave',function(){later(400);});
    tr.addEventListener('touchstart',pause,{passive:true});
    tr.addEventListener('touchend',function(){later(3000);},{passive:true});
    tr.addEventListener('focusin',pause);
    tr.addEventListener('focusout',function(){later(800);});
    tr.addEventListener('scroll',function(){if(hold)wrap();},{passive:true});
    btn.addEventListener('click',function(){userPaused=!userPaused;setBtn();});
    function stepW(){var c=row.querySelector('.ba');return c.getBoundingClientRect().width+parseFloat(getComputedStyle(row).columnGap||16);}
    function move(dir){pause();wrap();tr.scrollBy({left:dir*stepW(),behavior:'smooth'});later(3500);}
    doc.querySelectorAll('[data-res]').forEach(function(b){b.addEventListener('click',function(){move(parseInt(b.dataset.res,10));});});
    tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
    /* mouse: arrastar */
    var down=false,moved=false,sx=0,sl=0;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;sx=e.clientX;sl=tr.scrollLeft;pause();});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(!moved&&Math.abs(dx)>6){moved=true;tr.classList.add('drag');}if(moved){tr.scrollLeft=sl-dx;}});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;tr.classList.remove('drag');wrap();later(2500);setTimeout(function(){moved=false;},0);});
    tr.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();}},true);
  })();

  /* linha do tempo do procedimento acompanha a rolagem */
  (function(){
    var tl=doc.getElementById('tl');if(!tl)return;
    var fill=tl.querySelector('.tl-fill'),items=tl.querySelectorAll('li'),tick=false;
    function upd(){
      tick=false;
      var r=tl.getBoundingClientRect(),mark=window.innerHeight*0.62;
      var total=r.height-40,done=Math.max(0,Math.min(total,mark-r.top-10));
      fill.style.height=done+'px';
      items.forEach(function(li){li.classList.toggle('on',li.getBoundingClientRect().top<mark);});
    }
    window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
    window.addEventListener('resize',upd);upd();
  })();

  /* dica de arraste some após a primeira interação */
  doc.querySelectorAll('.swipe-hint').forEach(function(h){
    var tr=doc.getElementById(h.dataset.for);if(!tr)return;
    var hide=function(){h.classList.add('gone');};
    tr.addEventListener('scroll',hide,{once:true,passive:true});
  });

  /* depoimentos automáticos, pausam com mouse, toque ou foco */
  var dep=doc.getElementById('trk-dep'),paused=false,resume;
  function pause(){paused=true;clearTimeout(resume);}
  function later(){clearTimeout(resume);resume=setTimeout(function(){paused=false;},6000);}
  dep.addEventListener('mouseenter',pause);
  dep.addEventListener('mouseleave',function(){paused=false;});
  dep.addEventListener('touchstart',pause,{passive:true});
  dep.addEventListener('touchend',later,{passive:true});
  dep.addEventListener('focusin',pause);
  dep.addEventListener('focusout',later);
  setInterval(function(){if(!paused&&!doc.hidden)slide('trk-dep',1);},5000);
})();
