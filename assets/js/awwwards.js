(function(){
  const els=[...document.querySelectorAll('.reveal, .process li, .price-table, .zone-card, .grid.three > article')];
  els.forEach(el=>el.classList.add('reveal'));
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
})();
