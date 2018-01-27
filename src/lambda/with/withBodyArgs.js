export default (args, wrapped) => (evt, ctx, cb) => {
    if (!Object.keys(args)
        .every(arg => typeof evt.body[arg] === args[arg])) { // eslint-disable-line valid-typeof
        cb('paramsMissing')
        return
    }
    wrapped(evt, ctx, cb)
}
