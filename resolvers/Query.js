async function getuser(parent, args, { res, req, prisma }) {
  /* user must be authenticated */
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  return {
    id: user.id,
    username: user.username,
  };
}

module.exports = {
  getuser,
};
