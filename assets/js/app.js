function switchMode() {
  const bodyClasses = document.body.classList;
  if (bodyClasses.contains("lightMode")) {
    document.body.classList.remove("lightMode");
    document.body.classList.add("darkMode");
  } else {
    document.body.classList.remove("darkMode");
    document.body.classList.add("lightMode");
  }
}
