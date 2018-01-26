export default (methodsArg, wrapped) => (evt, ctx, cb) => {
    let methods = methodsArg
    if (methodsArg instanceof String) {
        methods = [methodsArg]
    }
    if (!methods.includes(evt.httpMethod)) {
        cb('wrongMethod')
        return
    }
    wrapped(evt, ctx, cb)
}
