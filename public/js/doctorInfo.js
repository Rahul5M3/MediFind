let reviewBox=document.querySelector('.reviewBox');
reviewBox.addEventListener('click',()=>{
    let ratingReviewBox=document.querySelector('.ratingReviewBox');
    ratingReviewBox.style.display='block';
})

let cross=document.querySelector('#cross');
cross.addEventListener('click',()=>{
    let ratingReviewBox=document.querySelector('.ratingReviewBox');
    ratingReviewBox.style.display='none';
})
