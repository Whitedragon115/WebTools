document.addEventListener("DOMContentLoaded", function () {
    const ImgBox = document.getElementById("ImgBox");
    const MainContainer = document.getElementById("MainContainer");
    const ZoomImg = document.getElementById("Zoom-Img");
    const MainZoomImg = document.getElementById("Zoom-Img-Box");

    const CopyPageLink = document.getElementById("cpweblink");
    const CopyImgLink = document.getElementById("cplink");
    const CopyImageData = document.getElementById("cpimg");
    const DownloadFile = document.getElementById("dlimg");

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
        MainZoomImg.style.transitionDelay = "0.3s";
        MainZoomImg.style.opacity = "1";

        setTimeout(() => {
            imgOpenToggle = true;
        }, 2 * 1000);

    });

    document.addEventListener('click', (event) => {

        if (event.target.id != 'Zoom-Img-Box' && imgOpenToggle) {

            requestAnimationFrame(() => {
                MainContainer.style = orginalCss.maincontainer;
                ZoomImg.style = orginalCss.zoomimg;
                MainZoomImg.style = orginalCss.mainzoomimg;
            });

            imgOpenToggle = false;

        }
    });

    CopyPageLink.addEventListener('click', () => {
        SuccessExecuted();
        const weblink = window.location.href;
        navigator.clipboard.writeText(weblink);
    });

    CopyImgLink.addEventListener('click', () => {
        SuccessExecuted();
        const imglink = MainZoomImg.src;
        navigator.clipboard.writeText(imglink);
    });

    DownloadFile.addEventListener('click', () => {
        SuccessExecuted();
        const imglink = MainZoomImg.src + '/download';
        window.open(imglink);
    });

    CopyImageData.addEventListener('click', async () => {

        const img = MainZoomImg;
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
            navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);
        }, "image/png");

        SuccessExecuted();
    });

    function SuccessExecuted() {
        const success = document.createElement("div");

        success.style.position = "fixed";
        success.style.bottom = "1%";
        success.style.left = "50%";
        success.style.padding = "10px 20px";
        success.style.backgroundColor = "rgba(186 243 238 / 0.8)";
        success.style.color = "white";
        success.style.borderRadius = "10px";
        success.style.transform = "translate(-50%, -10%)";
        success.style.opacity = "0";
        success.style.transition = "opacity 0.5s, transform 0.5s";
        success.style.zIndex = "999";
        success.innerHTML = "Success!";
        document.body.appendChild(success);

        setTimeout(() => {
            success.style.opacity = "1";
            success.style.transform = "translate(-50%, -40%)";
        }, 100);

        setTimeout(() => {
            success.style.opacity = "0";
            success.style.transform = "translate(-50%, -50%)";
        }, 2000);

        setTimeout(() => {
            success.remove();
        }, 2500);
    }

});
