import {type Static, Type} from "@sinclair/typebox";

const LinkSchema = Type.Object({
    rel: Type.Array(Type.String()),
    href: Type.String(),
    value: Type.String(),
    templated: Type.Optional(Type.Boolean()),
});
export const ApiRootResponseSchema = Type.Object({
    self: LinkSchema,
    actions: Type.Array(LinkSchema)
});
export type ApiRootResponse = Static<typeof ApiRootResponseSchema>;