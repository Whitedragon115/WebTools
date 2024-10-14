document.addEventListener("DOMContentLoaded", function () {
    const ImgBox = document.getElementById("ImgBox");
    const MainContainer = document.getElementById("MainContainer");
    const ZoomImg = document.getElementById("Zoom-Img");
    const MainZoomImg = document.getElementById("Zoom-Img-Box");

    const CopyPageLink = document.getElementById("cpweblink");
    const CopyImgLink = document.getElementById("cplink");
    const CopyImageData = document.getElementById("cpimg");

    let imgOpenToggle = false;

    const orginalCss = {
        imgbox: ImgBox.style,
        maincontainer: MainContainer.style,
        zoomimg: ZoomImg.style,
        mainzoomimg: MainZoomImg.style
    }

    ImgBox.addEventListener('click', () => {

        MainContainer.style.transition = "0.5s";

        MainContainer.style.opacity = "0.1";
        ZoomImg.style.visibility = "visible";
        ZoomImg.style.width = "200vw";
        ZoomImg.style.height = "200vw";
        ZoomImg.style.opacity = "1";
        MainZoomImg.style.transitionDelay = "0.7s";
        MainZoomImg.style.opacity = "1";

        setTimeout(() => {
            imgOpenToggle = true;
        }, 2 * 1000);

    });

    document.addEventListener('click', (event) => {

        if (event.target.id != 'Zoom-Img-Box' && imgOpenToggle) {

            MainContainer.style = orginalCss.maincontainer;
            ZoomImg.style = orginalCss.zoomimg;
            MainZoomImg.style = orginalCss.mainzoomimg;

            imgOpenToggle = false;

        }
    });

    CopyPageLink.addEventListener('click', () => {
        const weblink = window.location.href;
        navigator.clipboard.writeText(weblink);
    });

    CopyImgLink.addEventListener('click', () => {
        const imglink = MainZoomImg.src;
        navigator.clipboard.writeText(imglink);
    });

    CopyImageData.addEventListener('click', async () => {

        const imgLink = MainZoomImg.src;
        const response = await fetch(imgLink);
        const blob = await response.blob();

        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);

    });

});
