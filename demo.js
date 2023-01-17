// const BASE_URL = 'http://127.0.0.1:3000/api/members';
const BASE_URL = 'https://member.fly.dev/api/members';

$(document).ready(function () {
    let url = 'ajax/ajaxCard';
    let ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();

    // 新增按鈕
    $('#addbutton').click(function () {
        $('#dialog-addconfirm').modal({ backdrop: 'static' });
    });

    $('.btn-add').click(function (e) {
        let url = 'ajax/ajaxCard';
        let cName = $('#addcnname').val();
        let eName = $('#addenname').val();
        let sex = +$('input:radio:checked[name="addsex"]').val();
        let phone = $('#addphone').val();
        let mail = $('#addmail').val();
        let ajaxobj = new AjaxObject(url, 'json');

        const reqBody = {
            cName,
            eName,
            sex,
            phone,
            mail,
        };

        // 檢查所有欄位是否都有填寫，否則無法提交
        const allFilled = $('#addform input')
            .toArray()
            .every((input) => input.checkValidity());
        if (allFilled) ajaxobj.add(reqBody);
    });

    $('.addconfirm-footer .btn-reset').click(function (e) {
        $('#addform')[0].reset();
    });

    // 搜尋按鈕
    $('#searchbutton').click(function () {
        $('#dialog-searchconfirm').modal({ backdrop: 'static' });
    });

    $('.btn-search').click(function (e) {
        const ajaxobj = new AjaxObject(url, 'json');
        const fd = new FormData(document.querySelector('#searchform'));
        const queryOBJ = Array.from(fd.entries())
            .filter((pair) => {
                return pair[1] !== '';
            })
            .reduce((obj, pair) => {
                obj[pair[0]] = pair[1];
                return obj;
            }, {});

        const allFilled = $('#searchform input')
            .toArray()
            .every((input) => input.checkValidity());
        if (allFilled) ajaxobj.search(queryOBJ);
    });

    $('.searchconfirm-footer .btn-reset').click(function (e) {
        $('#searchform')[0].reset();
    });

    // 修改鈕
    $('#cardtable').on('click', '.modifybutton', function (e) {
        const memberID = e.target.id.replace('modifybutton', '');
        const ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.modify_get(memberID);
    });
    // 刪除鈕
    $('#cardtable').on('click', '.deletebutton', function (e) {
        const memberID = e.target.id.replace('deletebutton', '');
        let url = 'ajax/ajaxCard';
        const ajaxobj = new AjaxObject(url, 'json');
        $('#dialog-deletecheck').modal({ backdrop: 'static' });
        $('.btn-delete').click(function () {
            ajaxobj.delete(memberID);
        });
    });

    // 自適應視窗
    $(window).resize(function () {
        if (window.innerWidth <= 768) {
            $('.table-row').each((_, tableRow) => {
                $(tableRow).off('mouseover');
                $(tableRow).off('mouseout');
            });
        } else {
            addCrossEvent();
        }
        let wWidth = $(window).width();
        let dWidth = wWidth * 0.4;
        let wHeight = $(window).height();
        let dHeight = wHeight * 0.4;
    });

    // 防止表單默認提交
    $('#addform').submit(function (e) {
        e.preventDefault();
    });
    $('#searchform').submit(function (e) {
        e.preventDefault();
    });
    $('#modifyform').submit(function (e) {
        e.preventDefault();
    });
});
function refreshTable(data) {
    $('#cardtable tbody > tr').remove();
    $.each(data, function (_, item) {
        let strsex = item.sex === 0 ? '男' : '女';
        let phoneNum = `${item.phone.substring(0, 4)}-${item.phone.substring(
            4,
            7
        )}-${item.phone.substring(7, 10)}`;

        let row = $('<tr class="table-row"></tr>');
        row.append(
            $(
                `<td class="align-middle" data-th="中文名字" data-toggle="tooltip" data-placement="top" title="[${strsex}] ${item.cName} (${item.eName})"></td>`
            ).html(item.cName)
        );
        row.append(
            $('<td class="align-middle" data-th="英文名字"></td>').html(
                item.eName
            )
        );
        row.append(
            $('<td class="align-middle" data-th="性別"></td>').html(strsex)
        );
        row.append(
            $(
                `<td class="align-middle" data-th="手機" tabindex="0" data-toggle="popover" data-placement="top" title="聯絡方式" data-content="${phoneNum}"></td>`
            ).html(item.phone)
        );
        row.append(
            $('<td class="align-middle" data-th="信箱"></td>').html(item.mail)
        );
        row.append(
            $('<td class="align-middle" data-th="修改"></td>').html(
                '<button id="modifybutton' +
                    item.id +
                    '" class="modifybutton btn btn-secondary" style="font-size:16px;font-weight:bold;">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'
            )
        );
        row.append(
            $('<td class="align-middle" data-th="刪除"></td>').html(
                '<button id="deletebutton' +
                    item.id +
                    '" class="deletebutton btn btn-danger" style="font-size:16px;font-weight:bold;">刪除 <span class="glyphicon glyphicon-trash"></span></button>'
            )
        );
        $('#cardtable').append(row);
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover({
            trigger: 'focus',
            template:
                '<div class="popover text-center" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        });
    });

    //
    if (innerWidth >= 768) addCrossEvent();
}

function addCrossEvent() {
    // 為每個table-row建立事件mouseover事件
    $('.table-row').each((_, tableRow) => {
        $(tableRow).mouseover(function (e) {
            // 找出觸發事件的欄位索引值
            const colIndex = $(tableRow)
                .children()
                .toArray()
                .findIndex((item) => item === e.target);

            // (欄) 當觸發的是th時，為tbody中的td添加class
            if (e.target.tagName.toLowerCase() === 'th') {
                $('tbody .table-row').each((_, col) => {
                    $($(col).children()[colIndex]).addClass('active');
                });
            }

            // (欄) 當觸發的是td時，為其父元素tr中的td以及thead中的th添加class
            if (e.target.tagName.toLowerCase() === 'td') {
                $(e.target)
                    .parent()
                    .siblings()
                    .each((_, row) => {
                        $($(row).children()[colIndex]).addClass('active');
                    });
                $($('thead .table-row').children()[colIndex]).addClass(
                    'active'
                );
            }
            // (列) 為其所有兄弟元素td添加class
            $(e.target)
                .siblings()
                .each((_, item) => $(item).addClass('active'));
        });

        $(tableRow).mouseout(function (e) {
            const colIndex = $(tableRow)
                .children()
                .toArray()
                .findIndex((item) => item === e.target);

            if (e.target.tagName.toLowerCase() === 'th') {
                $('.table-row').each((_, col) => {
                    $($(col).children()[colIndex]).removeClass('active');
                });
            }

            if (e.target.tagName.toLowerCase() === 'td') {
                $(e.target)
                    .parent()
                    .siblings()
                    .each((_, row) => {
                        $($(row).children()[colIndex]).removeClass('active');
                    });
                $($('thead .table-row').children()[colIndex]).removeClass(
                    'active'
                );
            }
            $(e.target)
                .siblings()
                .each((_, item) => $(item).removeClass('active'));
        });
    });
}

function initEdit(response, memberID) {
    $('#dialog-modifyconfirm').modal({ backdrop: 'static' });
    let modifyid = $('#cardtable').attr('id').substring(12);
    $('#mocnname').val(response.cName);
    $('#moenname').val(response.eName);
    if (response.sex == 0) {
        $('#modifyman').prop('checked', true);
        $('#modifywoman').prop('checked', false);
    } else {
        $('#modifyman').prop('checked', false);
        $('#modifywoman').prop('checked', true);
    }

    $('#mophone').val(response.phone);
    $('#momail').val(response.mail);
    $('#modifysid').val(modifyid);

    $('.btn-modify').click(function (e) {
        let url = 'ajax/ajaxCard';
        let cName = $('#mocnname').val();
        let eName = $('#moenname').val();
        let sex = $('input:radio:checked[name="mosex"]').val();
        let phone = $('#mophone').val();
        let mail = $('#momail').val();
        let ajaxobj = new AjaxObject(url, 'json');

        const reqBody = {
            cName,
            eName,
            sex,
            phone,
            mail,
        };

        const allFilled = $('#modifyform input')
            .toArray()
            .every((input) => input.checkValidity());
        if (allFilled) ajaxobj.modify(reqBody, memberID);
    });
    $('.modifyconfirm-footer .btn-reset').click(function (e) {
        $('#modifyform')[0].reset();
    });
}

/**
 *
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname = '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.phone = '';
AjaxObject.prototype.mail = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert('Alert:');
};
AjaxObject.prototype.getall = function () {
    fetch(BASE_URL)
        .then((res) => res.json())
        .then((json) => {
            refreshTable(json.data.members);
        });
};
AjaxObject.prototype.add = function (reqBody) {
    fetch(BASE_URL, {
        method: 'post',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then(() => {
            $('#addform')[0].reset();
            this.getall();
        });
    $('#dialog-addconfirm').modal('hide');
};
AjaxObject.prototype.modify = function (reqBody, memberID) {
    fetch(`${BASE_URL}/${memberID}`, {
        method: 'PATCH',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then(() => {
            this.getall();
        });
    // 關閉modal時取消click事件，否則會觸發多次
    $('.btn-modify').off('click');
    $('#dialog-modifyconfirm').modal('hide');
};
AjaxObject.prototype.modify_get = function (memberID) {
    fetch(`${BASE_URL}/${memberID}`)
        .then((res) => res.json())
        .then((json) => {
            initEdit(json.data.member, memberID);
        });
};
AjaxObject.prototype.search = function (queryOBJ) {
    const url = new URL(BASE_URL);
    const queryParam = new URLSearchParams(queryOBJ);
    url.search = queryParam;
    fetch(url)
        .then((res) => res.json())
        .then((json) => refreshTable(json.data.members));
    $('#searchform')[0].reset();
    $('#dialog-searchconfirm').modal('hide');
};
AjaxObject.prototype.delete = function (memberID) {
    fetch(`${BASE_URL}/${memberID}`, {
        method: 'delete',
    }).then(() => {
        $('#dialog-deletecheck').modal('hide');
        this.getall();
    });
};
