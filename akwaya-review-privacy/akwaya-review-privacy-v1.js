(function(){
  'use strict';
  function maskName(raw){
    var s=(raw||'').replace(/\s+/g,' ').trim();
    if(!s) return s;
    if(/^(customer|anonymous|guest)$/i.test(s)) return s;
    var parts=s.split(' ');
    if(parts.length<2) return s;
    var suffix=/^(jr\.?|sr\.?|ii|iii|iv)$/i;
    var lastIndex=parts.length-1;
    if(suffix.test(parts[lastIndex]) && lastIndex>1) lastIndex--;
    var first=parts.slice(0,lastIndex).join(' ');
    var last=parts[lastIndex].replace(/^[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+/,'');
    if(!last) return s;
    var initial=last.charAt(0).toUpperCase();
    return first+' '+initial+'.';
  }
  function apply(root){
    (root||document).querySelectorAll('.akwaya-card__name').forEach(function(el){
      if(el.dataset.akwayaPrivacyMasked==='1') return;
      var node=null;
      for(var i=0;i<el.childNodes.length;i++){
        if(el.childNodes[i].nodeType===Node.TEXT_NODE && el.childNodes[i].nodeValue.trim()){node=el.childNodes[i];break;}
      }
      if(!node) return;
      var original=node.nodeValue;
      var masked=maskName(original);
      if(masked && masked!==original.trim()) node.nodeValue=masked;
      el.dataset.akwayaPrivacyMasked='1';
    });
  }
  function start(){
    apply(document);
    var obs=new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(n){
          if(n.nodeType===1){
            if(n.matches && n.matches('.akwaya-card__name')) apply(n.parentNode||document);
            else apply(n);
          }
        });
      });
    });
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();