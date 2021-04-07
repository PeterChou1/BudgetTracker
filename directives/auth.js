const { MapperKind, getDirectives, mapSchema } = require("graphql-tools");
const { defaultFieldResolver } = require("graphql");

function authDirectiveFunc() {
  const typedirectiveMapped = {};
  return {
    authDirectiveTypeDefs: "directive @auth on OBJECT | FIELD_DEFINITION",
    authDirective: (schema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const typeDirectives = getDirectives(schema, type);
          typedirectiveMapped[type.name] = typeDirectives.auth;
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const fieldDirectives = getDirectives(schema, fieldConfig);
          const directiveArgumentMap =
            fieldDirectives.auth == null
              ? typedirectiveMapped[typeName]
              : fieldDirectives.auth;
          if (directiveArgumentMap) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = function (source, args, context, info) {
              const user = context.req.user;
              if (!user) {
                throw new Error("not authenticated");
              }
              return resolve(source, args, context, info);
            };
            return fieldConfig;
          }
        },
      }),
  };
}
const { authDirectiveTypeDefs, authDirective } = authDirectiveFunc();
module.exports = {
  authDirective,
  authDirectiveTypeDefs,
};
