import { useActionState, memo } from "react";

// CLASSES
import S3 from "../../classes/s3-access/s3.ts";

// COMPONENTS
import { Input } from "../shared/input/Input.tsx";
import { Button } from "../shared/button/Button.tsx";

// STYLES
import "./bucket-config-form.css";

// HOOKS
import { useFileExplorerStateSelectors } from "../../state/file-explorer-state.tsx";

// TYPES
import { S3FormState } from "./types.ts";

// UTILS
import { reduceContents } from "../file-explorer/utils.ts";

export const BucketConfigForm = memo(() => {
  const setPrerequisite = useFileExplorerStateSelectors.use.setPrerequisite();
  const setCalloutState = useFileExplorerStateSelectors.use.setCalloutState();
  const setPathToKeyMap = useFileExplorerStateSelectors.use.setPathToKeyMap();

  const [, dispatch, isPending] = useActionState<S3FormState, FormData>(
    async (formState, payload) => {
      let { bucketName, region, accessKeySecret, accessKeyId } =
        Object.fromEntries(payload) as S3FormState;
      bucketName = bucketName.trim();
      region = region.trim();
      accessKeySecret = accessKeySecret.trim();
      accessKeyId = accessKeyId.trim();

      if (!bucketName || !region || !accessKeySecret || !accessKeyId) {
        setCalloutState({
          type: "error",
          text: "Please fill in all the fields!",
          open: true,
        });
        return {
          ...formState,
          error: "",
        };
      }

      try {
        const s3CurrentObjects = await S3.setConnectionProperties({
          accessKeyId: accessKeyId,
          bucketName: bucketName,
          accessKeySecret: accessKeySecret,
          region: region,
        }).listObjects();

        const { contentsForPrerequisite, contentsForPathToKeyMap } =
          reduceContents(s3CurrentObjects?.Contents, bucketName);

        setPrerequisite(contentsForPrerequisite, bucketName);

        setPathToKeyMap(`/${bucketName}`, ...contentsForPathToKeyMap);

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
      accessKeyId: "",
      bucketName: "",
      accessKeySecret: "",
      region: "",
    },
  );

  return (
    <>
      <form action={dispatch} className="form-styles">
        <Input
          required
          type="password"
          name="accessKeySecret"
          id="accessKeySecret"
          label="Access key secret"
        />
        <Input
          required
          name="accessKeyId"
          id="accessKeyId"
          label="Access key id"
        />
        <Input required name="bucketName" id="bucketName" label="Bucket name" />
        <Input required name="region" id="region" label="Region" />
        <Button disabled={isPending} type="submit">
          Connect to S3
        </Button>
      </form>
    </>
  );
});
