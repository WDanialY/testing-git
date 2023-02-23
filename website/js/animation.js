const faders = document.querySelectorAll('.fade-in');
const appearOptions = {};

const appearOnScroll = new IntersectionObserver(function(
    entries, 
    appearOnScroll){
        entries.forEach(entry => {
            if(!entry.isIntersecting){
                return;
            }else{
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        })
}, appearOptions);

faders.forEach(fader =>{
    appearOnScroll.observe(fader);
});


var swiper = new Swiper(".swiper",{
    speed: 700,
    direction: "horizontal",
    rewind: true,
    pagination: {
        el: '.swiper-pagination',
        type: "bullets",
        clickable: true,
    },
    navigation:{
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
    }
});

function activeButton(){
    const bullets = document.querySelectorAll(".swiper-pagination-bullet");
    bullets.forEach((bullet)=>{
        bullet.style.backgroundColor = "#fff";
        bullet.style.opacity = .5;
    })
    var activeBullet = document.querySelectorAll('.swiper-pagination-bullet-active');
    activeBullet.forEach((dabullet)=>{
        dabullet.style.backgroundColor = "#00ACDC";
        dabullet.style.opacity = 1;
    })
}

$(document).ready(function(){
    activeButton();
    swiper.on('slideChange', activeButton);
    
})