const hamburger = document.querySelector(".hamburger"); //vytáhnutí hamburgeru z codu
const navMenu = document.querySelector(".nav-menu"); //vytáhnutí nav-menu z codu
const body = document.querySelector('body'); //vytáhnutí body z codu

hamburger.addEventListener("click",() => {  //otevření hamburgeru
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
})

hamburger.addEventListener('click', function() { // pozastavení scrollování když je hamburger otevřený
  body.classList.toggle('no-scroll');
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click",() => { //zavření hamburgeru
  hamburger.classList.remove("active"); 
  navMenu.classList.remove("active");
}))
