let user=document.querySelector("#user");
let doctor=document.querySelector("#doctor");
let registerContent=document.querySelector(".registerContent");
let registerContent2=document.querySelector('.registerContent2');

user.addEventListener('click',()=>{
    user.style.backgroundColor='#90EE90';
    doctor.style.backgroundColor='transparent';

    registerContent.style.display='none';
    registerContent2.style.display='block';
})

doctor.addEventListener('click',()=>{
    doctor.style.backgroundColor='#90EE90';
    user.style.backgroundColor='transparent';
    
    registerContent.style.display='block';
    registerContent2.style.display='none';
})
