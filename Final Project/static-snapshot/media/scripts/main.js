function togglemblmenu() {
    var mblMenuLinks = [
        document.querySelector(".mbl-links"),
        document.querySelector(".mbl-links-more"),
        document.querySelector("#mbl-menu-main")
    ];
    
    mblMenuLinks.forEach(link => {
        if (link.style.display === "block") {
            link.style.display = "none";
        } else {
            link.style.display = "block";
        }
    });
}
