let humburger=document.querySelector('.header i');

humburger.addEventListener('click',()=>{
    let sidebar=document.querySelector('.sidebar');
    sidebar.style.display='block';
})

let menuArrowSidebar=document.querySelector(' .menu ');

menuArrowSidebar.addEventListener('click',()=>{
    let sidebar=document.querySelector('.sidebar');
    sidebar.style.display='none';
})

let aa=document.querySelector('.aa');
let ab=document.querySelector('.ab');
aa.addEventListener('click',()=>{
    let b2=document.querySelector('.b2');
    b2.style.display='none';
    aa.style.backgroundColor='#dac218';
    ab.style.backgroundColor='#0ead6a';
})
ab.addEventListener('click',()=>{
    let b2=document.querySelector('.b2');
    b2.style.display='block';
    ab.style.backgroundColor='#dac218';
    aa.style.backgroundColor='#0ead6a';
})