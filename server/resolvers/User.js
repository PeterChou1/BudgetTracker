async function items (parent, args, {res, req, prisma }) {
    return await prisma.user.findUnique({ where: { id: parent.id } }).items();
}

module.exports = {
    items
};