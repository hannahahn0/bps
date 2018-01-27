export default wrapped => (evt, ctx, cb) => {
    if (!evt.headers.authorization) {
        cb('noAuth')
        return
    }
    const auth = evt.headers.authorization.trim()
    if (!auth.startsWith('Bearer ')) {
        cb('noAuth')
        return
    }
    const editedEvt = Object.assign({}, evt)
    editedEvt.token = auth.replace('Bearer ', '')
    wrapped(editedEvt, ctx, cb)
}
