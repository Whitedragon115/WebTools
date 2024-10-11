document.addEventListener("DOMContentLoaded", function () {
    const avatar = document.getElementById("avatar");
    const dropdownMenu = document.getElementById("avatar-dropmenu");
    const tool = document.getElementById("toolbtn")
    const expandingCircle = document.getElementById("tool-container");
    const bgOutContainer = document.getElementById("bg-out-container");
    const bgOutText = document.getElementById("mid-text");

    const expandingCircleClass = expandingCircle.style;
    const bgOutContainerClass = bgOutContainer.style;
    const bgOutTextClass = bgOutText.style;
    const bodyStyle = document.body.style;

    let toolToggle = false;
    let hideTimeout;

    // Handle tool button click to show expanding circle
    tool.addEventListener("click", () => {
        tool.classList.toggle('active')
        bgOutText.classList.toggle('active')

        if (toolToggle) {
            expandingCircle.style = expandingCircleClass
            bgOutContainer.style = bgOutContainerClass
            bgOutText.style = bgOutTextClass
            document.body.style = bodyStyle
            toolToggle = false;
        } else {
            requestAnimationFrame(() => {
                expandingCircle.style.width = "150vw";
                expandingCircle.style.height = "150vw";
                expandingCircle.style.bottom = "-55vw";
                expandingCircle.style.left = "calc(50% - 57.5vw)";
                expandingCircle.style.background = "rgba(0, 0, 0, 0.5)";
                expandingCircle.style.transform = "none";
                bgOutContainer.style.transitionDelay = "1s";
                bgOutContainer.style.transform = "scale(3)"
                bgOutContainer.style.translate = "0rem -72rem";
                document.body.style.backdropFilter = "blur(10px)";
                document.body.style.transitionDelay = "2s";
                showToolList();
            });

            toolToggle = true;
        }
    });

    function showToolList(){


        
    }

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