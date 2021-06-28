import fetch from '@/utils/fetch'


//查询评分汇总列表接口
export function getList(data) {
    return fetch({
        url: 'history/scorelist',
        method: 'post',
        data: data
    })
}
//批量修改月结评分完成状态接口
export function updateFinishGradeBySerialNo(data) {
    return fetch({
        url: 'history/updateFinishGradeBySerialNo',
        method: 'post',
        data: data
    })
}
//全部修改月节评分完成状态接口
export function updateFinishGradeAll() {
    return fetch({
        url: 'history/updateFinishGradeAll',
        method: 'post'
    })
}