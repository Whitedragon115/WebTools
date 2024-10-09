document.addEventListener("DOMContentLoaded", function () {
    const avatar = document.querySelector(".avatar");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const tool = document.querySelector(".toolbtn");
    const expandingCircle = document.querySelector(".tool-container");
    let toolToggle = false;
    let hideTimeout;

    // Handle tool button click to show expanding circle
    tool.addEventListener("click", () => {
        tool.classList.toggle('active')
        if (toolToggle) {
            expandingCircle.classList.remove("expand");
            expandingCircle.style.width = "50px";
            expandingCircle.style.height = "50px";
            expandingCircle.style.bottom = "0";
            expandingCircle.style.left = "50%";
            expandingCircle.style.background = "rgba(0, 0, 0)";
            expandingCircle.style.transform = "translate(-50%, 50%)";
            toolToggle = false;
        } else {
            expandingCircle.classList.add("expand");
            requestAnimationFrame(() => {
                expandingCircle.style.width = "115vw";
                expandingCircle.style.height = "115vw";
                expandingCircle.style.bottom = "-55vw";
                expandingCircle.style.left = "calc(50% - 57.5vw)";
                expandingCircle.style.background = "rgba(0, 0, 0, 0.5)";
                expandingCircle.style.transform = "none";
            });
            toolToggle = true;
        }
    });

    // Handle dropdown visibility
    function showDropdown() {
        clearTimeout(hideTimeout);
        dropdownMenu.classList.add("show");
        avatar.classList.add("active");
        dropdownMenu.style.animation = "avtarIn 0.3s ease forwards";
    }

    function hideDropdown() {
        hideTimeout = setTimeout(() => {
            dropdownMenu.style.animation = "avtarOut 0.3s ease forwards";
            setTimeout(() => {
                dropdownMenu.classList.remove("show");
                avatar.classList.remove("active");
            }, 300);
        }, 200);
    }

    avatar.addEventListener("mouseenter", showDropdown);
    avatar.addEventListener("mouseleave", hideDropdown);
    dropdownMenu.addEventListener("mouseenter", showDropdown);
    dropdownMenu.addEventListener("mouseleave", hideDropdown);
});