document.addEventListener("DOMContentLoaded",()=>{
    let sections=document.querySelectorAll('.section');

    let options= {
        root:null,
        rootMargin: '0px',
        threshold:0.2,
    }

    const observer=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
            }else {
                entry.target.classList.remove('visible');
            }
        });
    },options);

    sections.forEach(section=>{
        observer.observe(section);
    });
});