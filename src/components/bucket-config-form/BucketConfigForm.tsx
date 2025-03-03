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

// TYPES
import { S3FormState } from "./types.ts";

export const BucketConfigForm = memo(() => {
  const setPrerequisite = useFileExplorerStateSelectors.use.setPrerequisite();
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();

  const [state, dispatch, isPending] = useActionState<S3FormState, FormData>(
    async (formState, payload) => {
      const { bucketName, region, accessKeySecret, accessKeyId } =
        Object.fromEntries(payload) as S3FormState;

      try {
        const s3CurrentObjects = await S3.setProperties({
          accessKeyId: accessKeyId || "AKIATOK7VIOCYL4L6EXY",
          bucketName: bucketName || "llib-236960695173-25",
          accessKeySecret:
            accessKeySecret || "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",
          region: region || "eu-west-1",
        }).listObjects();

        const contents =
          s3CurrentObjects?.Contents?.map(({ Key }) =>
            (Key ?? "").split("/"),
          ) ?? [];

        setPrerequisite(contents, bucketName || "llib-236960695173-25");

        return formState;
      } catch (err) {
        const msg = err as Error;
        setCalloutState({
          type: "error",
          text: "Something went wrong when fetching S3 data!",
          open: true,
        });
        return {
          ...formState,
          error: msg?.message ?? "",
        };
      }
    },
    {
      accessKeyId: "AKIATOK7VIOCYL4L6EXY",
      bucketName: "llib-236960695173-25",
      accessKeySecret: "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",
      region: "eu-west-1",
    },
  );

  const { bucketName, region, accessKeySecret, accessKeyId} = state;
  const shouldDisableButton = !bucketName || !region || !accessKeyId || !accessKeySecret || isPending;

  return (
    <>
      <form action={dispatch} className="form-styles">
        <Input name="accessKeySecret" label="Access key secret" />

        <Input name="accessKeyId" label="Access key id" />

        <Input name="bucketName" label="Bucket name" />

        <Input name="region" label="Region" />

        <Button disabled={shouldDisableButton} type="submit">
          Connect to S3
        </Button>
      </form>
    </>
  );
});
