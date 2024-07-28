// @client
import React from "react";
import Leftover from "@/app/components/Leftover/Leftovers";
import { AuthorizationWrapper } from "@/app/util/authContext";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <AuthorizationWrapper pathname={pathname}>
      <Leftover />
    </AuthorizationWrapper>
  );
};

export default Page;
