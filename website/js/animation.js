
console.log("Working?");
const swiper = new Swiper('.swiper', {
    speed: 300,
    direction: 'horizontal',
    effect: 'slide',
    loop: true,
    pagination:{
        el: '.swiper-pagination',
        type: 'bullets',
    },
    navigation:{
        nextEl: '.swiper-navigation-next',
        prevEl: '.swiper-navigation-prev',
    },

})