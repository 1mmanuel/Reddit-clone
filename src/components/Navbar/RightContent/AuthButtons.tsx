import { authModalState } from "@/atoms/authModalAtom";
import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import React from "react";

const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="ghost"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "100px" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "login" })}
      >
        Log In
      </Button>
      <Button
        variant="ghost"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "100px" }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
