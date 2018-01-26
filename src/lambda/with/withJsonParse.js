export default wrapped => (evt, ctx, cb) => {
    if (!evt.headers['content-type'].includes('application/json')) {
        cb('wrongContentType')
        return
    }
    let body
    try {
        body = JSON.parse(evt.body)
    } catch (e) {
        cb('jsonMalformed')
        return
    }
    const editedEvt = Object.assign({}, evt)
    editedEvt.body = body
    wrapped(editedEvt, ctx, cb)
}
