import { Community, communityState } from "@/atoms/communitiesAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { async } from "@firebase/util";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import moment from "moment";
import router, { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const [loading, setLoading] = useState(false);

  // Delete community
  const deleteDocument = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(firestore, "communities", communityData.id));
      await deleteDoc(doc(firestore, "communitySnippets", communityData.id));
      router.push(`/`);
    } catch (error) {
      console.log("deleteDocument error", error);
    }

    setLoading(false);
  };

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });
      console.log("HERE IS DOWNLOAD URL", downloadURL);

      // April 24 - added state update
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
    // April 24 - removed reload
    // window.location.reload();

    setUploadingImage(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="black"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              {/*<Text>1</Text>
              <Text>Online</Text>*/}
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/c/${communityData.id}/submit`}>
            <Button bgColor="black" mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData?.creatorId && (
            <>
              <>
                <Divider />
                <Stack fontSize="10pt" spacing={1}>
                  <Text fontWeight={600}>Admin</Text>
                  <Flex align="center" justify="space-between">
                    <Text
                      color="blue.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => selectedFileRef.current?.click()}
                    >
                      Change Image
                    </Text>
                    {communityData?.imageURL || selectedFile ? (
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={selectedFile || communityData?.imageURL}
                        alt="Dan Abramov"
                      />
                    ) : (
                      <Icon
                        as={BsFillPlusCircleFill}
                        fontSize={40}
                        color="black"
                        mr={2}
                      />
                    )}
                  </Flex>
                  {selectedFile &&
                    (uploadingImage ? (
                      <Spinner />
                    ) : (
                      <Text cursor="pointer" onClick={onUpdateImage}>
                        Save Changes
                      </Text>
                    ))}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    hidden
                    ref={selectedFileRef}
                    onChange={onSelectFile}
                  />
                </Stack>
              </>
              <Divider />
              <Button
                variant="solid"
                bgColor="black"
                height="28px"
                display={{ base: "none", sm: "flex" }}
                width={{ base: "70px", md: "100px" }}
                mr={2}
                isLoading={loading}
                onClick={deleteDocument}
              >
                Delete
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
