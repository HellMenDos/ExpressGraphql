const config = require('../config')

pagination=function pagination(link, page, count) {
    page=parseInt(page);
    const allPages = Math.ceil(count / config.ON_PAGE);
    if (page > allPages) {
        page = allPages;
    }
    const start = (page - 1) * config.ON_PAGE;
    let html = '';

    if (allPages > 1) {
        html = html + '<br/><nav aria-label="Page navigation">' +
            '<ul class="pagination justify-content-center">';

        if (page != 1) {
            html = html + '<li class="page-item"><a class="page-link" href="' + link + '1"><i class="fa fa-arrow-left"></i></a></li>';
        }

        if ((page - 1) > 0) {
            html = html + '<li class="page-item"><a class="page-link" href="' + link + '' + (page - 1) + '"><i class="fa fa-arrow-circle-left"></i></a></li>';
        }

        for (let i = 4; i >= 1; i--) {
            if ((page - i) > 0) {
                html = html + '<li class="page-item"><a class="page-link" href="' + link + '' + (page - i) + '">' + (page - i) + '</a></li>';
            }
        }

        html = html + '<li class="page-item active"><a class="page-link" href="#">' + page + '</a></li>';

        for (let i = 1; i <= 4; i++) {

            if ((page + i) <= allPages) {
                html = html + '<li class="page-item"><a class="page-link" href="' + link + '' + (page + i) + '">' + (page + i) + '</a></li>';
            }
        }

        if ((page + 1) <= allPages) {
            html = html + '<li class="page-item"><a class="page-link" href="' + link + '' + (page + 1) + '"><i class="fa fa-arrow-circle-right"></i></a></li>';
        }
        if ((page + 1) != allPages) {
            html = html + '<li class="page-item"><a class="page-link" href="' + link + '' + allPages + '"><i class="fa fa-arrow-right"></i></a></li>';
        }
        html = html + '</ul></nav>';
    }
    return html;
}

exports.pagination=pagination
