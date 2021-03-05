
async function getuser(parent, args, {res, req, prisma}) {
    /* user must be authenticated */
    if (req.user) {
        const user = await prisma.user.findUnique({ 
            where: { 
                id: req.user.userId
            } 
        });
        return {
            id: user.id,
            username: user.username
        };
    }
    throw Error('not authenticated');
}


module.exports = {
    getuser
};
