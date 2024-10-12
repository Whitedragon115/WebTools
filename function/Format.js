function fileSize(size) {

    if (size < 1024) {
        return size + ' B';

    } else if (size < 1024 ** 2) {
        return (size / 1024 ** 1).toFixed(2) + ' KB';

    } else if (size < 1024 ** 3) {
        return (size / 1024 ** 2).toFixed(2) + ' MB';

    } else if (size < 1024 ** 4) {
        return (size / 1024 ** 3).toFixed(2) + ' GB';

    }

}


module.exports = {
    fileSize
}