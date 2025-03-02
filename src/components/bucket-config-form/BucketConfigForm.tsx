import { useActionState, memo } from "react";

// CLASSES
import S3 from "../../classes/s3-access/s3.ts";

// COMPONENTS
import { Input } from "../input/input.tsx";
import { Button } from "../button/Button.tsx";

// STYLES
import "./bucket-config-form.css";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

export const BucketConfigForm = memo(() => {
  const setBucketName = useFileExplorerStateSelectors.use.setBucketName();
  const setContents = useFileExplorerStateSelectors.use.setContents();

  const [_, dispatch, isPending] = useActionState<unknown, FormData>(
    async (_, _$) => {
      // const bucket-config-form = Object.fromEntries(payload) as S3FormState;
      try {
        const s3CurrentObjects = await S3.setProperties({
          accessKeyId: "AKIATOK7VIOCYL4L6EXY",
          bucketName: "llib-236960695173-25",
          accessKeySecret: "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",
          region: "eu-west-1",
        }).listObjects();
        // const s3CurrentAddedObject = await S3.getInstance().createObject(
        //   new Blob(["Tralala"]),
        // );
        // console.log(s3CurrentObjects?.Contents);
        // console.log(
        //   doTree(
        //     s3CurrentObjects?.Contents?.map(({ Key }) =>
        //       (Key ?? "").split("/"),
        //     ) ?? [],
        //   ),
        // );

        setBucketName("llib-236960695173-25");
        setContents(
          s3CurrentObjects?.Contents?.map(({ Key }) =>
            (Key ?? "").split("/"),
          ) ?? [],
        );

        return;
      } catch (err) {
        const msg = err as Error;

        return {
          ..._,
          error: msg?.message ?? "",
        };
      }
    },
    {
      accessKeyId: "AKIATOK7VIOCYL4L6EXY",
      bucketName: "llib-236960695173-25",
      accessKeySecret: "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",
      region: "eu-west-1",
      contents: [],
    },
  );

  return (
    <>
      <form action={dispatch} className={"form-styles"}>
        <Input name="accessKeySecret" label="Access key secret" />

        <Input name="accessKeyId" label="Access key id" />

        <Input name="bucketName" label="Bucket name" />

        <Input name="region" label="Region" />

        <Button disabled={isPending} type="submit">
          Connect to S3
        </Button>
      </form>
    </>
  );
});
