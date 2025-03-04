import { ListObjectsV2Output } from "@aws-sdk/client-s3";
import { ContentTypes } from "../bucket-config-form/types.ts";
import { defaultContentTypes } from "../bucket-config-form/constants.ts";

export const reduceContents = (contents: ListObjectsV2Output["Contents"], bucketName: string) =>
  contents?.reduce<ContentTypes>((acc, curr) => {
    const { Key } = curr;
    const path = `/${bucketName}/${Key || ""}`;

    return {
      contentsForPrerequisite: [
        ...acc.contentsForPrerequisite,
        path.split("/"),
      ],
      contentsForPathToKeyMap: [...acc.contentsForPathToKeyMap, path],
    };
  }, defaultContentTypes) ?? defaultContentTypes;
