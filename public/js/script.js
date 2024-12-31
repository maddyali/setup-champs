const menuBtn = document.querySelector(".menu-btn");
const dropdown = document.querySelector(".dropdown");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("active!");
  dropdown.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  console.log(e.target);
  if (!e.target.classList.contains(".btn")) dropdown.classList.remove("active");
});
