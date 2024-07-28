document.addEventListener("DOMContentLoaded", function() {
    var current = window.location.pathname.split("/").pop();
    var menuItems = document.querySelectorAll(".nav-link");

    menuItems.forEach(function(item) {
        if(item.getAttribute("href") === current) {
            item.classList.add("active");
        }
    });
});
