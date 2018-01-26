export default (args, wrapped) => (evt, ctx, cb) => {
    if (!args.every(arg => evt.body[arg] !== undefined)) {
        cb('paramsMissing')
        return
    }
    wrapped(evt, ctx, cb)
}
